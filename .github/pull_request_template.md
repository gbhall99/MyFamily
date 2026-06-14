<!-- MyFamily PR template. See docs/DESIGN_SPEC.md §13.3 and docs/SPEC.md §16. -->

## What & why


## Acceptance ledger
- [ ] `delivery/acceptance-ledger.md` updated for every AC this PR touches (status + evidence link)
- [ ] `pnpm run verify` green (token-lint + typecheck + tests)

## Design review gate (DESIGN_SPEC §13.3)
- [ ] Screens audited against §13.1 + relevant §13.2 (contrast, targets, states, color-independence)
- [ ] Accessibility audit passes (blocking — an AA failure blocks release)
- [ ] Tokens are the single source of truth (no raw hex/spacing/type/radius/duration)

## Design deviations (AC-DG4 — required if any)
> Any deviation from SPEC.md / DESIGN_SPEC.md must be recorded here with an explicit, named
> design-lead exception. If there are none, state "None".

- Deviation: …
- Rationale: …
- Design-lead sign-off (AC-DG1): …
