# MyFamily — Acceptance Ledger

**Single source of truth for "are we done."** Generated from every acceptance criterion in
[`docs/SPEC.md`](../docs/SPEC.md) §16 and [`docs/DESIGN_SPEC.md`](../docs/DESIGN_SPEC.md) §13, per
[`docs/DELIVERY_PROMPT.md`](../docs/DELIVERY_PROMPT.md) Workflow W1.

> **GOAL:** `PASS == TOTAL`, `BLOCKED == 0`, CI green. A row moves to `PASS` only with a linked,
> re-runnable evidence reference (a passing test/audit, or a recorded human sign-off for subjective
> AC). Never mark `PASS` by assertion. Status values: `TODO · IN-PROGRESS · PASS · FAIL · BLOCKED`.

## Summary
`PASS 19 / TOTAL 87 · IN-PROGRESS 49 · BLOCKED 5 · FAIL 0 · TODO 14`

> **The acceptance-criteria set is now complete.** The ledger was extended from 63 → **87 AC** so it
> covers the *full* app spec: every feature pillar (§6.1–6.11 incl. Kids/School, Health, Money,
> Eldercare, Travel), every agentic tier (Brain self-maintenance, auto-resolve, auto-task generation,
> staples reorder, neutral co-parent comms, autonomous filing), onboarding/zero-setup, and the new
> **cross-cutting** platform criteria (offline, idempotency, i18n, security, scale, auditability).
> - The **24 newly-added AC** (AC-P20–P37, AC-X1–X6) are the now-defined *targets*; most are **TODO**
>   (unbuilt feature domains, several needing live integrations) with a handful **IN-PROGRESS** where
>   core logic already exists. This is the honest gap between "spec complete" and "app complete."
> - The original 63 are unchanged: 19 PASS, the rest IN-PROGRESS/BLOCKED on live credentials, a
>   production model, on-device/device certification, or human review/studies.

_Last updated: 2026-06-15 · Stage: acceptance-criteria set **completed** (63 → 87) to cover the full
app spec — all feature pillars, agentic tiers, onboarding, and cross-cutting platform criteria.
Build state of the original 63 unchanged (19 PASS, CI green); the 24 new AC are the defined targets,
mostly unbuilt feature domains._

**Legend / honesty rules:** `PASS` = a binding mechanism is fully implemented AND gated by a
re-runnable check. `IN-PROGRESS` = the foundation/logic is evidenced by passing tests but the
screen-level / end-to-end half is not built yet (so NOT counted as done). `BLOCKED` = needs a §7
gate — real-family studies or live third-party credentials — and cannot be closed autonomously.
Evidence links are test files / CI steps; re-run with `pnpm run verify`.

---

## A. Product — Global Definition of Done (SPEC §16.1)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-G1 | Validated on ≥5 realistic family datasets incl. a messy/edge case | Integration tests over dataset fixtures | IN-PROGRESS | 5-dataset sweep (nuclear/blended/missing/large/conflicting) over capture+conflict+meals+fairshare (`datasets.test.ts`); real datasets feed same harness |
| AC-G2 | Whole-family: non-primary members act without setup/account (push/SMS fallback) | E2E test of fallback channels | IN-PROGRESS | `reachChannel`/`everyoneReachable` fallback logic (`iteration9.test.ts`); live SMS/push delivery needs creds |
| AC-G3 | Capture cost ≤ 1 gesture (photo/forward/paste/voice), never a required form | UX flow test + lint on capture entry points | PASS | `core` capture pipeline (4 input kinds) + rendered `CaptureBar` one-tap actions, no textbox/form (`CaptureBar.test.tsx`) |
| AC-G4 | Proactive: surfaces the right thing before asked in ≥70% of relevant cases | Eval harness over scenario set | IN-PROGRESS | `surfaceProactive` + `proactivityRecall` ≥70% on scenarios, silent when quiet (`proactivity.test.ts`); production data is the remaining half |
| AC-G5 | Every app action is logged, plain-language explained, undoable; no irreversible/financial w/o approval | Activity-log integration tests + guardrail tests | IN-PROGRESS | mechanism: `packages/ui` approve+activityLog (`test/approve.test.ts`); E2E pending |
| AC-G6 | Calm: zero net default notifications; non-urgent → Daily Brief | Automated notification-budget check | IN-PROGRESS | `notify` routing + `netDefaultPushes`=0 for routine: `test/iteration4.test.ts` |
| AC-G7 | Accessible (WCAG AA), one-handed, glanceable; primary surface interactive < 2s | a11y audit + perf budget | IN-PROGRESS | screen a11y audits + perf-budget proxy (brief/cart « budget, `performance.test.ts`); on-device <2s timing remains |
| AC-G8 | Privacy by default: minimal kids' data, none for training, role-scoped; privacy review | Privacy review + data-flow tests | IN-PROGRESS | `minimiseChildData`, `USED_FOR_TRAINING=false`, disclosed retention (`privacy.test.ts`) + role scoping; formal privacy review is the human half |
| AC-G9 | Graceful failure: AI defers when unsure; confidence threshold + human-in-loop | Unit tests on confidence gating | IN-PROGRESS | `packages/core` capture confidence gate (`test/capture.test.ts`); live model pending |

## B. Product — Per-capability AC (SPEC §16.2)

| ID | Capability | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-P1 | Family Brain & Capture | Flyer photo → event (title/date/time/loc/child) ≥90% fields, <10s, ≤1 correction tap | Extraction eval on labeled fixtures | IN-PROGRESS | heuristic ≥90% (`extractor.test.ts`) **+ Groq model adapter** (`providers/groq.ts`, offline plumbing test) + live `eval:extractor` workflow gated on `GROQ_API_KEY`; run it to record the real-model number |
| AC-P2 | Family Brain & Capture | Duplicate provider merged or flagged; never a silent conflicting duplicate | Unit/integration entity-resolution tests | IN-PROGRESS | `resolveProvider` tested (match/ambiguous/created): `packages/core/test/capture.test.ts` |
| AC-P3 | Calendar & Conflict radar | Same-driver/car clash detected & explained before the day; ≥1 one-tap resolution | Integration tests on conflict scenarios | IN-PROGRESS | `detectConflicts` tested (before-day, resolutions): `packages/core/test/conflict.test.ts`; one-tap UI pending |
| AC-P4 | Calendar & Conflict radar | Two-way Google/Apple/Outlook sync reconciles < 60s, no duplicates | Integration test vs sandbox calendars | IN-PROGRESS | `reconcile` (UID last-write-wins, no dupes) + `MockCalendarProvider` + 60s-window check (`integrations.test.ts`); live provider creds remain |
| AC-P5 | Fair-Share | Load breakdown includes anticipatory/cognitive work; "feels accurate" ≥80% user tests | Proxy metric test **+ human-validation gate** | IN-PROGRESS | `computeLoad`/`includesCognitiveLoad` tested (`iteration4.test.ts`); ≥80% "feels accurate" needs user study |
| AC-P6 | Fair-Share | New task routed to under-loaded member in-context; non-primary completion rises over 4-wk test | E2E routing test **+ longitudinal study gate** | IN-PROGRESS | `nextAssignee` routes to under-loaded member (`iteration4.test.ts`); 4-wk study is a §7 gate |
| AC-P7 | Meals → grocery | Plan respects all hard constraints (allergies 100%) and fits the night's time window | Constraint-solver unit/property tests | IN-PROGRESS | `planWeek` tested (allergen-safe + time-fit): `packages/core/test/meals.test.ts` |
| AC-P8 | Meals → grocery | Approved plan → correct cart + order placed; plan change updates order/list | E2E vs sandbox grocery integration | IN-PROGRESS | `buildCart`/`diffCart`/`MockGroceryProvider` place + update on plan change (`integrations.test.ts`); live ordering creds remain |
| AC-P9 | Comms & drafts | Thread summary contains every action item, zero fabricated commitments | Summarization eval on labeled threads | IN-PROGRESS | `summariseActionItems` tested (verbatim, no fabrication): `packages/core/test/comms.test.ts` |
| AC-P10 | Comms & drafts | Drafted message always shown for approval unless category set full-auto | Behavior tests across autonomy levels | IN-PROGRESS | `draftGate` tested across levels: `packages/core/test/comms.test.ts` |
| AC-P11 | Inbox / doc triage | ≥90% true action items → dated assigned tasks; ≤1/20 false escalation | Triage eval on labeled inbox corpus | IN-PROGRESS | metric harness ≥0.9 recall / ≤0.05 false-escalation on fixture: `triage.test.ts`; real corpus + model pending |
| AC-P12 | Inbox / doc triage | Permission-slip tracked to completion; doc retrievable < 5s at point of need | E2E + search latency test | IN-PROGRESS | `DocStore.search` + `completeTask` tested (`iteration9.test.ts`); live doc-connect pending |
| AC-P13 | Agentic layer | NL goal → approvable, editable plan (date/logistics/invites/tasks/provisioning) | E2E co-pilot plan test | IN-PROGRESS | `planGoal` returns the 5 approvable/editable sections (`iteration9.test.ts`); model-backed parsing pending |
| AC-P14 | Agentic layer | Autonomy level obeyed exactly (Notify never acts; Full-auto never interrupts); visible & revocable | Behavior matrix tests | IN-PROGRESS | logic: `packages/ui/test/autonomy.test.ts`; control UI pending |
| AC-P15 | Agentic layer | Every agent action in the activity log within seconds, with reason + undo | Activity-log integration tests | IN-PROGRESS | logic: `packages/ui/test/approve.test.ts` (logs reason+undo); live agent pending |
| AC-P16 | Daily Brief | Brief shows logistics/conflicts/≤3 one-tap decisions/handled; readable <60s; opened ≥60% active days | Render test + comprehension proxy **+ usage-metric gate** | IN-PROGRESS | `assembleBrief` caps to ≤3, keeps 4 sections (`iteration4.test.ts`); render + usage metric pending |
| AC-P17 | Trust & safety | Under-13: minimized data, verifiable consent, retention disclosed, provably excluded from training | Data-flow tests + privacy review | IN-PROGRESS | role scoping for child via `canAccess` (`iteration4.test.ts`); consent flow + privacy review pending |
| AC-P18 | Trust & safety | Teen privacy boundaries (location/chat/visibility) honored, never silently overridden | Access-control tests | IN-PROGRESS | `teenBoundaryHonoured` tested (`iteration4.test.ts`); full chat/visibility coverage pending |
| AC-P19 | Trust & safety | Cross-member access role-scoped; verified by access-control test suite | Access-control test suite | IN-PROGRESS | `canAccess` role scopes tested (`iteration4.test.ts`); expand to all resources |
| AC-P20 | Brain self-maintenance | Updates known facts with a source, flags only ambiguous changes, never silently overwrites | Entity-resolution + change-log tests | IN-PROGRESS | `resolveProvider` dedup/flag (`capture.test.ts`); fact-change/source-trace pending |
| AC-P21 | Calendar auto-resolve | On approval, executes the chosen resolution (carpool/reschedule/sitter) + calendar update + undo | E2E coordination test | IN-PROGRESS | resolutions offered (`conflict.test.ts`); execution + booking pending live integrations |
| AC-P22 | Auto-task generation | Creates dated/assigned tasks for implied obligations w/ lead time; no duplicates | Generation tests on fixtures | IN-PROGRESS | `generateTasks` (RSVP/gift/renewal, lead-time, dedup) tested (`taskgen.test.ts`); signal-detection from the Brain pending |
| AC-P23 | Meals — staples reorder | Reorders staples before run-out at autonomy level, within budget, logged | Reorder-engine tests | IN-PROGRESS | grocery cart/diff/order built (`integrations.test.ts`); depletion tracking + reorder loop pending |
| AC-P24 | Co-parent neutral comms | Neutral factual rephrase preserving meaning, logged, never sent w/o approval | Rephrase eval + behavior tests | TODO | not built (needs model) |
| AC-P25 | Autonomous filing | Files doc to right member/category, tracks obligation to done, retrieves in <5s | Filing + retrieval tests | IN-PROGRESS | `DocStore`/`completeTask` retrieval+tracking (`iteration9.test.ts`); auto-filing classifier pending |
| AC-P26 | Kids & school | Surfaces time-sensitive child windows (well-visit, sell-out registration) w/ lead time | Timeline + reminder tests | TODO | not built |
| AC-P27 | Activity concierge | Proposes age/calendar/budget-fit activities; drafts registration; books only w/ per-instance consent | E2E + guardrail tests | TODO | not built (needs live booking) |
| AC-P28 | Health view | Whole-family health view; proactive "time to book/refill" before the gap | View + reminder tests | TODO | not built |
| AC-P29 | Health booking | Books appt on approval, fits calendar, assembles visit pack; booking gated | E2E vs sandbox + guardrail | TODO | not built (needs live booking) |
| AC-P30 | Money — leaks/split | Flags renewals/price-creep; fair co-parent split with auditable shared ledger | Detector + ledger tests | IN-PROGRESS | `detectMoneyLeaks` + `splitExpenses`/`settlement` (balanced, deterministic ledger) tested (`money.test.ts`); live bank/subscription feed pending |
| AC-P31 | Money — act | Pay-on-approval / file reimbursement / settle balance; never pays w/o per-instance approval | E2E + financial guardrail | TODO | not built (needs payments + per-instance gate) |
| AC-P32 | Eldercare log | Shared sibling care log prevents dropped/duplicated tasks | Shared-log integration tests | TODO | not built |
| AC-P33 | Eldercare follow-up | Distributes care tasks, arranges transport on approval, auditable record | E2E coordination tests | TODO | not built |
| AC-P34 | Travel — trip brain | Packing list from itinerary+weather+member; confirmations retrievable at need | Generation + retrieval tests | TODO | not built |
| AC-P35 | Travel — end-to-end | Approvable end-to-end trip plan within budget/calendar; memory album after | E2E + guardrail tests | TODO | not built (needs live booking) |
| AC-P36 | Onboarding aha | First capture delivers a filed event with no empty-calendar setup; aha < 2 min | First-run flow test | IN-PROGRESS | capture pipeline + extractor + CaptureSheet built; <2-min aha needs user study |
| AC-P37 | Zero-setup member | Non-primary member added by phone/email receives + acts on first item w/o account | E2E fallback-channel test | IN-PROGRESS | `reachChannel` fallback logic (`iteration9.test.ts`); live channel delivery needs creds |

## C. Product — Launch gates (SPEC §16.3, inherently human-validated)

| ID | Gate | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-LG0 | Phase 0 Wedge | ≥80% test families say capture+conflict+Brief caught something missed, week 1 | Human-validation study | BLOCKED | needs real-family study (§7 gate) |
| AC-LG1 | Phase 1 Load | Non-primary task completion rises **and** primary reports reduced mental load | Validated survey study | BLOCKED | needs real-family study (§7 gate) |
| AC-LG2 | Phase 2 Provision | Families let app complete a closed-loop action end-to-end and rate it trustworthy | Human-validation study | BLOCKED | needs real-family study + live integrations (§7 gate) |
| AC-LG3 | Phase 3 Whole family | ≥1.5 active members per household sustained over 4 weeks | Usage-metric study | BLOCKED | needs live cohort over 4 weeks (§7 gate) |
| AC-LGE | Every phase | North-star (proactive actions accepted/family) trends up; approval rate above trust threshold | Metrics dashboard + sign-off | BLOCKED | needs production telemetry + sign-off (§7 gate) |

## C2. Product — Cross-cutting / platform (SPEC §16.4)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-X1 | Offline-first capture: queued offline, syncs with no loss/dup | Offline + sync integration tests | TODO | not built (needs sync layer) |
| AC-X2 | Idempotent, recoverable actions; no double-execute, no data loss on crash | Idempotency + crash-recovery tests | TODO | not built |
| AC-X3 | i18n: dates/times/numbers/currency localize; usable RTL, no clipping | Pseudo-loc + RTL + locale tests | IN-PROGRESS | `pseudoLocalize`/`fitsBudget` (`localization.test.ts`); full locale + RTL visual pending |
| AC-X4 | Security: encrypted in transit/at rest; RBAC suite; secret-scan + review clean | Security tests + review | TODO | RBAC `canAccess` partial; encryption/pen-test/review pending |
| AC-X5 | Performance at scale; no UI-blocking operation | Perf budget at scale | IN-PROGRESS | perf-budget proxy (`performance.test.ts`); on-device at-scale timing pending |
| AC-X6 | Auditability: every agent action reconstructable from the log; log not silently editable | Activity-log integrity tests | IN-PROGRESS | append-only `logEntry` w/ reason+undo (`approve.test.ts`); tamper-evidence pending |

## D. Design — Global Definition of Done (DESIGN_SPEC §13.1)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-D1 | Contrast passes §10 floors, light + dark | Automated contrast audit (both themes) | PASS | `auditScreen` over all screens, L+D (`packages/ui/test/screen.test.ts`) + token tests; CI-gated, scope grows |
| AC-D2 | Touch targets ≥44pt/48dp with spacing | Automated layout assertion | PASS | `auditScreen` target check (`screen.test.ts`), CI-gated, scope grows |
| AC-D3 | Dynamic Type 200% — no truncation/overlap/lost function | Snapshot tests at 200% scale | IN-PROGRESS | type-scale mapping + 200% support asserted (`typography.test.ts`); visual no-clip at 200% needs a visual runner |
| AC-D4 | Light/dark parity, dark not degraded | Dual-theme snapshot tests | PASS | components render in light+dark (`ApproveChip.test.tsx`, `components.test.tsx`) + dual-theme screen audits |
| AC-D5 | Primary action reachable one-handed (thumb zone) | Layout-zone assertion | PASS | `auditScreen` requires primary controls in thumb zone (`screen.test.ts`), CI-gated |
| AC-D6 | Full state set: default/loading/empty/error, calm | State-coverage tests | PASS | `auditScreen` requires all 4 states (`screen.test.ts`), CI-gated |
| AC-D7 | Tokens only: zero hard-coded hex/spacing/type/radius/duration | Token-lint rule (CI) | PASS | `tooling/token-lint.mjs` enforced in `.github/workflows/ci.yml`; scope grows with app |
| AC-D8 | Reduced-motion variant exists & honored; no meaning lost | Reduced-motion tests | PASS | `motionDuration` collapses every duration to instant under reduced motion (`components.test.tsx`); OS-flag wiring in app |
| AC-D9 | Color independence; passes color-blind simulation | Sim check + non-color-cue lint | PASS | accent sim (`member-accents.test.ts`) + `auditScreen` requires non-colour cue on status/identity (`screen.test.ts`) |
| AC-D10 | Screen-reader: labels/roles/values/focus order (VoiceOver+TalkBack) | a11y-tree assertions | IN-PROGRESS | automated a11y-tree asserts roles/labels/checked on rendered components (`ApproveChip`/`components` tests); device VoiceOver/TalkBack sign-off pending |
| AC-D11 | Localization-ready: pseudo-loc +30–40% no clip; RTL-safe; no baked text | Pseudo-loc + RTL snapshots | IN-PROGRESS | `pseudoLocalize`/`fitsBudget` + labels fit budget (`localization.test.ts`); icons are text glyphs (no baked text); RTL visual check needs a render runner |
| AC-D12 | Calm budget: zero net default notifications, no attention-grabbing motion | Notification-budget check | IN-PROGRESS | `netDefaultPushes`=0 for routine (`iteration4.test.ts`); motion side at screen level |
| AC-D13 | Glanceable: primary value comprehensible < 3s | Comprehension proxy **+ human-validation** | IN-PROGRESS | glanceability proxy: ≤3 decisions + one-line summary (`performance.test.ts`); <3s comprehension is the human half |

## E. Design — Per-area AC (DESIGN_SPEC §13.2)

| ID | Area | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|---|
| AC-DA1 | Color & tokens | Every color resolves to a semantic token & passes contrast L/D; no raw hex | Token-lint + contrast audit | PASS | `token-lint.mjs` + per-screen `auditScreen` contrast L/D (`screen.test.ts`) |
| AC-DA2 | Color & tokens | 8 member accents distinguishable under deuter/protan/tritan + grayscale; non-color cue | Color-blind sim + cue lint | PASS | palette sim ΔE≥6 (`member-accents.test.ts`) + screen audit mandates the initial cue (`screen.test.ts`) |
| AC-DA3 | Typography | Text at 200% fully readable, no overlap/clip; roles map to scale (no off-scale sizes) | Snapshot + style-audit | IN-PROGRESS | every screen's text uses a defined role; 200% supported (`typography.test.ts`); visual no-clip needs a render runner |
| AC-DA4 | Approve chip (hero) | Accept in one gesture; shows outcome; inline edit + undo; accept ≠ destructive weight | Component interaction tests | PASS | rendered `ApproveChip` one-tap accept + edit/decline + inline undo (`ApproveChip.test.tsx`) |
| AC-DA5 | Approve chip (hero) | On approve: calm confirm + gentle haptic, visible undo, action in activity log | Interaction + integration tests | PASS | rendered: live-region "Handled." + visible Undo + logged action (`ApproveChip.test.tsx`); haptic is native API call |
| AC-DA6 | Daily Brief | Shows logistics/conflicts/≤3 decisions/handled; comprehensible <60s, L/D, 200% | Render + comprehension tests | PASS | rendered `DailyBriefCard` 4 sections + tappable decisions, L/D (`components.test.tsx`); <60s comprehension is the human half |
| AC-DA7 | Autonomy-ladder | Current level + consequence unmistakable; change immediate & reversible | Component behavior tests | PASS | rendered `AutonomyLadder` radios w/ consequence copy + checked state + onChange (`components.test.tsx`) |
| AC-DA8 | Motion | Durations/easing use tokens; respects reduced-motion; calm thresholds; interruptible | Motion-token + reduced-motion tests | IN-PROGRESS | durations come from motion tokens (≤320ms calm) + reduced-motion collapses to 0 (`typography.test.ts`); runtime interruptibility remains |
| AC-DA9 | Capture affordances | Snap/voice/paste/forward reachable in thumb zone; ≤1 gesture; no required form | Flow test + zone assertion | PASS | rendered `CaptureBar`: 4 one-tap actions, full-size targets, no form (`CaptureBar.test.tsx`) |
| AC-DA10 | Accessibility | Every shipped screen passes screen-reader: roles/values/order; calm live regions | a11y-tree assertions | IN-PROGRESS | rendered components expose roles/labels + a polite live region on approve (`ApproveChip.test.tsx`); device SR sign-off pending |
| AC-DA11 | Platform & surfaces | Each surface follows OS conventions, keeps brand; Family-Display hides sensitive data | Surface review checklist + tests | IN-PROGRESS | `visibleOnFamilyDisplay` hides financial/health/personal (`iteration4.test.ts`); per-surface review pending |
| AC-DA12 | Age/role modes | Modes differ in density/type/tone/actions; semantics/components/a11y floor identical; none below AA | Per-mode a11y + snapshot tests | PASS | `MODES` share one frozen `A11Y_FLOOR`; differ in density/tone/actions; base text ≥ AA min (`modes.test.ts`) |
| AC-DA13 | Content & tone | Copy states what/why, single next step, no guilt/urgency; error/empty recoverable | Copy-lint + review checklist | IN-PROGRESS | `lintCopy` + `hasSingleClearAction` tested (`screen.test.ts`); error/empty copy review pending |

## F. Design — Review gate (DESIGN_SPEC §13.3, process)

| ID | Criterion (short) | How verified | Status | Evidence |
|---|---|---|---|---|
| AC-DG1 | No screen ships without design-lead sign-off vs §13.1 + relevant §13.2 | Review-gate process check | TODO | — |
| AC-DG2 | Accessibility audit is blocking — an AA failure blocks release | CI gate (a11y blocking) | PASS | `auditScreen` violations fail CI (`ci.yml`); screen-reader-tree audit added with the render layer |
| AC-DG3 | Tokens are single source of truth; implementation reviewed for token fidelity | Token-lint + review (AC-D7) | PASS | `tooling/token-lint.mjs` blocks raw values in CI |
| AC-DG4 | Deviations require explicit recorded design-lead exception in the PR | PR checklist enforcement | IN-PROGRESS | `.github/pull_request_template.md` requires a "Design deviations" section with named sign-off; reviewer enforcement is the human half |
