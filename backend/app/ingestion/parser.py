"""Document parser for extracting metadata and chunks from corpus documents."""

import re
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

from app.schemas.models import PassageMetadata, DocAuthorityTier, DocType, RetrievedPassage
from app.config import settings


@dataclass
class DocumentChunk:
    text: str
    metadata: PassageMetadata
    chunk_index: int


class DocumentParser:
    """Parses markdown documents with YAML frontmatter into structured chunks."""

    FRONTMATTER_PATTERN = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
    HEADER_PATTERN = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def parse_file(self, filepath: Path) -> List[DocumentChunk]:
        """Parse a single markdown file into chunks with metadata."""
        content = filepath.read_text(encoding="utf-8")

        # Extract frontmatter
        frontmatter_match = self.FRONTMATTER_PATTERN.match(content)
        if not frontmatter_match:
            raise ValueError(f"No frontmatter found in {filepath}")

        frontmatter_text = frontmatter_match.group(1)
        body = content[frontmatter_match.end():].strip()

        # Parse YAML frontmatter (simple key:value parser)
        metadata = self._parse_frontmatter(frontmatter_text, filepath.stem)

        # Split body into chunks
        chunks = self._chunk_text(body, metadata)

        return chunks

    def _parse_frontmatter(self, text: str, filename: str) -> PassageMetadata:
        """Parse YAML frontmatter into PassageMetadata."""
        data = {}
        for line in text.strip().split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                data[key.strip()] = value.strip().strip('"\'')

        # Parse supersedes list
        supersedes = []
        if 'supersedes' in data:
            supersedes_str = data['supersedes'].strip('[]')
            if supersedes_str:
                supersedes = [s.strip().strip('"\'') for s in supersedes_str.split(',')]

        return PassageMetadata(
            doc_id=data.get('doc_id', filename),
            title=data.get('title', filename),
            version=data.get('version', '1.0'),
            effective_date=data.get('effective_date', '2024-01-01'),
            authority_tier=DocAuthorityTier(int(data.get('authority_tier', 3))),
            doc_type=DocType(data.get('doc_type', 'POLICY')),
            supersedes=supersedes,
            domain_scope=data.get('domain_scope', 'general')
        )

    def _chunk_text(self, text: str, metadata: PassageMetadata) -> List[DocumentChunk]:
        """Split text into overlapping chunks by paragraphs."""
        # Split by headers first to keep sections together
        sections = self._split_by_headers(text)

        chunks = []
        chunk_index = 0

        for section_title, section_text in sections:
            # Further split large sections
            words = section_text.split()
            if len(words) <= self.chunk_size:
                chunk_text = section_text.strip()
                if chunk_text:
                    chunks.append(DocumentChunk(
                        text=chunk_text,
                        metadata=metadata,
                        chunk_index=chunk_index
                    ))
                    chunk_index += 1
            else:
                # Sliding window for large sections
                for i in range(0, len(words), self.chunk_size - self.chunk_overlap):
                    window = words[i:i + self.chunk_size]
                    chunk_text = ' '.join(window).strip()
                    if chunk_text:
                        chunks.append(DocumentChunk(
                            text=chunk_text,
                            metadata=metadata,
                            chunk_index=chunk_index
                        ))
                        chunk_index += 1

        return chunks

    def _split_by_headers(self, text: str) -> List[tuple]:
        """Split text by markdown headers, preserving header with content."""
        matches = list(self.HEADER_PATTERN.finditer(text))
        if not matches:
            return [("", text)]

        sections = []
        for i, match in enumerate(matches):
            header = match.group(2)
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            section_text = text[start:end].strip()
            sections.append((header, section_text))

        return sections


def load_corpus() -> List[DocumentChunk]:
    """Load all documents from corpus directory."""
    parser = DocumentParser()
    corpus_path = Path(settings.corpus_path)
    if not corpus_path.exists():
        candidates = [
            Path(__file__).resolve().parents[3] / "corpus" / "raw_docs",
            Path("corpus/raw_docs"),
            Path("../corpus/raw_docs"),
        ]
        for c in candidates:
            if c.exists():
                corpus_path = c
                break

    all_chunks = []

    for md_file in corpus_path.glob("*.md"):
        try:
            chunks = parser.parse_file(md_file)
            all_chunks.extend(chunks)
        except Exception as e:
            print(f"Error parsing {md_file}: {e}")

    return all_chunks


def load_manifest() -> Dict[str, Any]:
    """Load corpus manifest."""
    manifest_path = Path(settings.manifest_path)
    if not manifest_path.exists():
        candidates = [
            Path(__file__).resolve().parents[3] / "corpus" / "manifest.json",
            Path("corpus/manifest.json"),
            Path("../corpus/manifest.json"),
        ]
        for c in candidates:
            if c.exists():
                manifest_path = c
                break
    return json.loads(manifest_path.read_text(encoding="utf-8"))