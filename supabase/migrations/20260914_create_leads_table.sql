-- Task 4: leads table for /api/leads (contact-form submissions)
-- Replaces the filesystem-backed data/landings/_leads.json store, which is
-- silently lossy on Vercel's read-only filesystem.
--
-- MANUAL STEP: run this file against the project's Supabase database
-- (SQL editor, or `supabase db push` if the CLI + project link are set up
-- locally). This environment does not have Supabase schema-modification
-- credentials, so it was not executed automatically.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  diplomado_slug text,
  diplomado_title text,
  received_at timestamptz not null default now()
);

create index if not exists leads_received_at_idx on public.leads (received_at desc);
create index if not exists leads_diplomado_slug_idx on public.leads (diplomado_slug);

alter table public.leads enable row level security;

-- The app writes/reads via the anon key from server-side Route Handlers only
-- (never exposed to the browser directly), matching the existing pattern for
-- the `landings` table in lib/supabase-landings.js. Allow anon insert/select
-- since Supabase RLS has no concept of "server-only" — access control is
-- enforced by requireGestorSession() in app/api/leads/route.js for GET.
create policy "leads_insert_anon" on public.leads
  for insert to anon
  with check (true);

create policy "leads_select_anon" on public.leads
  for select to anon
  using (true);
