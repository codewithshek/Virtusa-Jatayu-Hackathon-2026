"""Bi-Temporal Authority & Supersession DAG using NetworkX."""

import json
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass

import networkx as nx

from app.schemas.models import DocAuthorityTier, DocType, PassageMetadata
from app.config import settings


@dataclass
class DAGNode:
    doc_id: str
    title: str
    version: str
    effective_date: str
    authority_tier: DocAuthorityTier
    doc_type: DocType
    supersedes: List[str]
    domain_scope: str


class AuthorityDAG:
    """
    Bi-Temporal Authority DAG that models document supersession relationships
    with both explicit edges (supersedes) and implicit authority/temporal ordering.
    """

    def __init__(self):
        self.graph = nx.DiGraph()
        self.nodes: Dict[str, DAGNode] = {}
        self._built = False

    def build_from_manifest(self, manifest_path: Optional[str] = None) -> "AuthorityDAG":
        """Build DAG from corpus manifest."""
        if manifest_path is None:
            manifest_path = settings.manifest_path

        path_obj = Path(manifest_path)
        if not path_obj.exists():
            alt = Path(__file__).resolve().parents[3] / "corpus" / "manifest.json"
            if alt.exists():
                path_obj = alt

        with open(path_obj, encoding="utf-8") as f:
            manifest = json.load(f)

        for doc in manifest["documents"]:
            node = DAGNode(
                doc_id=doc["doc_id"],
                title=doc["title"],
                version=doc["version"],
                effective_date=doc["effective_date"],
                authority_tier=DocAuthorityTier(doc["authority_tier"]),
                doc_type=DocType(doc["doc_type"]),
                supersedes=doc.get("supersedes", []),
                domain_scope=doc.get("domain_scope", "general")
            )
            self.nodes[node.doc_id] = node
            self.graph.add_node(node.doc_id, **node.__dict__)

        for doc in manifest["documents"]:
            for superseded_id in doc.get("supersedes", []):
                if superseded_id in self.nodes:
                    self.graph.add_edge(doc["doc_id"], superseded_id, edge_type="explicit_supersession")

        self._built = True
        return self

    def get_superseding_documents(self, doc_id: str) -> List[str]:
        """Get all documents that supersede the given document (transitive)."""
        if not self._built:
            self.build_from_manifest()

        if doc_id not in self.graph:
            return []

        return list(nx.ancestors(self.graph, doc_id))

    def get_superseded_documents(self, doc_id: str) -> List[str]:
        """Get all documents superseded by the given document (transitive)."""
        if not self._built:
            self.build_from_manifest()

        if doc_id not in self.graph:
            return []

        return list(nx.descendants(self.graph, doc_id))

    def is_superseded(self, doc_id: str) -> bool:
        """Check if a document is superseded by any other document."""
        return len(self.get_superseding_documents(doc_id)) > 0

    def get_governing_document(self, conflicting_doc_ids: List[str], domain_scope: Optional[str] = None) -> Optional[str]:
        """
        Determine the governing document among conflicting documents
        based on scope applicability, explicit supersession, authority tier, and temporal recency.
        """
        if not self._built:
            self.build_from_manifest()

        valid_docs = [d for d in conflicting_doc_ids if d in self.nodes]
        if not valid_docs:
            return None

        if len(valid_docs) == 1:
            return valid_docs[0]

        return self._resolve_conflict(valid_docs, domain_scope)

    def _resolve_conflict(self, doc_ids: List[str], domain_scope: Optional[str] = None) -> Optional[str]:
        """Apply Bi-Temporal Authority & Scope Resolution Rules."""
        nodes = [self.nodes[doc_id] for doc_id in doc_ids]

        # Pre-filter by scope applicability when a specific target domain_scope is requested
        if domain_scope:
            applicable = [
                n for n in nodes
                if getattr(n, "domain_scope", "general") in (domain_scope, "general")
            ]
            if len(applicable) == 1:
                return applicable[0].doc_id
            if applicable:
                nodes = applicable

        # Rule 1: Explicit Supersession Edge among applicable nodes (prefer highest authority/newest superseder)
        superseders = []
        node_ids = {n.doc_id for n in nodes}
        for node_b in nodes:
            if any(aid in getattr(node_b, "supersedes", []) for aid in node_ids if aid != node_b.doc_id):
                superseders.append(node_b)
        if superseders:
            superseders.sort(key=lambda n: (int(n.authority_tier), n.effective_date), reverse=True)
            return superseders[0].doc_id

        # Rule 2: Authority Hierarchy (higher tier wins if date >=)
        max_tier = max(n.authority_tier for n in nodes)
        top_tier_nodes = [n for n in nodes if n.authority_tier == max_tier]

        if len(top_tier_nodes) == 1:
            return top_tier_nodes[0].doc_id

        # Rule 3: Temporal Recency (same tier, newer wins)
        dates = [(n.doc_id, n.effective_date) for n in top_tier_nodes]
        dates.sort(key=lambda x: x[1], reverse=True)

        if dates[0][1] != dates[1][1]:
            return dates[0][0]

        # Rule 4: Deadlock - equal authority, identical effective date
        return None

    def get_lineage_path(self, doc_id: str) -> List[str]:
        """Get the full lineage path from root to this document."""
        if not self._built:
            self.build_from_manifest()

        if doc_id not in self.graph:
            return []

        ancestors = list(nx.ancestors(self.graph, doc_id))
        if not ancestors:
            return [doc_id]

        subgraph = self.graph.subgraph(ancestors + [doc_id])
        try:
            return list(nx.topological_sort(subgraph))
        except nx.NetworkXUnfeasible:
            return ancestors + [doc_id]

    def check_staleness(self, doc_id: str, conflicting_doc_ids: List[str]) -> Tuple[bool, Optional[str]]:
        """
        Check if a document is stale relative to conflicting documents.
        Returns (is_stale, superseded_by).
        """
        if not self._built:
            self.build_from_manifest()

        if doc_id not in self.nodes:
            return False, None

        node = self.nodes[doc_id]

        for other_id in conflicting_doc_ids:
            if other_id == doc_id or other_id not in self.nodes:
                continue

            other = self.nodes[other_id]

            if doc_id in other.supersedes:
                return True, other.doc_id

            if other.authority_tier > node.authority_tier and other.effective_date >= node.effective_date:
                return True, other.doc_id

            if other.authority_tier == node.authority_tier and other.effective_date > node.effective_date:
                if other.domain_scope == "general" or node.domain_scope == "general" or other.domain_scope == node.domain_scope:
                    return True, other.doc_id

        return False, None

    def get_visualization_data(self) -> Dict:
        """Get data for frontend DAG visualization."""
        if not self._built:
            self.build_from_manifest()

        nodes_data = []
        edges_data = []

        for doc_id, node in self.nodes.items():
            is_superseded = self.is_superseded(doc_id)
            nodes_data.append({
                "id": doc_id,
                "label": f"{doc_id}\n{node.title}",
                "tier": node.authority_tier.value,
                "tier_name": node.authority_tier.name,
                "date": node.effective_date,
                "scope": node.domain_scope,
                "is_superseded": is_superseded,
                "color": self._get_node_color(node.authority_tier, is_superseded)
            })

        for u, v, data in self.graph.edges(data=True):
            edges_data.append({
                "source": u,
                "target": v,
                "type": data.get("edge_type", "supersedes")
            })

        return {"nodes": nodes_data, "edges": edges_data}

    def _get_node_color(self, tier: DocAuthorityTier, is_superseded: bool) -> str:
        if is_superseded:
            return "#F59E0B"
        colors = {
            DocAuthorityTier.FAQ: "#6B7280",
            DocAuthorityTier.MEMO: "#3B82F6",
            DocAuthorityTier.POLICY: "#10B981",
            DocAuthorityTier.AMENDMENT: "#8B5CF6",
            DocAuthorityTier.REGULATORY_MANDATE: "#EF4444"
        }
        return colors.get(tier, "#6B7280")


authority_dag = AuthorityDAG()