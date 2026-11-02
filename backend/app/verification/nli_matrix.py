"""Pairwise NLI contradiction matrix across chunks."""

from typing import List, Dict, Any, Tuple, Optional
import itertools

try:
    from sentence_transformers import CrossEncoder
    NLI_AVAILABLE = True
except ImportError:
    NLI_AVAILABLE = False

from app.schemas.models import ContradictionEdge, NLILabel
from app.config import settings


class NLIMatrix:
    """
    Pairwise cross-encoder NLI for contradiction detection.
    Falls back to heuristic scoring when NLI model unavailable.
    """

    def __init__(self):
        self.model: Optional[CrossEncoder] = None
        self._initialized = False

    def _init_model(self):
        """Initialize DeBERTa NLI cross-encoder."""
        if self._initialized:
            return

        if settings.nli_model_name and settings.nli_model_name.lower() != "none" and NLI_AVAILABLE:
            try:
                self.model = CrossEncoder(
                    settings.nli_model_name,
                    max_length=512,
                    device="cuda" if settings.nli_device == "cuda" else "cpu"
                )
            except Exception:
                self.model = None

        self._initialized = True

    def compute_matrix(
        self,
        passages: List[Tuple[str, str]],  # List of (passage_id, text)
        threshold: float = 0.70
    ) -> List[ContradictionEdge]:
        """
        Compute pairwise contradiction scores.
        Returns list of contradiction edges above threshold.
        """
        self._init_model()

        edges = []
        n = len(passages)

        for (id_a, text_a), (id_b, text_b) in itertools.combinations(passages, 2):
            if self.model:
                # Use cross-encoder
                scores = self.model.predict([(text_a, text_b)])
                if hasattr(scores, "__len__") and len(scores) > 0 and hasattr(scores[0], "__len__"):
                    scores = scores[0]
                # NLI cross-encoder outputs [neutral, contradiction, entailment]
                contradiction_conf = float(scores[1]) if len(scores) == 3 else 0.5
            else:
                # Heuristic fallback
                contradiction_conf = self._heuristic_contradiction(text_a, text_b)

            if contradiction_conf >= threshold:
                edges.append(ContradictionEdge(
                    passage_a_id=id_a,
                    passage_b_id=id_b,
                    nli_label=NLILabel.CONTRADICTION,
                    confidence=contradiction_conf,
                    conflict_summary=f"Contradiction detected between {id_a} and {id_b}"
                ))

        return edges

    def _heuristic_contradiction(self, text_a: str, text_b: str) -> float:
        """Heuristic contradiction detection fallback."""
        neg_indicators = ["not", "no", "never", "without", "cannot", "fail", "error"]
        pos_indicators = ["allow", "permitted", "valid", "correct", "success", "pass"]

        neg_count = sum(1 for w in neg_indicators if w in text_b.lower())
        pos_count = sum(1 for w in pos_indicators if w in text_b.lower())

        if neg_count > pos_count and neg_count > 1:
            return 0.75

        # Check for numeric conflict
        import re
        nums_a = set(int(x) for x in re.findall(r'\d+', text_a))
        nums_b = set(int(x) for x in re.findall(r'\d+', text_b))

        if nums_a and nums_b and nums_a != nums_b:
            return 0.80

        return 0.3


# Global instance
nli_matrix = NLIMatrix()