export enum DocAuthorityTier {
  FAQ = 1,
  MEMO = 2,
  POLICY = 3,
  AMENDMENT = 4,
  REGULATORY_MANDATE = 5,
}

export enum ResolutionStatus {
  CONSISTENT = 'CONSISTENT',
  RESOLVED_CONFLICT = 'RESOLVED_CONFLICT',
  UNRESOLVABLE_ABSTAIN = 'UNRESOLVABLE_ABSTAIN',
}

export enum NLILabel {
  CONTRADICTION = 'CONTRADICTION',
  ENTAILMENT = 'ENTAILMENT',
  NEUTRAL = 'NEUTRAL',
}

export interface PassageMetadata {
  doc_id: string
  title: string
  version: string
  effective_date: string
  authority_tier: number
  doc_type: string
  supersedes: string[]
  domain_scope: string
}

export interface RetrievedPassage {
  passage_id: string
  text: string
  score: number
  metadata: PassageMetadata
  is_stale: boolean
  superseded_by?: string
}

export interface PositionSurfaced {
  doc_id: string
  title: string
  claim_text: string
  is_governing: boolean
  is_stale: boolean
  authority_tier: number
  effective_date: string
  resolution_rule?: string
}

export interface ContradictionEdge {
  passage_a_id: string
  passage_b_id: string
  nli_label: string
  confidence: number
  conflict_summary: string
  resolution_rule?: string
}

export interface ClaimAuditResult {
  claim_id: string
  is_supported: boolean
  relies_on_stale_source: boolean
  failure_reason?: string
  supporting_passage_ids: string[]
}

export interface AgentTrace {
  step: string
  action: string
  latency_ms: number
  provider?: string
  contradictions_found?: number
  [key: string]: unknown
}

export interface MerkleProvenance {
  merkle_root?: string
  leaf_hashes?: string[]
  leaf_count?: number
  inclusion_proofs?: Record<string, string>
}

export interface SilentRevocation {
  doc_id?: string
  revoked_by?: string
  reason?: string
  [key: string]: unknown
}

export interface AutoPr {
  stale_doc_id: string
  governing_doc_id: string
  governing_date: string
  unified_diff_patch: string
  infection_score: number
}

export interface CorpusHygiene {
  infected_documents?: number
  auto_prs?: AutoPr[]
  [key: string]: unknown
}

export interface TruthGuardResponse {
  query: string
  status: ResolutionStatus
  final_answer: string
  positions_surfaced: PositionSurfaced[]
  contradictions_detected: ContradictionEdge[]
  claim_audits: ClaimAuditResult[]
  retrieved_passages: RetrievedPassage[]
  provenance_sha256: string
  merkle_provenance?: MerkleProvenance
  silent_revocations?: SilentRevocation[]
  corpus_hygiene?: CorpusHygiene
  counterfactual_probes?: string[]
  latency_ms: number
  trace?: AgentTrace[]
}

export interface DocumentNode {
  id: string
  label: string
  tier: number
  tier_name: string
  date: string
  scope: string
  is_superseded: boolean
  color?: string
}

export interface EdgeData {
  source: string
  target: string
  type: string
}

export interface DagData {
  nodes: DocumentNode[]
  edges: EdgeData[]
}
