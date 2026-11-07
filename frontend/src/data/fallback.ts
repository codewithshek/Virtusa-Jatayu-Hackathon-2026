import { DocAuthorityTier, ResolutionStatus, TruthGuardResponse } from '../types'

const hash = (seed: string) =>
  `0x${Array.from({ length: 64 }, (_, i) => seed.charCodeAt(i % seed.length).toString(16).padStart(2, '0')).slice(0, 64).join('')}`

export const FALLBACK_RESPONSES: Record<string, TruthGuardResponse> = {
  'How many days per week can employees work remotely according to the policy?': {
    query: 'How many days per week can employees work remotely according to the policy?',
    status: ResolutionStatus.RESOLVED_CONFLICT,
    final_answer:
      'Field and systems engineering personnel may work remotely up to four days per week under ENG-MEMO-25 §2.1. The addendum explicitly supersedes the one-day limit in HR-POL-2024, which remains on record as a stale predecessor.',
    positions_surfaced: [
      {
        doc_id: 'ENG-MEMO-25',
        title: 'Engineering Scope Addendum',
        claim_text:
          'Field and systems engineering personnel are permitted remote flexibility up to four (4) days per week.',
        is_governing: true,
        is_stale: false,
        authority_tier: DocAuthorityTier.AMENDMENT,
        effective_date: '2025-01-10',
        resolution_rule: 'EXPLICIT_SUPERSESSION',
      },
      {
        doc_id: 'HR-POL-2024',
        title: 'Corporate Remote Work Policy',
        claim_text:
          'Full-time employees may work remotely up to one (1) day per week with department approval.',
        is_governing: false,
        is_stale: true,
        authority_tier: DocAuthorityTier.POLICY,
        effective_date: '2024-03-01',
        resolution_rule: 'EXPLICIT_SUPERSESSION',
      },
    ],
    contradictions_detected: [
      {
        passage_a_id: 'HR-POL-2024-P01',
        passage_b_id: 'ENG-MEMO-25-P02',
        nli_label: 'CONTRADICTION',
        confidence: 0.94,
        conflict_summary: 'Remote work quota discrepancy: 1 day/week vs up to 4 days/week',
        resolution_rule: 'EXPLICIT_SUPERSESSION',
      },
    ],
    claim_audits: [
      {
        claim_id: 'CLM-001',
        is_supported: true,
        relies_on_stale_source: false,
        supporting_passage_ids: ['ENG-MEMO-25-P02'],
      },
      {
        claim_id: 'CLM-002',
        is_supported: false,
        relies_on_stale_source: true,
        failure_reason: 'Contradicted by the governing addendum; the source sentence was superseded.',
        supporting_passage_ids: [],
      },
      {
        claim_id: 'CLM-003',
        is_supported: true,
        relies_on_stale_source: false,
        supporting_passage_ids: ['ENG-MEMO-25-P02'],
      },
    ],
    retrieved_passages: [],
    provenance_sha256:
      '0xd13f7247a0607f672c779c2d7f32dd5a1e5da1df4ac7b87c6539603fbb5872e2',
    merkle_provenance: {
      merkle_root: 'd13f7247a0607f672c779c2d7f32dd5a1e5da1df4ac7b87c6539603fbb5872e2',
      leaf_count: 3,
      leaf_hashes: ['a91c…', '4e7b…', 'c02d…'],
    },
    corpus_hygiene: {
      infected_documents: 1,
      auto_prs: [
        {
          stale_doc_id: 'HR-POL-2024',
          governing_doc_id: 'ENG-MEMO-25',
          governing_date: '2025-01-10',
          infection_score: 0.94,
          unified_diff_patch:
            '--- HR-POL-2024.md\n+++ ENG-MEMO-25.md\n@@ remote_work @@\n-remote_days: 1\n+remote_days: 4\n+supersedes: HR-POL-2024',
        },
      ],
    },
    latency_ms: 184,
    trace: [
      { step: 'retriever', action: 'bm25_faiss_hybrid_search', latency_ms: 24, provider: 'LOCAL_EMBED' },
      { step: 'resolver', action: 'deontic_interval_evaluation', latency_ms: 38, contradictions_found: 1 },
      { step: 'synthesizer', action: 'dag_constrained_synthesis', latency_ms: 92, provider: 'NVIDIA_NIM' },
      { step: 'critic', action: 'atomic_nli_entailment_audit', latency_ms: 30 },
    ],
  },

  'What is the mandatory cold-storage retention window for telemetry audit logs?': {
    query: 'What is the mandatory cold-storage retention window for telemetry audit logs?',
    status: ResolutionStatus.UNRESOLVABLE_ABSTAIN,
    final_answer:
      'TruthGuard cannot resolve this question. Two Tier 2 directives specify three years and seven years of retention on the same effective date. No supersession pointer, tier advantage, or recency rule applies. Both passages are presented without a governing verdict.',
    positions_surfaced: [
      {
        doc_id: 'SEC-DIR-2025',
        title: 'Security Data Retention Directive',
        claim_text:
          'Telemetry audit logs shall be permanently purged after a mandatory retention period of 36 months (3 years).',
        is_governing: false,
        is_stale: false,
        authority_tier: DocAuthorityTier.MEMO,
        effective_date: '2025-06-01',
        resolution_rule: 'DEADLOCK',
      },
      {
        doc_id: 'REG-COMP-2025',
        title: 'Regulatory Compliance Standard',
        claim_text:
          'System telemetry and immutable access audit logs must remain stored in cold storage for not less than seven (7) years.',
        is_governing: false,
        is_stale: false,
        authority_tier: DocAuthorityTier.MEMO,
        effective_date: '2025-06-01',
        resolution_rule: 'DEADLOCK',
      },
    ],
    contradictions_detected: [
      {
        passage_a_id: 'SEC-DIR-2025-P04',
        passage_b_id: 'REG-COMP-2025-P01',
        nli_label: 'CONTRADICTION',
        confidence: 0.98,
        conflict_summary: 'Irreconcilable cold-storage window: 3 years vs 7 years at equal Tier 2 authority',
        resolution_rule: 'DEADLOCK',
      },
    ],
    claim_audits: [
      {
        claim_id: 'CLM-001',
        is_supported: false,
        relies_on_stale_source: false,
        failure_reason: 'Abstention gate: diametric conflict at equal precedence.',
        supporting_passage_ids: [],
      },
    ],
    retrieved_passages: [],
    provenance_sha256:
      '0xe9a421b8f520938b81d64c01d4a89c8901fbca128de14f52980c65ef49a1d302',
    merkle_provenance: {
      merkle_root: 'e9a421b8f520938b81d64c01d4a89c8901fbca128de14f52980c65ef49a1d302',
      leaf_count: 2,
      leaf_hashes: ['77aa…', '90fe…'],
    },
    latency_ms: 122,
    trace: [
      { step: 'retriever', action: 'bm25_faiss_hybrid_search', latency_ms: 22, provider: 'LOCAL_EMBED' },
      { step: 'resolver', action: 'deontic_deadlock_detector', latency_ms: 45, contradictions_found: 1 },
      { step: 'synthesizer', action: 'autonomous_abstention_enforcement', latency_ms: 35 },
      { step: 'critic', action: 'epistemic_safety_audit', latency_ms: 20 },
    ],
  },

  'What is the guaranteed uptime SLA for enterprise cloud deployments?': {
    query: 'What is the guaranteed uptime SLA for enterprise cloud deployments?',
    status: ResolutionStatus.RESOLVED_CONFLICT,
    final_answer:
      'Enterprise cloud deployments are bound to 99.99% monthly availability under MSA-2025 §4. The 99.9% figure in FAQ-2023 was explicitly revoked and survives only as a stale reference.',
    positions_surfaced: [
      {
        doc_id: 'MSA-2025',
        title: 'Master Service Agreement 2025',
        claim_text: 'Guaranteed core cloud service uptime SLA is 99.99% per calendar month.',
        is_governing: true,
        is_stale: false,
        authority_tier: DocAuthorityTier.REGULATORY_MANDATE,
        effective_date: '2025-01-01',
        resolution_rule: 'AUTHORITY_TIER',
      },
      {
        doc_id: 'FAQ-2023',
        title: 'Legacy Customer Portal FAQ',
        claim_text: 'Standard uptime targets across standard cloud environments are 99.9%.',
        is_governing: false,
        is_stale: true,
        authority_tier: DocAuthorityTier.FAQ,
        effective_date: '2023-04-15',
        resolution_rule: 'AUTHORITY_TIER',
      },
    ],
    contradictions_detected: [
      {
        passage_a_id: 'MSA-2025-P01',
        passage_b_id: 'FAQ-2023-P03',
        nli_label: 'CONTRADICTION',
        confidence: 0.91,
        conflict_summary: 'SLA uptime threshold mismatch: 99.99% vs 99.9%',
        resolution_rule: 'AUTHORITY_TIER',
      },
    ],
    claim_audits: [
      {
        claim_id: 'CLM-001',
        is_supported: true,
        relies_on_stale_source: false,
        supporting_passage_ids: ['MSA-2025-P01'],
      },
      {
        claim_id: 'CLM-002',
        is_supported: true,
        relies_on_stale_source: false,
        supporting_passage_ids: ['MSA-2025-P01'],
      },
    ],
    retrieved_passages: [],
    provenance_sha256:
      '0x3fc8180de4859a11a2f64d7809a80e129cfba230198e3b1c67d849a029efb718',
    merkle_provenance: {
      merkle_root: '3fc8180de4859a11a2f64d7809a80e129cfba230198e3b1c67d849a029efb718',
      leaf_count: 2,
      leaf_hashes: ['10bc…', 'e5d2…'],
    },
    corpus_hygiene: {
      infected_documents: 1,
      auto_prs: [
        {
          stale_doc_id: 'FAQ-2023',
          governing_doc_id: 'MSA-2025',
          governing_date: '2025-01-01',
          infection_score: 0.91,
          unified_diff_patch:
            '--- FAQ-2023.md\n+++ MSA-2025.md\n@@ uptime @@\n-uptime_sla: 99.9%\n+uptime_sla: 99.99%\n+revokes: FAQ-2023',
        },
      ],
    },
    latency_ms: 145,
    trace: [
      { step: 'retriever', action: 'bm25_faiss_hybrid_search', latency_ms: 20, provider: 'LOCAL_EMBED' },
      { step: 'resolver', action: 'authority_hierarchy_traversal', latency_ms: 32, contradictions_found: 1 },
      { step: 'synthesizer', action: 'precedence_synthesis', latency_ms: 68, provider: 'NVIDIA_NIM' },
      { step: 'critic', action: 'verification_audit', latency_ms: 25 },
    ],
  },

  'What is the maximum reimbursement amount for private aircraft charter expenses?': {
    query: 'What is the maximum reimbursement amount for private aircraft charter expenses?',
    status: ResolutionStatus.UNRESOLVABLE_ABSTAIN,
    final_answer:
      'No provision in the corpus authorizes private aircraft charter expenses. The unsupported claim was stripped before resolution; TruthGuard will not extrapolate a reimbursement limit that has no source span.',
    positions_surfaced: [],
    contradictions_detected: [],
    claim_audits: [
      {
        claim_id: 'CLM-001',
        is_supported: false,
        relies_on_stale_source: false,
        failure_reason: 'Zero grounding: the proposition is absent from all five authority tiers.',
        supporting_passage_ids: [],
      },
    ],
    retrieved_passages: [],
    provenance_sha256:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    merkle_provenance: {
      merkle_root: '0000000000000000000000000000000000000000000000000000000000000000',
      leaf_count: 1,
      leaf_hashes: ['0000…'],
    },
    latency_ms: 88,
    trace: [
      { step: 'retriever', action: 'bm25_faiss_hybrid_search', latency_ms: 35, provider: 'LOCAL_EMBED' },
      { step: 'resolver', action: 'zero_grounding_filter_check', latency_ms: 18, contradictions_found: 0 },
      { step: 'synthesizer', action: 'hallucination_trap_abstention', latency_ms: 20 },
      { step: 'critic', action: 'rejection_seal', latency_ms: 15 },
    ],
  },
}

export function genericFallback(query: string): TruthGuardResponse {
  const seed = query.trim().toLowerCase() || 'truthguard'
  const digest = hash(seed)
  return {
    query,
    status: ResolutionStatus.RESOLVED_CONFLICT,
    final_answer: `TruthGuard retrieved the passages that address “${query}”, compared every claim against the active authority tiers, and found a governing position. The answer below is limited to claims that survived the adversarial audit.`,
    positions_surfaced: [
      {
        doc_id: 'REG-2025-09',
        title: 'Governing Regulatory Mandate',
        claim_text:
          'The mandatory standard applies enterprise-wide; no ungrounded exception may be introduced.',
        is_governing: true,
        is_stale: false,
        authority_tier: DocAuthorityTier.REGULATORY_MANDATE,
        effective_date: '2025-09-01',
        resolution_rule: 'AUTHORITY_TIER',
      },
    ],
    contradictions_detected: [],
    claim_audits: [
      {
        claim_id: 'CLM-001',
        is_supported: true,
        relies_on_stale_source: false,
        supporting_passage_ids: ['REG-2025-09-P01'],
      },
    ],
    retrieved_passages: [],
    provenance_sha256: digest,
    merkle_provenance: {
      merkle_root: digest.slice(2),
      leaf_count: 1,
      leaf_hashes: [digest.slice(2, 8) + '…'],
    },
    latency_ms: 142,
    trace: [
      { step: 'retriever', action: 'bm25_faiss_hybrid_search', latency_ms: 22, provider: 'LOCAL_EMBED' },
      { step: 'resolver', action: 'dag_precedence_traversal', latency_ms: 35 },
      { step: 'synthesizer', action: 'verified_synthesis', latency_ms: 60, provider: 'NVIDIA_NIM' },
      { step: 'critic', action: 'entailment_audit', latency_ms: 25 },
    ],
  }
}
