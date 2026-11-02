---
doc_id: SEC-2024-A
title: Security Policy v2: Data Retention
version: "2.0"
effective_date: "2024-06-01"
authority_tier: 3
doc_type: POLICY
supersedes: []
domain_scope: security_telemetry
---

# Security Policy v2: Data Retention for Telemetry Logs

**Effective Date**: June 1, 2024
**Version**: 2.0
**Authority**: Chief Information Security Officer

## 1. Telemetry Log Retention

All system telemetry logs (authentication, network flow, application metrics) **must be deleted after ninety (90) days** from creation date.

## 2. Rationale

- Minimize attack surface from log data exfiltration
- Reduce storage costs
- Align with data minimization principle (GDPR Art. 5)

## 3. Exceptions

- Security incident investigation: logs may be retained for 180 days with CISO approval
- Regulatory hold: indefinite retention with Legal notification

## 4. Implementation

Automated deletion pipeline runs daily at 02:00 UTC. No manual intervention required.

## 5. Audit

Retention compliance audited quarterly by Internal Audit.

---
*This policy governs security telemetry only. Compliance requirements may differ.*
