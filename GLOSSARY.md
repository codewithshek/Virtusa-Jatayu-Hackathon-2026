# TruthGuard Domain Glossary & Epistemic Lexicon

This document formalizes the ubiquitous domain vocabulary for the TruthGuard Epistemic Forensic Engine and its interactive 3D telemetry interface.

---

### Core Epistemic & Forensic Concepts

#### 1. Epistemic Horological Spectrograph
The central 3D mechanical and optical instrument rendered via Three.js r187 and React Three Fiber. Modeled after 18th-century horological astronomical astrolabes and modern optical spectroscopy devices. It physically represents the health, consensus, and conflict dynamics of the underlying document corpus through counter-rotating titanium gimbal rings, 120 precision vernier scale ticks, a refractive crystal housing, and a domain-warped living shader nucleus.

#### 2. Evidence Blade
An orbiting 3D monolith blade bound to a specific document or clause in the corpus hierarchy (Tier 01 through Tier 05). Each blade features high-DPI Swiss typography, hairline borders, and a 3D cubic Bezier fiber-optic conduit linking its optical edge directly into the central spectrograph nucleus.

#### 3. Deontic Clash State
The state of diametric policy contradiction between two or more document clauses evaluated as bounded deontic intervals (e.g., $[0, 1] \cap [4, 5] = \emptyset$). When detected by the cross-encoder NLI model, the spectrograph flares with `#FF331F` (Conflict Vermilion), the gimbal rotation accelerates, and the conflicting evidence blades physically lock in head-to-head opposition.

#### 4. Authority DAG (Directed Acyclic Graph)
The deterministic 5-tier precedence hierarchy that resolves cross-document conflicts:
- **Tier 01 — Regulatory Mandate**: Governing legal and regulatory mandates (e.g., NIST, GDPR, SEC).
- **Tier 02 — Security Directive**: Binding organizational security directives.
- **Tier 03 — Formal Policy**: Standard corporate operating policies.
- **Tier 04 — Departmental Addendum / Memo**: Team-level or domain-specific exceptions.
- **Tier 05 — General FAQ / Guidelines**: Non-binding reference guidance.

#### 5. Silent Revocation
A condition where a higher-tier mandate implicitly or explicitly revokes an older lower-tier guideline without an explicit version supersession pointer (e.g., a mandatory FIDO2 hardware token rule silently revoking legacy SMS 2FA permissions). TruthGuard highlights this by rendering the stale clause with a vermilion strikethrough and flagging it as `PRUNED`.

#### 6. Autonomous Abstention Gate
An epistemic safety guarantee: when two diametrically conflicting claims possess identical effective dates and equal authority tiers (e.g., Tier 3 vs Tier 3), TruthGuard refuses to hallucinate a synthetic compromise or probabilistic average. The system deterministicly halts synthesis, triggering an Epistemic Refusal Ledger with mathematical explanation and full provenance audit.

#### 7. HMAC-SHA256 Merkle Provenance Receipt
The cryptographic Merkle tree digest generated across all cited atomic byte-spans and NLI validation trajectories. Guarantees tamper-proof lineage back to source document versions, compliant with RFC-2104.

#### 8. Chameleon Polarity Scroll Theatre
A 4-Act narrative scroll architecture that shifts between visual polarity modes:
- **Acts I & II (Darkroom Void `#060608`)**: High-contrast, tactile obsidian forensic environment.
- **Act III (Archival Parchment `#F4F1EA`)**: Warm tactile editorial parchment with `#111110` carbon ink, echoing historical Swiss print and legal gazettes for DAG exploration.
- **Act IV (Anodized Carbon `#09090B`)**: Dense technical console for live adversarial querying.

#### 9. Noise-Burn Curtain
A custom WebGL fragment shader employing 2D Simplex/Perlin noise with dynamic thresholding and glowing chromatic ember lines. Used to dissolve and transition between Darkroom Void and Archival Parchment without sudden CSS jumps.

#### 10. Dossier Grid & Tactical Crosshairs
An architectural layout system featuring $1\text{px}$ hairline borders (`rgba(244, 241, 234, 0.11)`), sharp corners (`rounded-none`), and tactical `+` corner crosshairs positioned at cell vertices.

