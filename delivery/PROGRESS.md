# Delivery progress log

Running record of the autonomous delivery loop (see `../docs/DELIVERY_PROMPT.md`). Newest first.

## Iteration 5 — 2026-06-14 · Screen-spec audits + content lint
`packages/ui`: a declarative **screen-spec model** with automated **design audits** (contrast,
touch-target, state-coverage, colour-independence) run over the real **Today/Daily-Brief** and
**Approve** screens in light + dark; the member-identity audit mandates the non-colour initial; a
**content/tone lint** bans guilt/urgency language and checks for a single clear next step.
**Verify:** 59/59 tests. **Ledger: PASS 2 → 8** (AC-D1, AC-D2, AC-D6, AC-D9, AC-DA1, AC-DA2 now have
screen-level, CI-gated evidence); IN-PROGRESS 27, BLOCKED 5, TODO 23.

## Iteration 4 — 2026-06-14 · Brief, Fair-Share, access control, calm budget
`packages/core`: **Daily Brief assembler** (caps to ≤3 decisions, 4 canonical sections — AC-P16/
AC-DA6); **Fair-Share engine** counting anticipatory/cognitive load and routing the next task to the
under-loaded member (AC-P5/P6); **role-scoped access** + teen-boundary honouring + Family-Display
redaction of financial/health/personal (AC-P17/P18/P19/AC-DA11); **calm notification budget** —
only urgent pushes, routine defers to the Brief, zero net default pushes (AC-G6/AC-D12).
**Verify:** 53/53 tests. Ledger: PASS 2, IN-PROGRESS 29, BLOCKED 5, TODO 27.

## Iteration 3 — 2026-06-14 · Meals, comms, triage
`packages/core`: allergen-safe + time-fit meal solver (AC-P7); thread summariser with no fabrication
(AC-P9); outgoing draft gate (AC-P10); inbox-triage metric harness ≥0.9 recall / ≤0.05 false-escalation
(AC-P11). **Verify:** 44/44 tests.

## Iteration 2 — 2026-06-14 · CI fix + Family Brain core
**Fixed:** CI failed (`pnpm/action-setup` rejected pnpm version specified in both the action and
`packageManager`). Removed the action's `version` input so it reads `packageManager`.

**Built** `packages/core` (pure-TS, sandbox/mock — no live credentials, per gate decision):
- **Provider-agnostic agent interface** (`agent.ts`): `EventExtractor` + confidence threshold;
  concrete providers (Claude / mock) are injected → model stays swappable.
- **Universal capture pipeline** (`capture.ts`): photo/text/email/voice → structured event with a
  confidence gate that defers to human review instead of acting wrongly (AC-G9), plus provider
  **entity resolution** that matches/flags/creates without silent duplicates (AC-P2).
- **Conflict radar** (`conflict.ts`): detects same-driver/time clashes before the day and returns
  plain-language explanations + concrete resolutions (AC-P3).

**Verification:** `pnpm run verify` → lint OK · typecheck OK · **35/35 tests pass** (9 new).

**Ledger movement:** IN-PROGRESS 10 → 15 (AC-G3, AC-G9, AC-P1, AC-P2, AC-P3 now have tested logic;
screen/E2E + live-model halves pending). PASS 2, BLOCKED 5 unchanged.

**Next:** Expo app shell themed from tokens; rendered Approve chip / Daily Brief / member-chip (with
the mandatory non-colour initial) + snapshot/a11y tests (needs the RN test toolchain — adds AC-D1–D6,
AC-DA2/DA4–DA6 screen-level evidence).

## Iteration 1 — 2026-06-14 · Foundations + verification harness
**Approval gates cleared:** tech stack — Expo + TypeScript monorepo; AI/agent layer behind a
provider-agnostic abstraction (Claude first).

**Built**
- pnpm monorepo: `packages/tokens`, `packages/ui`, `apps/mobile` (placeholder), `tooling/`, CI.
- **Design-token system** (`packages/tokens`) — the binding single source of truth: semantic colour
  tokens with full light/dark parity, per-theme 8-colour member-accent sets, type scale, spacing,
  radius, and motion tokens (DESIGN_SPEC §3–§7).
- **Automated design audits** (the machinery that decides design AC):
  - WCAG contrast checker → token-level contrast passes AA in both themes.
  - Colour-blind simulation (Machado severity 1.0) + CIE76 ΔE → member accents stay distinguishable
    (worst-case sim ΔE: light 7.4, dark 12.1, ≥6 floor). A real deutan/protan collapse in the warm
    accents was caught and fixed by search-optimising the palette.
  - `tooling/token-lint.mjs` → fails CI on any raw hex/value outside the token layer.
- **Interaction logic** (`packages/ui`) — framework-agnostic, tested: the hero Approve/Decision
  model (one-call accept, visible undo, explained activity-log entry; edit/decline non-destructive),
  the autonomy ladder (Notify never acts; Full-auto never interrupts), and the activity log.
- **CI** (`.github/workflows/ci.yml`): token-lint → typecheck → tests on every push.

**Verification:** `pnpm run verify` → token-lint OK · typecheck OK · **26/26 tests pass**.

**Ledger movement:** `PASS 0 → 2` (AC-D7, AC-DG3 token-fidelity, CI-enforced); 10 → IN-PROGRESS
(foundations/logic evidenced, screen/E2E half pending); 5 → BLOCKED (launch-gate studies need real
families — a §7 gate).

**Next (highest-leverage):** stand up the Expo app shell + theming from tokens; build the rendered
Approve chip, Daily Brief, and member chip (with the mandatory non-colour initial) and their
snapshot/a11y tests (advances AC-D1–D6, AC-DA2/DA4–DA6); add the Family Brain capture/extraction
service behind the provider-agnostic agent interface (AC-P1/P2). Live third-party integrations
(Google/Apple/Outlook, grocery) stay in sandbox pending credentials (§7 gate).
