# Task 3 — Rotate gestor-auth credentials off hardcoded defaults

## Why

`app/api/gestor-auth/route.js` falls back to hardcoded defaults
(`admin@udi.edu.bo` / `admin123` / `udi-gestor-2025`) when `GESTOR_EMAIL`,
`GESTOR_PASSWORD`, or `GESTOR_SESSION_SECRET` are not set. These are NOT
currently set as real Vercel env vars, so the authorization added in PR #2
(`fix/api-route-authorization`) protects against nothing in production today
— anyone can log in with the well-known defaults.

## What to do (manual — Vercel dashboard)

1. Pick a real admin email address you control for `GESTOR_EMAIL` — do NOT
   keep the old default `admin@udi.edu.bo`.
2. Generate a strong password and session secret locally (do not paste
   secrets into chat/tickets that get logged permanently). For example:
   ```
   # 24-char random password
   openssl rand -base64 18 | tr -d '+/=' | cut -c1-24

   # 32-byte random session secret (hex)
   openssl rand -hex 32
   ```
3. Go to the Vercel dashboard → your project → **Settings → Environment
   Variables**.
4. Add/update these three variables for **Production** (and **Preview** if
   you use preview deployments for the admin console):
   - `GESTOR_EMAIL`
   - `GESTOR_PASSWORD`
   - `GESTOR_SESSION_SECRET`
5. Redeploy (Vercel redeploys automatically on env var changes for the
   affected environments, or trigger a manual redeploy).

Note: this environment's sandbox blocks writing any `.env*` file to disk
(even gitignored ones), so no local values file was generated as part of
this change. Generate your own values with the commands above, or ask for
them directly in chat where they won't be persisted to a file.

## Code change shipped in this PR

Five files shared the same hardcoded-fallback pattern for
`GESTOR_SESSION_SECRET` (and `app/api/gestor-auth/route.js` additionally for
`GESTOR_EMAIL`/`GESTOR_PASSWORD`): `app/api/gestor-auth/route.js`,
`lib/gestor-session.js`, `middleware.js`, `app/admin/programas/page.js`,
`app/gestor-landings/page.js`. All five now fail closed in production when
the corresponding env var is unset:

- `app/api/gestor-auth/route.js`: returns a `500` on `POST` instead of
  silently accepting the old default credentials.
- The other four (which only *check* the session cookie, they don't issue
  it): the secret constant becomes `undefined` in production when unset,
  so `cookie.value === SESSION_SECRET` can never match a real cookie value
  — auth fails closed instead of accepting the well-known default
  `udi-gestor-2025` cookie value.

In development, the fallback defaults are kept so local setup still works
without a `.env.local`.

This closes a real gap that a route.js-only fix would have left open: before
this change, even if the login route were hardened alone, an attacker could
still set `gestor_session=udi-gestor-2025` directly as a cookie and pass the
middleware/session checks in the other four files without ever calling the
login endpoint.

This is safe to ship immediately: if the env vars are already missing in
production (they are, per the user's confirmation), the login endpoint was
already effectively an open door protected by "security through
obscurity" of the default credentials. Failing loudly instead of silently
accepting the defaults cannot make the current state worse — at most it
means the login endpoint 500s until the three env vars above are set in
Vercel, which was already a required follow-up.

## Rollback

If the env vars are set incorrectly and you get locked out of `/admin`,
either fix the values in Vercel and redeploy, or temporarily unset
`NODE_ENV=production` is not an option on Vercel — instead just correct the
three env var values in the dashboard and redeploy; there is no other admin
account or bypass by design.
