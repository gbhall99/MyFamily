# Delivery progress log

Running record of the autonomous delivery loop (see `../docs/DELIVERY_PROMPT.md`). Newest first.

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
