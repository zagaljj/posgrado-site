/**
 * One-off backfill script for Task 5 (consolidate-diplomado-landings).
 *
 * Migrates historical leads captured in data/landings/_leads.json (written by
 * the pre-Task-4 filesystem-based /api/leads implementation) into the
 * Supabase `leads` table introduced by Task 4
 * (supabase/migrations/20260914_create_leads_table.sql).
 *
 * PREREQUISITES (both required before running this script):
 *   1. Task 4's SQL migration must already be applied to the Supabase
 *      project (creates public.leads). Not yet done as of this writing.
 *   2. .env.local must contain real NEXT_PUBLIC_SUPABASE_URL /
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY credentials with insert access to
 *      public.leads (see supabase/migrations/20260914_create_leads_table.sql
 *      RLS policies).
 *
 * This environment (the sandbox used to author this change) has neither of
 * the above, so this script could not be executed here.
 *
 * Usage:
 *   node backfill-leads.mjs
 *
 * The script maps the OLD field shape (_leads.json) to the NEW Supabase
 * `leads` table column shape used by app/api/leads/route.js:
 *   diplomado  -> diplomado_title (no slug was recorded historically; left null)
 *   name       -> name
 *   email      -> email
 *   phone      -> phone
 *   timestamp / receivedAt -> received_at
 *
 * After a successful run, verify row counts match, then it is safe to delete
 * data/landings/_leads.json as part of the FS tier removal.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. ' +
      'Cannot backfill without real Supabase credentials.'
  );
  process.exit(2);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const LEADS_FILE = path.join(process.cwd(), 'data', 'landings', '_leads.json');

async function main() {
  if (!fs.existsSync(LEADS_FILE)) {
    console.log('No _leads.json file found — nothing to backfill.');
    process.exit(0);
  }

  const raw = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  if (!Array.isArray(raw) || raw.length === 0) {
    console.log('_leads.json is empty — nothing to backfill. Safe to delete.');
    process.exit(0);
  }

  console.log(`Found ${raw.length} historical lead(s) to backfill.`);

  const rows = raw.map((lead) => ({
    name: lead.name || null,
    email: lead.email || null,
    phone: lead.phone || null,
    diplomado_slug: null, // not recorded in the legacy format
    diplomado_title: lead.diplomado || null,
    received_at: lead.receivedAt || lead.timestamp || new Date().toISOString(),
  }));

  const { data, error } = await supabase.from('leads').insert(rows).select();

  if (error) {
    console.error('Backfill failed:', error.message);
    console.error(
      'If this says the table does not exist, run supabase/migrations/20260914_create_leads_table.sql first.'
    );
    process.exit(2);
  }

  console.log(`Backfilled ${data.length} lead(s) into Supabase 'leads' table.`);
  console.log('Verify the row count, then it is safe to delete data/landings/_leads.json.');
}

main();
