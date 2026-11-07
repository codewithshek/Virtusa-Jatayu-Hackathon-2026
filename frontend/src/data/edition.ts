export const NAV_SECTIONS = [
  { id: 'premise', num: '01', label: 'Premise' },
  { id: 'tribunal', num: '02', label: 'Agents' },
  { id: 'conflict-atlas', num: '03', label: 'Conflicts' },
  { id: 'workbench', num: '04', label: 'Workbench' },
  { id: 'authority', num: '05', label: 'Authority' },
  { id: 'provenance', num: '06', label: 'Provenance' },
  { id: 'notes', num: '07', label: 'Release notes' },
]

export const AGENTS = [
  {
    num: '01',
    name: 'The Archivist',
    role: 'Retriever agent',
    description:
      'Hybrid BM25 and dense-vector search pulls the top-K passages. Then the lineage graph expands the set, automatically retrieving documents that supersede or amend what the first pass found.',
    specs: ['BM25 0.5 + DENSE 0.5', 'TOP_K 10', 'DAG EXPANSION'],
    variant: 'stack' as const,
  },
  {
    num: '02',
    name: 'The Advocate',
    role: 'Synthesizer agent',
    description:
      'Drafts the candidate answer as atomic claims. Every sentence is bound to its source document and a verbatim quote span, so nothing can arrive without a receipt.',
    specs: ['ATOMIC CLAIMS', 'VERBATIM SPANS', 'NIM · LLAMA 3.1 70B'],
    variant: 'lens' as const,
  },
  {
    num: '03',
    name: 'The Adversary',
    role: 'Critic agent',
    description:
      'Three probes run in parallel: cross-document NLI contradiction, staleness and supersession across the bi-temporal DAG, and claim-to-quote entailment. It is built to break the draft.',
    specs: ['NLI ≥ 0.70', 'ENTAILMENT ≥ 0.75', '3 AUDIT VECTORS'],
    variant: 'scales' as const,
  },
  {
    num: '04',
    name: 'The Magistrate',
    role: 'Resolution engine',
    description:
      'Applies the five-tier authority ladder. It surfaces both positions, rules on precedence, splits by scope, or refuses when authority is tied. The verdict is deterministic and legible.',
    specs: ['EXPLICIT > TIER > RECENCY', 'ABSTAIN ON TIE', '3 RESOLUTION MODES'],
    variant: 'seal' as const,
  },
]

export const TIERS = [
  {
    num: '05',
    name: 'Regulatory mandate',
    desc: 'External law, regulation, or binding standard.',
  },
  {
    num: '04',
    name: 'Amendment',
    desc: 'An explicit, dated change to a policy.',
  },
  {
    num: '03',
    name: 'Formal policy',
    desc: 'The standing operating rule for the organization.',
  },
  {
    num: '02',
    name: 'Memo / addendum',
    desc: 'A domain-specific exception or interpretation.',
  },
  {
    num: '01',
    name: 'FAQ / guidance',
    desc: 'Reference material. Never silently treated as binding.',
  },
]

export const RESOLUTION_RULES = [
  {
    title: 'Explicit supersession',
    body: 'If document B names A in its supersedes list, B governs. No inference required.',
  },
  {
    title: 'Higher authority',
    body: 'When tiers differ, the higher tier wins — a mandate over an FAQ, a policy over a memo.',
  },
  {
    title: 'Temporal recency',
    body: 'At the same tier, the later effective date governs, provided the scopes overlap.',
  },
  {
    title: 'Scope split',
    body: 'When each claim owns a distinct valid scope, both stand and the conditions are surfaced.',
  },
]

export const RELEASE_NOTES = [
  {
    title: 'Hybrid retrieval that knows the family tree',
    body: 'BM25 and dense vectors find the passage. The authority DAG finds the version that replaced it.',
  },
  {
    title: 'Bi-temporal precedence',
    body: 'Effective dates, versions, and supersedes links are modeled as a directed acyclic graph, not a flat index.',
  },
  {
    title: 'Three-vector adversarial critique',
    body: 'Contradiction, staleness, and unsupported-claim probes run before any answer is allowed out.',
  },
  {
    title: 'An abstention gate with a spine',
    body: 'Equal authority and concurrent dates produce a refusal, not a probabilistic compromise.',
  },
  {
    title: 'Conditional scope resolution',
    body: 'When two policies apply to different roles or regions, both survive with their conditions attached.',
  },
  {
    title: 'Silent revocation detection',
    body: 'Find the guidance that was quietly overwritten without an explicit supersession pointer.',
  },
  {
    title: 'Corpus hygiene and redline patches',
    body: 'Stale documents are flagged with an infection score and a generated unified-diff patch.',
  },
  {
    title: 'Counterfactual probes',
    body: 'Every query produces the alternative questions that would have changed the retrieved evidence set.',
  },
  {
    title: 'Merkle provenance receipts',
    body: 'Each claim becomes a SHA-256 leaf. The root seals the answer and the inclusion proofs travel with it.',
  },
  {
    title: 'Claim-level audit ledger',
    body: 'See every sentence, its supporting passages, and the exact reason an unsupported claim was stripped.',
  },
  {
    title: 'Pluggable model providers',
    body: 'NVIDIA NIM, Gemini, Claude, OpenAI, or local Ollama. The audit logic does not depend on the model.',
  },
  {
    title: 'A 19-test verification suite',
    body: 'Abstention, contradiction, staleness, and unbacked-claim filtering are tested as invariants.',
  },
]

export const STATS = [
  { value: '1.000', label: 'Conflict F1' },
  { value: '100', unit: '%', label: 'Supersession accuracy' },
  { value: '100', unit: '%', label: 'Abstention precision' },
  { value: '19/19', label: 'Verification tests' },
]

export const CAPABILITY_STRIP = [
  '4 adversarial agents',
  '5 authority tiers',
  '3 resolution modes',
  '1 Merkle root',
]
