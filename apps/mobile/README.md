# MyFamily — Expo app (`@myfamily/mobile`)

The runnable mobile/web shell. It is a **thin composition layer**: it wires
[`@myfamily/core`](../../packages/core) (domain logic + view-models) into
[`@myfamily/ui`](../../packages/ui) (the tokens-only, accessibility-tested rendered screens). All
real logic and UI — and all the tests — live in those packages.

## Why it's outside the root workspace
This app pulls the full **react-native / expo** toolchain. To keep the library CI lean and fast, the
root `pnpm-workspace.yaml` intentionally excludes `apps/*`, and this app installs on its own.

## Run it
```bash
cd apps/mobile
npm install          # resolves expo, react-native, and the local @myfamily/* packages (file: deps)
npm run ios          # or: npm run android / npm run web
```

## What you'll see
The **Today / Daily-Brief** home: a greeting, the family member row (each chip carries the member's
initial as a non-colour cue), and the Brief — today's logistics, caught conflicts (computed by the
core conflict radar), up to three one-tap decisions, and "already handled" — all themed from the
design tokens and honouring the OS light/dark setting.
