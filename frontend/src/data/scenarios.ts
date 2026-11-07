import { ResolutionStatus } from '../types'

export interface ConflictCase {
  id: string
  code: string
  label: string
  query: string
  tag: string
  status: ResolutionStatus
  rule: string
  summary: string
  left: {
    doc_id: string
    title: string
    quote: string
    tier: number
    date: string
    state: 'governing' | 'stale' | 'unresolved'
  }
  right: {
    doc_id: string
    title: string
    quote: string
    tier: number
    date: string
    state: 'governing' | 'stale' | 'unresolved'
  }
}

export const CASES: ConflictCase[] = [
  {
    id: 'remote-work',
    code: 'CASE 01',
    label: 'Remote work supersession',
    query: 'How many days per week can employees work remotely according to the policy?',
    tag: 'Explicit supersession',
    status: ResolutionStatus.RESOLVED_CONFLICT,
    rule: 'Domain addendum supersedes general policy',
    summary:
      'A 2025 engineering addendum grants four remote days to field engineers and explicitly supersedes the one-day limit in the 2024 corporate policy.',
    left: {
      doc_id: 'ENG-MEMO-25',
      title: 'Engineering Scope Addendum',
      quote:
        'Field and systems engineering personnel are permitted remote flexibility up to four (4) days per week.',
      tier: 4,
      date: '2025-01-10',
      state: 'governing',
    },
    right: {
      doc_id: 'HR-POL-2024',
      title: 'Corporate Remote Work Policy',
      quote:
        'Full-time employees may work remotely up to one (1) day per week with department approval.',
      tier: 3,
      date: '2024-03-01',
      state: 'stale',
    },
  },
  {
    id: 'retention',
    code: 'CASE 02',
    label: 'Equal-tier retention deadlock',
    query: 'What is the mandatory cold-storage retention window for telemetry audit logs?',
    tag: 'Autonomous abstention',
    status: ResolutionStatus.UNRESOLVABLE_ABSTAIN,
    rule: 'Equal authority, concurrent dates, irreconcilable scope',
    summary:
      'Two Tier 2 directives mandate three years and seven years of retention on the same effective date. No precedence rule can break the tie, so the ledger stops.',
    left: {
      doc_id: 'SEC-DIR-2025',
      title: 'Security Data Retention Directive',
      quote:
        'Telemetry audit logs shall be permanently purged after a mandatory retention period of 36 months.',
      tier: 2,
      date: '2025-06-01',
      state: 'unresolved',
    },
    right: {
      doc_id: 'REG-COMP-2025',
      title: 'Regulatory Compliance Standard',
      quote:
        'System telemetry and immutable access audit logs must remain in cold storage for not less than seven (7) years.',
      tier: 2,
      date: '2025-06-01',
      state: 'unresolved',
    },
  },
  {
    id: 'sla',
    code: 'CASE 03',
    label: 'SLA over legacy FAQ',
    query: 'What is the guaranteed uptime SLA for enterprise cloud deployments?',
    tag: 'Authority precedence',
    status: ResolutionStatus.RESOLVED_CONFLICT,
    rule: 'Tier 1 Master Service Agreement controls',
    summary:
      'A legacy FAQ advertises 99.9% uptime. The active Master Service Agreement guarantees 99.99% and revokes the older guidance.',
    left: {
      doc_id: 'MSA-2025',
      title: 'Master Service Agreement 2025',
      quote: 'Guaranteed core cloud service uptime SLA is 99.99% per calendar month.',
      tier: 1,
      date: '2025-01-01',
      state: 'governing',
    },
    right: {
      doc_id: 'FAQ-2023',
      title: 'Legacy Customer Portal FAQ',
      quote: 'Standard uptime targets across standard cloud environments are 99.9%.',
      tier: 5,
      date: '2023-04-15',
      state: 'stale',
    },
  },
  {
    id: 'hallucination',
    code: 'CASE 04',
    label: 'The unsupported question',
    query: 'What is the maximum reimbursement amount for private aircraft charter expenses?',
    tag: 'Zero-grounding filter',
    status: ResolutionStatus.UNRESOLVABLE_ABSTAIN,
    rule: 'No supporting passage exists in any tier',
    summary:
      'The corpus contains no provision for private aircraft charter. TruthGuard refuses to invent a limit and leaves the question unanswered.',
    left: {
      doc_id: 'CORPUS',
      title: 'All five authority tiers',
      quote: 'Zero passages retrieved for the predicate “private aircraft charter reimbursement”.',
      tier: 0,
      date: '—',
      state: 'unresolved',
    },
    right: {
      doc_id: 'CLAIM',
      title: 'Synthesizer draft',
      quote: 'A speculative numeric ceiling, generated without a source span.',
      tier: 0,
      date: '—',
      state: 'stale',
    },
  },
]

export const CASE_BY_QUERY = Object.fromEntries(CASES.map((c) => [c.query, c])) as Record<
  string,
  ConflictCase
>
