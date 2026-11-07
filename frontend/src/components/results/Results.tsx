import { useState } from 'react'
import { ArrowUpRight, Check, Copy, X } from 'lucide-react'
import type {
  ClaimAuditResult,
  ContradictionEdge,
  PositionSurfaced,
  TruthGuardResponse,
} from '../../types'
import { ResolutionStatus } from '../../types'
import { plainText, shortHash, splitSentences, statusMeta, tierLabel, tierNumber } from '../../lib/labels'

interface ResultsProps {
  response: TruthGuardResponse
}

function CopyHash({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(value)
    } catch {
      /* clipboard unavailable — the hash stays selectable */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" className="copy-hash" onClick={copy} title={value}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied' : shortHash(value)}
    </button>
  )
}

function StatusPill({ status }: { status: ResolutionStatus }) {
  const meta = statusMeta(status)
  return <span className={`status-pill ${meta.className}`}>{meta.label}</span>
}

function VerdictCard({ response }: ResultsProps) {
  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Disposition</span>
        <StatusPill status={response.status} />
      </div>

      <p className="verdict-answer">{plainText(response.final_answer)}</p>

      <div className="result-meta-row">
        <span className="rm">LATENCY <b>{Math.round(response.latency_ms)} ms</b></span>
        <span className="rm">POSITIONS {response.positions_surfaced?.length ?? 0}</span>
        <span className="rm">CONFLICTS {response.contradictions_detected?.length ?? 0}</span>
        <span className="rm">EVIDENCE {response.retrieved_passages?.length ?? 0}</span>
        <span className="rm">SEAL {shortHash(response.merkle_provenance?.merkle_root ?? response.provenance_sha256, 8, 6)}</span>
      </div>
    </div>
  )
}

function AbstainPanel({ response }: ResultsProps) {
  if (response.status !== ResolutionStatus.UNRESOLVABLE_ABSTAIN) return null

  const reason = response.claim_audits?.find((audit) => audit.failure_reason)?.failure_reason

  return (
    <div className="abstain-panel">
      <p className="abstain-kicker">Autonomous abstention</p>
      <h4>No verdict. The record cannot support one.</h4>
      <p>
        {reason ??
          'The magistrate found no precedence rule that can break the tie. Both positions are surfaced as-is, without a governing answer.'}
      </p>
    </div>
  )
}

function positionClass(position: PositionSurfaced, status: ResolutionStatus) {
  if (position.is_governing) return 'governing'
  if (position.is_stale) return 'stale'
  if (status === ResolutionStatus.UNRESOLVABLE_ABSTAIN) return 'deadlock'
  return ''
}

function PositionsCard({ response }: ResultsProps) {
  const positions = response.positions_surfaced ?? []
  if (!positions.length) return null

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Positions surfaced</span>
        <span className="meta-mono text-ink-soft">{positions.length} passages</span>
      </div>

      <div className="position-grid">
        {positions.map((position) => {
          const state = positionClass(position, response.status)
          const stamp = position.is_governing
            ? 'Governing'
            : position.is_stale
              ? 'Stale'
              : response.status === ResolutionStatus.UNRESOLVABLE_ABSTAIN
                ? 'Unresolved'
                : 'Reference'

          return (
            <article key={position.doc_id} className={`position-card ${state}`.trim()}>
              <div className="position-head">
                <p className="position-title">{position.title}</p>
                <span className={`pill-tag ${position.is_governing ? 'pill-tag-filled' : ''}`.trim()}>{stamp}</span>
              </div>

              <p className="position-claim">“{plainText(position.claim_text)}”</p>

              <div className="position-foot">
                <span>TIER {tierNumber(position.authority_tier)} · {tierLabel(position.authority_tier)}</span>
                <span>{position.effective_date}</span>
                <span>{position.doc_id}</span>
                {position.resolution_rule && <span>{position.resolution_rule}</span>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function ContradictionsCard({ response }: ResultsProps) {
  const contradictions = response.contradictions_detected ?? []
  const [expanded, setExpanded] = useState(false)
  if (!contradictions.length) return null

  const ranked = [...contradictions].sort((a, b) => b.confidence - a.confidence)
  const visible = expanded ? ranked : ranked.slice(0, 6)

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Contradiction ledger</span>
        <span className="meta-mono text-ink-soft">{contradictions.length} edge(s)</span>
      </div>

      {visible.map((edge: ContradictionEdge, index) => (
        <div
          key={`${edge.passage_a_id}-${edge.passage_b_id}`}
          className={index === visible.length - 1 ? 'pt-1' : 'border-b border-line-light-soft pb-4 pt-1'}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="label-2 text-signal">{edge.nli_label}</span>
            <span className="meta-mono text-ink-soft">{Math.round(edge.confidence * 100)}% confidence</span>
          </div>

          <p className="mt-1.5 text-[0.76rem] leading-relaxed">{edge.conflict_summary}</p>

          <div className="confidence-track mt-3">
            <i style={{ width: `${Math.round(edge.confidence * 100)}%` }} />
          </div>

          <div className="mt-2 flex flex-wrap justify-between gap-2">
            <span className="meta-mono text-muted">{edge.passage_a_id}</span>
            <span className="meta-mono text-muted">{edge.passage_b_id}</span>
          </div>

          {edge.resolution_rule && (
            <p className="meta-mono mt-2 text-signal">{edge.resolution_rule}</p>
          )}
        </div>
      ))}

      {contradictions.length > 6 && (
        <button type="button" className="ledger-toggle" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show highest-confidence only' : `Show all ${contradictions.length} edges`}
        </button>
      )}
    </div>
  )
}

function ClaimsCard({ response }: ResultsProps) {
  const audits = response.claim_audits ?? []
  if (!audits.length) return null

  const supportedAudits = audits.filter((audit) => audit.is_supported)
  const sentences = splitSentences(plainText(response.final_answer))
  // The published answer is assembled from supported claims only, so sentence
  // order aligns with supported-audit order when the counts agree. Otherwise
  // the answer was rewritten by the resolver and we do not guess a mapping.
  const canMap = sentences.length > 0 && sentences.length === supportedAudits.length

  let supportedIndex = -1

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Claim audit</span>
        <span className="meta-mono text-ink-soft">
          {supportedAudits.length}/{audits.length} supported
        </span>
      </div>

      {audits.map((audit: ClaimAuditResult) => {
        const rowIndex = audit.is_supported ? ++supportedIndex : -1
        const text = canMap && rowIndex >= 0 ? sentences[rowIndex] : undefined
        const fallbackText = audit.is_supported
          ? 'Retained claim — its source span is cited below.'
          : 'Stripped before publication — no retrieved passage entails this claim.'

        return (
          <div key={audit.claim_id} className="claim-row">
            <span className={`claim-mark ${audit.is_supported ? 'ok' : 'fail'}`}>
              {audit.is_supported ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
            </span>

            <div className="claim-body">
              <p className="claim-id">
                {audit.claim_id}
                {audit.relies_on_stale_source ? ' · STALE SOURCE' : ''}
              </p>
              <p className={`claim-text ${audit.is_supported ? '' : 'claim-text-muted'}`.trim()}>
                {text ?? fallbackText}
              </p>

              {audit.failure_reason && <p className="claim-reason">{audit.failure_reason}</p>}

              {audit.supporting_passage_ids.length > 0 && (
                <p className="meta-mono mt-1 text-muted">↳ {audit.supporting_passage_ids.join(' · ')}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TraceCard({ response }: ResultsProps) {
  const trace = response.trace ?? []
  if (!trace.length) return null

  const groups = trace.reduce<{ step: string; action: string; count: number; latency: number }[]>((acc, item) => {
    const existing = acc.find((group) => group.step === item.step)
    const latency = Number.isFinite(item.latency_ms) ? item.latency_ms : 0
    if (existing) {
      existing.count += 1
      existing.latency += latency
    } else {
      acc.push({
        step: item.step,
        action: item.action,
        count: 1,
        latency,
      })
    }
    return acc
  }, [])

  return (
    <div className="result-card dark">
      <div className="result-card-head">
        <span className="result-label">Agent trace</span>
        <span className="meta-mono text-parchment/55">{Math.round(response.latency_ms)} ms</span>
      </div>

      {groups.map((group, index) => (
        <div key={`${group.step}-${index}`} className="trace-row">
          <span className="trace-index">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="trace-name">{group.step}</p>
            <p className="trace-action">
              {group.action}
              {group.count > 1 ? ` · ${group.count} records` : ''}
            </p>
          </div>
          <span className="trace-ms">{group.latency > 0 ? `${Math.round(group.latency)} ms` : '—'}</span>
        </div>
      ))}
    </div>
  )
}

function MerkleCard({ response }: ResultsProps) {
  const merkle = response.merkle_provenance
  const root = merkle?.merkle_root ?? response.provenance_sha256.replace(/^0x/, '')
  const leafCount = merkle?.leaf_count ?? response.claim_audits?.length ?? 0
  const proofs = merkle?.inclusion_proofs ? Object.keys(merkle.inclusion_proofs).length : 0

  return (
    <div className="result-card dark">
      <div className="result-card-head">
        <span className="result-label">Merkle receipt</span>
        <CopyHash value={root} />
      </div>

      <p className="break-all font-mono text-[0.62rem] leading-relaxed text-parchment/80">{root}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-parchment/15 pt-3">
        <div>
          <p className="meta-mono text-parchment/40">LEAVES</p>
          <p className="mt-1 text-sm font-bold">{leafCount}</p>
        </div>
        <div>
          <p className="meta-mono text-parchment/40">PROOFS</p>
          <p className="mt-1 text-sm font-bold">{proofs || leafCount}</p>
        </div>
        <div>
          <p className="meta-mono text-parchment/40">ALGO</p>
          <p className="mt-1 text-sm font-bold">SHA-256</p>
        </div>
      </div>

      {merkle?.leaf_hashes?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {merkle.leaf_hashes.slice(0, 8).map((leaf, index) => (
            <span
              key={`${leaf}-${index}`}
              className="rounded border border-parchment/15 px-1.5 py-0.5 font-mono text-[0.54rem] text-parchment/55"
            >
              {leaf.slice(0, 10)}
            </span>
          ))}
        </div>
      ) : null}

      <a
        href={`/api/audit/${root}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline-dark btn-sm mt-4"
      >
        Open audit endpoint
        <ArrowUpRight />
      </a>
    </div>
  )
}

function HygieneCard({ response }: ResultsProps) {
  const hygiene = response.corpus_hygiene
  const prs = hygiene?.auto_prs ?? []
  if (!prs.length) return null

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Corpus hygiene</span>
        <span className="meta-mono text-ink-soft">
          {hygiene?.infected_documents ?? prs.length} document(s) flagged
        </span>
      </div>

      {prs.map((pr) => (
        <div key={pr.stale_doc_id} className="border-b border-line-light-soft pb-4 last:border-0 last:pb-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[0.76rem] font-semibold">
              {pr.stale_doc_id} → {pr.governing_doc_id}
            </p>
            <span className="pill-tag text-ink/70">
              infection {Math.round(pr.infection_score * 100)}%
            </span>
          </div>

          <pre className="mt-3 overflow-x-auto rounded-md bg-[#151512] p-3 font-mono text-[0.58rem] leading-relaxed text-parchment/80">
            {pr.unified_diff_patch}
          </pre>
        </div>
      ))}
    </div>
  )
}

function ProbesCard({ response }: ResultsProps) {
  const probes = response.counterfactual_probes ?? []
  if (!probes.length) return null

  return (
    <div className="result-card">
      <div className="result-card-head">
        <span className="result-label">Counterfactual probes</span>
        <span className="meta-mono text-ink-soft">{probes.length}</span>
      </div>

      {probes.map((probe, index) => (
        <p key={`${probe}-${index}`} className="border-b border-line-light-soft py-2.5 text-[0.74rem] last:border-0">
          <span className="meta-mono mr-2 text-muted">{String(index + 1).padStart(2, '0')}</span>
          {probe}
        </p>
      ))}
    </div>
  )
}

export function Results({ response }: ResultsProps) {
  return (
    <div id="results" className="results-shell scroll-mt-[90px]">
      <VerdictCard response={response} />
      <AbstainPanel response={response} />

      <div className="results-columns">
        <div className="flex flex-col gap-3.5">
          <PositionsCard response={response} />
          <ClaimsCard response={response} />
          <HygieneCard response={response} />
          <ProbesCard response={response} />
        </div>

        <div className="flex flex-col gap-3.5">
          <TraceCard response={response} />
          <ContradictionsCard response={response} />
          <MerkleCard response={response} />
        </div>
      </div>
    </div>
  )
}
