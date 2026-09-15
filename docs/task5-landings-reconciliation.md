# Task 5 — `data/landings/` reconciliation (consolidate-diplomado-landings)

## Status: BLOCKED — not yet safe to delete `data/landings/`

This PR does **not** delete `data/landings/` or remove the filesystem
resolution tier from `lib/supabase-landings.js`. Two independent
prerequisites from spec Slice 2 / design ADR-2 §4 and §4b are unresolved,
and this environment cannot resolve them itself.

### 1. Slug reconciliation against Supabase — unverified

`data/landings/` currently contains:

| File | Slug | Notes |
|---|---|---|
| `fullstack.json` | `fullstack` | Also has a hardcoded `DEFAULT_FULLSTACK` fallback in `lib/supabase-landings.js` |
| `otro.json` | `agil` | ~1.7 MB — design flagged this as needing a real look |
| `test-dip.json` | `test-dip` | Minimal (`{slug, title}` only) — likely disposable |

Per the spec's reconciliation gate, each of these slugs must be confirmed
present in Supabase `landings` or `programas` before its file can be deleted.

**This sandbox has no Supabase credentials** — `.env.local` does not set
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same limitation
noted in Task 4's apply-progress: no CLI, no admin/service-role key, no env
vars available here). Querying `landings`/`programas` to check these three
slugs could not be done in this environment.

**Action required**: run `node reconcile-landings.mjs` (added in this PR)
in an environment with real Supabase credentials. It will report, per slug,
whether it's found in `landings`, found only in `programas` (needs a manual
equivalence check), or missing entirely (blocks deletion until migrated or
explicitly abandoned in writing — `otro.json`/`agil` is the one most likely
to need real migration given its size).

### 2. `_leads.json` — one real historical lead entry found

`data/landings/_leads.json` is **not empty**. It contains one real,
non-synthetic lead:

```json
{"diplomado":"Full Stack Developer","name":"[REDACTED]","email":"[REDACTED]","phone":"[REDACTED]","message":"Hola, quiero saber precios.","timestamp":"2026-07-28T15:10:44.887Z","receivedAt":"2026-07-28T15:10:44.976Z","ip":"::1"}
```

(PII redacted here — the real values are already in `data/landings/_leads.json`, which this doc should not duplicate. See that file directly if you need the actual contact info for the backfill.)

Per spec Slice 6 / design §4b, this file cannot simply be deleted — it must
be backfilled into the Supabase `leads` table introduced by Task 4
(`supabase/migrations/20260914_create_leads_table.sql`) first.

Two chained prerequisites block this, both outside this environment's
capability:

1. **Task 4's SQL migration has not been executed yet.** Per Task 4's
   apply-progress (`sdd/consolidate-diplomado-landings/apply-progress`),
   the `public.leads` table does not exist in Supabase yet — the migration
   file was written but never run (no schema-modification credentials were
   available in that sandbox either, and PR #4 documents this as a pending
   manual step for the user).
2. **No Supabase credentials in this sandbox** — even if the table existed,
   this environment could not connect to insert the backfilled row.

**Action required**: after the user runs Task 4's migration, run
`node backfill-leads.mjs` (added in this PR) with real Supabase credentials.
It inserts the one historical lead into `public.leads`, mapping the legacy
field shape (`diplomado`/`name`/`email`/`phone`/`timestamp`) to the new
table's columns. Once verified, `_leads.json` is safe to delete.

## What this PR does instead

- Adds `reconcile-landings.mjs` — read-only comparison script, no writes.
- Adds `backfill-leads.mjs` — one-time backfill script, only touches the
  Supabase `leads` table, never runs automatically.
- Adds this document.
- Makes **no changes** to `lib/supabase-landings.js` or `data/landings/`.
  The filesystem resolution tier stays in place until both gates above pass.

## Next steps for the user

1. Run Task 4's SQL migration (`supabase/migrations/20260914_create_leads_table.sql`) if not already done.
2. Run `node reconcile-landings.mjs` locally with real Supabase credentials. Resolve any `MISSING` slugs (migrate into `landings`/`programas`, or explicitly sign off on abandoning them).
3. Run `node backfill-leads.mjs` locally with real Supabase credentials. Verify the row count in `public.leads`.
4. Once both pass, a follow-up PR can safely: remove `getLocalData()`, the tier-3 call, the FS block in `getAllDiplomados()`, the now-unused `fs`/`path` imports and the FS write in `saveDiplomado`/`deleteDiplomado` from `lib/supabase-landings.js`, and delete `data/landings/` entirely (per design ADR-2 §4/§4b — FS tier removal and directory deletion must land atomically).
