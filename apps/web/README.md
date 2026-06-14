# MyFamily — Web companion (`@myfamily/web`)

The responsive **web companion** (DESIGN_SPEC §11). It renders the same tokens-only
`@myfamily/ui` screens as the native app via **react-native-web**, wiring `@myfamily/core`
view-models in. Builds to a static site with Vite — ready for Vercel.

## Local
```bash
pnpm --filter @myfamily/web dev      # http://localhost:5173
pnpm --filter @myfamily/web build    # -> apps/web/dist
```

## Deploy to Vercel (one-time connect, then auto-deploys on push)
1. **vercel.com → Add New → Project →** import the `gbhall99/MyFamily` repo.
2. **Root Directory:** set to **`apps/web`**.
3. Framework preset auto-detects **Vite**; Build = `pnpm build`, Output = `dist`
   (already pinned in [`vercel.json`](./vercel.json)). Install runs at the repo root so the
   `@myfamily/*` workspace packages resolve.
4. **Deploy.** Every push to the branch then redeploys automatically (preview deploys per PR,
   production on the default branch).

No deploy token needs to be shared — Vercel's GitHub app handles it.
