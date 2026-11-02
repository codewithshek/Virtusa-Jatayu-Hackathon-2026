#!/usr/bin/env python3
"""
Seed Inconsistent Corpus Generator for TruthGuard
Generates 12 realistic enterprise documents with deliberate conflicts across 5 clusters.
"""

import json
from pathlib import Path

DOCUMENTS = {
    "POL-2023-v1_Remote_Work.md": """---
doc_id: POL-2023-v1
title: Remote Work Policy v1
version: "1.0"
effective_date: "2023-01-15"
authority_tier: 3
doc_type: POLICY
supersedes: []
domain_scope: general
---

# Remote Work Policy v1

**Effective Date**: January 15, 2023
**Version**: 1.0
**Authority**: Corporate Policy

## 1. Remote Work Allowance

All full-time employees are eligible to work remotely up to **four (4) days per week**. The remaining one (1) day must be worked from the designated office location.

## 2. Eligibility Criteria

- Completed 90-day probationary period
- Performance rating of "Meets Expectations" or higher
- Manager approval required

## 3. Equipment & Security

Company provides laptop, monitor, and VPN access. Employees must comply with Information Security Policy SEC-2022-01.

## 4. Revocation

Remote work privileges may be revoked with 30 days' notice for business needs or performance concerns.

---
*This policy is superseded by POL-2024-v2 effective March 1, 2024.*
""",

    "POL-2024-v2_Remote_Work.md": """---
doc_id: POL-2024-v2
title: Remote Work Policy v2
version: "2.0"
effective_date: "2024-03-01"
authority_tier: 3
doc_type: POLICY
supersedes: ["POL-2023-v1"]
domain_scope: general
---

# Remote Work Policy v2

**Effective Date**: March 1, 2024
**Version**: 2.0
**Authority**: Corporate Policy
**Supersedes**: POL-2023-v1

## 1. Remote Work Allowance

All full-time employees are eligible to work remotely up to **two (2) days per week**. The remaining three (3) days must be worked from the designated office location.

## 2. Eligibility Criteria

- Completed 90-day probationary period
- Performance rating of "Meets Expectations" or higher
- Manager and Director approval required

## 3. Core Collaboration Days

Tuesdays and Thursdays are designated as mandatory in-office collaboration days for all teams.

## 4. Equipment & Security

Company provides laptop, monitor, and VPN access. Employees must comply with Information Security Policy SEC-2022-01.

## 5. Revocation

Remote work privileges may be revoked with 14 days' notice for business needs or performance concerns.

---
*This policy is superseded by AMD-2025-03 for Field Engineering roles effective March 15, 2025.*
""",

    "AMD-2025-03_Remote_Work_Exec.md": """---
doc_id: AMD-2025-03
title: Executive Amendment: Remote Work Flexibility for Field Engineers
version: "1.0"
effective_date: "2025-03-15"
authority_tier: 4
doc_type: AMENDMENT
supersedes: ["POL-2024-v2", "POL-2023-v1"]
domain_scope: field_engineering
---

# Executive Amendment: Remote Work Flexibility for Field Engineers

**Effective Date**: March 15, 2025
**Version**: 1.0
**Authority**: Executive Amendment (CEO Office)
**Supersedes**: POL-2024-v2, POL-2023-v1 (for Field Engineering roles only)

## 1. Purpose

This amendment modifies the remote work policy specifically for **Field Engineering** roles to accommodate client-site travel requirements.

## 2. Remote Work Allowance for Field Engineers

Field Engineers may work remotely up to **three (3) days per week** when not deployed to client sites.

When deployed to client sites, Field Engineers follow the client's on-site requirements.

## 3. Applicability

This amendment applies **only** to employees with job family "Field Engineering" (job codes FE-*). All other roles remain governed by POL-2024-v2 (2 days/week maximum).

## 4. Supersession

This amendment explicitly supersedes POL-2024-v2 and POL-2023-v1 for the Field Engineering job family only.

## 5. Review Cycle

This amendment will be reviewed annually or upon material change to Field Engineering deployment model.

---
*Signed: CTO Office, March 15, 2025*
""",

    "FAQ-2023-HR_Onboarding.md": """---
doc_id: FAQ-2023-HR
title: HR Onboarding FAQ
version: "1.0"
effective_date: "2023-02-01"
authority_tier: 1
doc_type: FAQ
supersedes: []
domain_scope: general
---

# HR Onboarding Frequently Asked Questions

**Last Updated**: February 1, 2023

## Remote Work

**Q: How many days can I work from home?**
A: You can work remotely up to **4 days per week**. One day in the office is required for team sync. This is per the Remote Work Policy.

**Q: Do I need special approval for remote work?**
A: Yes, manager approval is required after your 90-day probation period.

## Benefits

**Q: When do health benefits start?**
A: Health benefits begin on your first day of employment.

**Q: What is the 401(k) match?**
A: Company matches 100% of first 4% of contributions.

## Equipment

**Q: What equipment is provided for remote work?**
A: Laptop, external monitor, keyboard, mouse, and VPN access are provided.

---
*NOTE: This FAQ has not been updated since 2023 and may contain outdated information. Refer to POL-2024-v2 and AMD-2025-03 for current policy.*
""",

    "SEC-2024-A_Data_Retention.md": """---
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
""",

    "SEC-2024-B_Data_Retention.md": """---
doc_id: SEC-2024-B
title: Compliance Policy v2: Data Retention
version: "2.0"
effective_date: "2024-06-01"
authority_tier: 3
doc_type: POLICY
supersedes: []
domain_scope: compliance_telemetry
---

# Compliance Policy v2: Data Retention for Telemetry Logs

**Effective Date**: June 1, 2024
**Version**: 2.0
**Authority**: Chief Compliance Officer

## 1. Telemetry Log Retention

All system telemetry logs (authentication, network flow, application metrics) **must be retained for three hundred sixty-five (365) days** from creation date.

## 2. Rationale

- Meet SOX Section 404 audit trail requirements
- Support forensic investigation timelines
- Satisfy industry regulatory retention mandates (PCI-DSS, HIPAA)

## 3. Exceptions

- None. Full 365-day retention is mandatory.

## 4. Implementation

Immutable write-once storage (WORM) required. Automated tiering to cold storage after 90 days.

## 5. Audit

Retention compliance audited annually by external auditor.

---
*This policy governs compliance telemetry only. Security requirements may differ.*
""",

    "SLA-2024-STD_Uptime.md": """---
doc_id: SLA-2024-STD
title: Telecom SLA: Standard Tier
version: "1.0"
effective_date: "2024-01-01"
authority_tier: 3
doc_type: SLA
supersedes: []
domain_scope: standard_tier
---

# Telecom Service Level Agreement — Standard Tier

**Effective Date**: January 1, 2024
**Version**: 1.0

## 1. Uptime Commitment

**99.9% monthly uptime** (allowing ~43 minutes downtime per month).

## 2. Latency

- P95 latency ≤ 100ms for domestic traffic
- P99 latency ≤ 250ms for domestic traffic

## 3. Service Credits

| Monthly Uptime | Credit |
|----------------|--------|
| < 99.9%        | 10% of monthly fee |
| < 99.5%        | 25% of monthly fee |
| < 99.0%        | 50% of monthly fee |

## 4. Exclusions

- Scheduled maintenance (max 4 hours/month with 72h notice)
- Force majeure events
- Customer equipment failures

## 5. Support

- Business hours support (9 AM - 6 PM local)
- 4-hour response time for P1 incidents

---
*Enterprise customers see SLA-2024-ENT for enhanced terms.*
""",

    "SLA-2024-ENT_Addendum.md": """---
doc_id: SLA-2024-ENT
title: Telecom SLA: Enterprise Addendum
version: "1.0"
effective_date: "2024-07-01"
authority_tier: 4
doc_type: AMENDMENT
supersedes: ["SLA-2024-STD"]
domain_scope: enterprise_tier
---

# Telecom SLA: Enterprise Addendum

**Effective Date**: July 1, 2024
**Version**: 1.0
**Authority**: VP Enterprise Services
**Supersedes**: SLA-2024-STD (for Enterprise tier customers only)

## 1. Uptime Commitment

**99.99% monthly uptime** (allowing ~4 minutes downtime per month).

## 2. Latency

- P95 latency ≤ 50ms for domestic traffic
- P99 latency ≤ 100ms for domestic traffic

## 3. Service Credits

| Monthly Uptime | Credit |
|----------------|--------|
| < 99.99%       | 15% of monthly fee |
| < 99.9%        | 30% of monthly fee |
| < 99.5%        | 50% of monthly fee |

## 4. Exclusions

- Scheduled maintenance (max 2 hours/month with 72h notice)
- Force majeure events
- Customer equipment failures

## 5. Support

- 24/7/365 dedicated support
- 15-minute response time for P1 incidents
- Named Technical Account Manager

## 6. Supersession

This addendum **fully replaces** SLA-2024-STD for Enterprise tier customers.
Standard tier customers remain on SLA-2024-STD.

---
*Contact Enterprise Sales for tier upgrade.*
""",

    "SOP-2023-CLIN_Escalation.md": """---
doc_id: SOP-2023-CLIN
title: Clinical Escalation SOP v1
version: "1.0"
effective_date: "2023-09-01"
authority_tier: 3
doc_type: SOP
supersedes: []
domain_scope: clinical_general
---

# Clinical Escalation Standard Operating Procedure v1

**Effective Date**: September 1, 2023
**Version**: 1.0

## 1. Critical Alert Escalation

**Time to escalate**: **30 minutes** from alert generation to attending physician notification.

## 2. Escalation Path

1. Automated alert → Charge Nurse (0-5 min)
2. Charge Nurse → Attending Physician (5-15 min)
3. Attending Physician → Specialist Consult (15-30 min)

## 3. Documentation

All escalations must be documented in EMR with timestamp and clinical rationale.

## 4. Non-Critical Alerts

- Warning alerts: 2-hour escalation window
- Advisory alerts: 24-hour review window

## 5. Weekend/Holiday Coverage

Same escalation times apply. On-call attending rotates weekly.

---
*Superseded by AMD-2024-EMERG for Emergency Department scenarios effective November 15, 2024.*
""",

    "AMD-2024-EMERG_Protocol.md": """---
doc_id: AMD-2024-EMERG
title: Emergency Protocol Amendment
version: "1.0"
effective_date: "2024-11-15"
authority_tier: 4
doc_type: AMENDMENT
supersedes: ["SOP-2023-CLIN"]
domain_scope: clinical_emergency
---

# Emergency Department Protocol Amendment

**Effective Date**: November 15, 2024
**Version**: 1.0
**Authority**: Chief Medical Officer
**Supersedes**: SOP-2023-CLIN (for Emergency Department only)

## 1. Critical Alert Escalation — Emergency Department

**Time to escalate**: **10 minutes** from alert generation to attending physician notification.

## 2. Escalation Path (ED)

1. Automated alert → ED Charge Nurse (0-2 min)
2. ED Charge Nurse → ED Attending (2-5 min)
3. ED Attending → Trauma/Specialist (5-10 min)

## 3. Scope

This amendment applies **only** to Emergency Department (location codes ED-*). All other clinical areas follow SOP-2023-CLIN (30-minute escalation).

## 4. Rationale

Emergency Department patient acuity and throughput require accelerated escalation timelines.

## 5. Documentation

Same documentation requirements as SOP-2023-CLIN with additional ED-specific timestamps.

---
*Signed: CMO Office, November 15, 2024*
""",

    "POL-2023-CLOUD_Expenses.md": """---
doc_id: POL-2023-CLOUD
title: Cloud Expense Reimbursement Policy
version: "1.0"
effective_date: "2023-05-01"
authority_tier: 3
doc_type: POLICY
supersedes: []
domain_scope: cloud_expenses
---

# Cloud Expense Reimbursement Policy

**Effective Date**: May 1, 2023
**Version**: 1.0
**Authority**: Corporate Policy

## 1. Monthly Reimbursement Limit

Employees may claim up to **$500 per month** for approved cloud service expenses (AWS, Azure, GCP, etc.) used for work purposes.

## 2. Approval Process

- Pre-approval required for expenses > $200/month
- Manager approval for all claims
- Finance review for claims > $400/month

## 3. Eligible Services

- Compute instances (EC2, VMs, Cloud Run)
- Managed databases (RDS, Cloud SQL)
- Storage (S3, Blob Storage)
- CDN and networking

## 4. Ineligible Expenses

- Personal cloud accounts
- Certification/training costs (separate budget)
- Reserved instances without 12-month commitment

## 5. Receipts

Itemized receipts required for all claims. Credit card statements not accepted.

---
*Finance Memo MEMO-2024-CLOUD provides supplementary guidance but does not modify policy limits.*
""",

    "MEMO-2024-CLOUD_Budget.md": """---
doc_id: MEMO-2024-CLOUD
title: Finance Memo: Cloud Budget Guidelines
version: "1.0"
effective_date: "2024-02-15"
authority_tier: 2
doc_type: MEMO
supersedes: []
domain_scope: cloud_expenses
---

# Finance Memo: Cloud Budget Guidelines

**Date**: February 15, 2024
**From**: Finance Department
**To**: All Engineering Managers

## 1. Budget Planning Guidance

For FY2024 planning, teams should budget **$300-400/month per engineer** for cloud expenses. This is a planning guideline, not a policy limit.

## 2. Cost Optimization

- Prefer reserved instances for stable workloads
- Enable auto-scaling with max limits
- Review unused resources monthly

## 3. Exception Process

Expenses exceeding $500/month (the policy limit in POL-2023-CLOUD) require:
- Director approval
- Business case documentation
- Finance pre-approval

## 4. Monitoring

Finance will provide monthly cloud spend reports by team. Managers should review variances > 20%.

---
*This memo provides budgetary guidance only. The reimbursement policy limit of $500/month in POL-2023-CLOUD remains in effect.*
"""
}


def main():
    raw_docs_dir = Path("corpus/raw_docs")
    raw_docs_dir.mkdir(parents=True, exist_ok=True)

    for filename, content in DOCUMENTS.items():
        filepath = raw_docs_dir / filename
        filepath.write_text(content, encoding="utf-8")
        print(f"Created: {filepath}")

    print(f"\nGenerated {len(DOCUMENTS)} documents in {raw_docs_dir}")


if __name__ == "__main__":
    main()