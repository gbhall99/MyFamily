# MyFamily — Acceptance Ledger

**Single source of truth for "are we done."** Generated from every acceptance criterion in
[`docs/SPEC.md`](../docs/SPEC.md) §16 and [`docs/DESIGN_SPEC.md`](../docs/DESIGN_SPEC.md) §13, per
[`docs/DELIVERY_PROMPT.md`](../docs/DELIVERY_PROMPT.md) Workflow W1.

> **GOAL:** `PASS == TOTAL`, `BLOCKED == 0`, CI green. A row moves to `PASS` only with a linked,
> re-runnable evidence reference (a passing test/audit, or a recorded human sign-off for subjective
> AC). Never mark `PASS` by assertion. Status values: `TODO · IN-PROGRESS · PASS · FAIL · BLOCKED`.

## Summary
`PASS 2 / TOTAL 63 · IN-PROGRESS 19 · BLOCKED 5 · FAIL 0 · TODO 37`

_Last updated: 2026-06-14 · Stage: iteration 1 — monorepo scaffolded (Expo+TS, approved), design-token
system + verification (contrast, colour-blind, token-lint) + interaction logic (Approve chip,
autonomy ladder, activity log) landed with CI. Pipeline green: lint + typecheck + 26 tests._

**Legend / honesty rules:** `PASS` = a binding mechanism is fully implemented AND gated by a
re-runnable check. `IN-PROGRESS` = the foundation/logic is evidenced by passing tests but the
screen-level / end-to-end half is not built yet (so NOT counted as done). `BLOCKED` = needs a §7
gate — real-family studies or live third-party credentials — and cannot be closed autonomously.
Evidence links are test files / CI steps; re-run with `pnpm run verify`.

---

## A. Product — Global Definition of Done (SPEC §16.1)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-G1 | Validated on ≥5 realistic family datasets incl. a messy/edge case | Integration tests over dataset fixtures | TODO | — |
| AC-G2 | Whole-family: non-primary members act without setup/account (push/SMS fallback) | E2E test of fallback channels | TODO | — |
| AC-G3 | Capture cost ≤ 1 gesture (photo/forward/paste/voice), never a required form | UX flow test + lint on capture entry points | IN-PROGRESS | pipeline accepts photo/text/email/voice: `packages/core` capture (`test/capture.test.ts`); UI entry points pending |
| AC-G4 | Proactive: surfaces the right thing before asked in ≥70% of relevant cases | Eval harness over scenario set | TODO | — |
| AC-G5 | Every app action is logged, plain-language explained, undoable; no irreversible/financial w/o approval | Activity-log integration tests + guardrail tests | IN-PROGRESS | mechanism: `packages/ui` approve+activityLog (`test/approve.test.ts`); E2E pending |
| AC-G6 | Calm: zero net default notifications; non-urgent → Daily Brief | Automated notification-budget check | TODO | — |
| AC-G7 | Accessible (WCAG AA), one-handed, glanceable; primary surface interactive < 2s | a11y audit + perf budget | TODO | — |
| AC-G8 | Privacy by default: minimal kids' data, none for training, role-scoped; privacy review | Privacy review + data-flow tests | TODO | — |
| AC-G9 | Graceful failure: AI defers when unsure; confidence threshold + human-in-loop | Unit tests on confidence gating | IN-PROGRESS | `packages/core` capture confidence gate (`test/capture.test.ts`); live model pending |

## B. Product — Per-capability AC (SPEC §16.2)

| ID | Capability | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-P1 | Family Brain & Capture | Flyer photo → event (title/date/time/loc/child) ≥90% fields, <10s, ≤1 correction tap | Extraction eval on labeled fixtures | IN-PROGRESS | pipeline + extractor interface built (`packages/core` capture); ≥90% accuracy eval needs live model |
| AC-P2 | Family Brain & Capture | Duplicate provider merged or flagged; never a silent conflicting duplicate | Unit/integration entity-resolution tests | IN-PROGRESS | `resolveProvider` tested (match/ambiguous/created): `packages/core/test/capture.test.ts` |
| AC-P3 | Calendar & Conflict radar | Same-driver/car clash detected & explained before the day; ≥1 one-tap resolution | Integration tests on conflict scenarios | IN-PROGRESS | `detectConflicts` tested (before-day, resolutions): `packages/core/test/conflict.test.ts`; one-tap UI pending |
| AC-P4 | Calendar & Conflict radar | Two-way Google/Apple/Outlook sync reconciles < 60s, no duplicates | Integration test vs sandbox calendars | TODO | — |
| AC-P5 | Fair-Share | Load breakdown includes anticipatory/cognitive work; "feels accurate" ≥80% user tests | Proxy metric test **+ human-validation gate** | TODO | — |
| AC-P6 | Fair-Share | New task routed to under-loaded member in-context; non-primary completion rises over 4-wk test | E2E routing test **+ longitudinal study gate** | TODO | — |
| AC-P7 | Meals → grocery | Plan respects all hard constraints (allergies 100%) and fits the night's time window | Constraint-solver unit/property tests | IN-PROGRESS | `planWeek` tested (allergen-safe + time-fit): `packages/core/test/meals.test.ts` |
| AC-P8 | Meals → grocery | Approved plan → correct cart + order placed; plan change updates order/list | E2E vs sandbox grocery integration | TODO | needs sandbox grocery integration |
| AC-P9 | Comms & drafts | Thread summary contains every action item, zero fabricated commitments | Summarization eval on labeled threads | IN-PROGRESS | `summariseActionItems` tested (verbatim, no fabrication): `packages/core/test/comms.test.ts` |
| AC-P10 | Comms & drafts | Drafted message always shown for approval unless category set full-auto | Behavior tests across autonomy levels | IN-PROGRESS | `draftGate` tested across levels: `packages/core/test/comms.test.ts` |
| AC-P11 | Inbox / doc triage | ≥90% true action items → dated assigned tasks; ≤1/20 false escalation | Triage eval on labeled inbox corpus | IN-PROGRESS | metric harness ≥0.9 recall / ≤0.05 false-escalation on fixture: `triage.test.ts`; real corpus + model pending |
| AC-P12 | Inbox / doc triage | Permission-slip tracked to completion; doc retrievable < 5s at point of need | E2E + search latency test | TODO | — |
| AC-P13 | Agentic layer | NL goal → approvable, editable plan (date/logistics/invites/tasks/provisioning) | E2E co-pilot plan test | TODO | — |
| AC-P14 | Agentic layer | Autonomy level obeyed exactly (Notify never acts; Full-auto never interrupts); visible & revocable | Behavior matrix tests | IN-PROGRESS | logic: `packages/ui/test/autonomy.test.ts`; control UI pending |
| AC-P15 | Agentic layer | Every agent action in the activity log within seconds, with reason + undo | Activity-log integration tests | IN-PROGRESS | logic: `packages/ui/test/approve.test.ts` (logs reason+undo); live agent pending |
| AC-P16 | Daily Brief | Brief shows logistics/conflicts/≤3 one-tap decisions/handled; readable <60s; opened ≥60% active days | Render test + comprehension proxy **+ usage-metric gate** | TODO | — |
| AC-P17 | Trust & safety | Under-13: minimized data, verifiable consent, retention disclosed, provably excluded from training | Data-flow tests + privacy review | TODO | — |
| AC-P18 | Trust & safety | Teen privacy boundaries (location/chat/visibility) honored, never silently overridden | Access-control tests | TODO | — |
| AC-P19 | Trust & safety | Cross-member access role-scoped; verified by access-control test suite | Access-control test suite | TODO | — |

## C. Product — Launch gates (SPEC §16.3, inherently human-validated)

| ID | Gate | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-LG0 | Phase 0 Wedge | ≥80% test families say capture+conflict+Brief caught something missed, week 1 | Human-validation study | BLOCKED | needs real-family study (§7 gate) |
| AC-LG1 | Phase 1 Load | Non-primary task completion rises **and** primary reports reduced mental load | Validated survey study | BLOCKED | needs real-family study (§7 gate) |
| AC-LG2 | Phase 2 Provision | Families let app complete a closed-loop action end-to-end and rate it trustworthy | Human-validation study | BLOCKED | needs real-family study + live integrations (§7 gate) |
| AC-LG3 | Phase 3 Whole family | ≥1.5 active members per household sustained over 4 weeks | Usage-metric study | BLOCKED | needs live cohort over 4 weeks (§7 gate) |
| AC-LGE | Every phase | North-star (proactive actions accepted/family) trends up; approval rate above trust threshold | Metrics dashboard + sign-off | BLOCKED | needs production telemetry + sign-off (§7 gate) |

## D. Design — Global Definition of Done (DESIGN_SPEC §13.1)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-D1 | Contrast passes §10 floors, light + dark | Automated contrast audit (both themes) | IN-PROGRESS | token-level: `packages/tokens/test/contrast.test.ts`; per-screen audit pending |
| AC-D2 | Touch targets ≥44pt/48dp with spacing | Automated layout assertion | TODO | — |
| AC-D3 | Dynamic Type 200% — no truncation/overlap/lost function | Snapshot tests at 200% scale | TODO | — |
| AC-D4 | Light/dark parity, dark not degraded | Dual-theme snapshot tests | TODO | — |
| AC-D5 | Primary action reachable one-handed (thumb zone) | Layout-zone assertion | TODO | — |
| AC-D6 | Full state set: default/loading/empty/error, calm | State-coverage tests | TODO | — |
| AC-D7 | Tokens only: zero hard-coded hex/spacing/type/radius/duration | Token-lint rule (CI) | PASS | `tooling/token-lint.mjs` enforced in `.github/workflows/ci.yml`; scope grows with app |
| AC-D8 | Reduced-motion variant exists & honored; no meaning lost | Reduced-motion tests | TODO | — |
| AC-D9 | Color independence; passes color-blind simulation | Sim check + non-color-cue lint | TODO | — |
| AC-D10 | Screen-reader: labels/roles/values/focus order (VoiceOver+TalkBack) | a11y-tree assertions | TODO | — |
| AC-D11 | Localization-ready: pseudo-loc +30–40% no clip; RTL-safe; no baked text | Pseudo-loc + RTL snapshots | TODO | — |
| AC-D12 | Calm budget: zero net default notifications, no attention-grabbing motion | Notification-budget check | TODO | — |
| AC-D13 | Glanceable: primary value comprehensible < 3s | Comprehension proxy **+ human-validation** | TODO | — |

## E. Design — Per-area AC (DESIGN_SPEC §13.2)

| ID | Area | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-DA1 | Color & tokens | Every color resolves to a semantic token & passes contrast L/D; no raw hex | Token-lint + contrast audit | IN-PROGRESS | `token-lint.mjs` + `contrast.test.ts`; per-screen audit pending |
| AC-DA2 | Color & tokens | 8 member accents distinguishable under deuter/protan/tritan + grayscale; non-color cue | Color-blind sim + cue lint | IN-PROGRESS | palette: `member-accents.test.ts` (sim ΔE≥6 both themes); non-colour cue at chip pending |
| AC-DA3 | Typography | Text at 200% fully readable, no overlap/clip; roles map to scale (no off-scale sizes) | Snapshot + style-audit | TODO | — |
| AC-DA4 | Approve chip (hero) | Accept in one gesture; shows outcome; inline edit + undo; accept ≠ destructive weight | Component interaction tests | IN-PROGRESS | logic+style: `approve.test.ts`, `styles.ts` (brand≠danger weight); rendered chip + haptic pending |
| AC-DA5 | Approve chip (hero) | On approve: calm confirm + gentle haptic, visible undo, action in activity log | Interaction + integration tests | IN-PROGRESS | logic: `approve.test.ts` (undo+log); haptic/confirm UI pending |
| AC-DA6 | Daily Brief | Shows logistics/conflicts/≤3 decisions/handled; comprehensible <60s, L/D, 200% | Render + comprehension tests | TODO | — |
| AC-DA7 | Autonomy-ladder | Current level + consequence unmistakable; change immediate & reversible | Component behavior tests | IN-PROGRESS | logic: `autonomy.test.ts` (consequenceCopy per level); control UI pending |
| AC-DA8 | Motion | Durations/easing use tokens; respects reduced-motion; calm thresholds; interruptible | Motion-token + reduced-motion tests | TODO | — |
| AC-DA9 | Capture affordances | Snap/voice/paste/forward reachable in thumb zone; ≤1 gesture; no required form | Flow test + zone assertion | TODO | — |
| AC-DA10 | Accessibility | Every shipped screen passes screen-reader: roles/values/order; calm live regions | a11y-tree assertions | TODO | — |
| AC-DA11 | Platform & surfaces | Each surface follows OS conventions, keeps brand; Family-Display hides sensitive data | Surface review checklist + tests | TODO | — |
| AC-DA12 | Age/role modes | Modes differ in density/type/tone/actions; semantics/components/a11y floor identical; none below AA | Per-mode a11y + snapshot tests | TODO | — |
| AC-DA13 | Content & tone | Copy states what/why, single next step, no guilt/urgency; error/empty recoverable | Copy-lint + review checklist | TODO | — |

## F. Design — Review gate (DESIGN_SPEC §13.3, process)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-DG1 | No screen ships without design-lead sign-off vs §13.1 + relevant §13.2 | Review-gate process check | TODO | — |
| AC-DG2 | Accessibility audit is blocking — an AA failure blocks release | CI gate (a11y blocking) | IN-PROGRESS | CI runs contrast/accent tests as gate (`ci.yml`); full screen-reader/a11y audit pending |
| AC-DG3 | Tokens are single source of truth; implementation reviewed for token fidelity | Token-lint + review (AC-D7) | PASS | `tooling/token-lint.mjs` blocks raw values in CI |
| AC-DG4 | Deviations require explicit recorded design-lead exception in the PR | PR checklist enforcement | TODO | — |
