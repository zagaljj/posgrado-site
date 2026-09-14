/**
 * One-off reconciliation script for Task 5 (consolidate-diplomado-landings).
 *
 * Compares every slug present in data/landings/*.json against Supabase
 * `landings` and `programas` tables, per spec Slice 2 / design ADR-2 §4.
 *
 * This environment (the sandbox used to author this change) has NO Supabase
 * credentials (.env.local has no NEXT_PUBLIC_SUPABASE_URL / ANON_KEY set),
 * so this script could not be executed here. Run it locally or in CI with
 * real credentials before deleting data/landings/.
 *
 * Usage:
 *   node reconcile-landings.mjs
 *
 * Exit code 0 = every local slug is present in Supabase (safe to delete).
 * Exit code 1 = at least one slug is missing from Supabase (NOT safe to delete
 *               until that slug is migrated or explicitly abandoned in writing).
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
      'Cannot reconcile without real Supabase credentials.'
  );
  process.exit(2);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const DATA_DIR = path.join(process.cwd(), 'data', 'landings');

async function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

  const localSlugs = [];
  for (const file of files) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
      if (parsed.slug) localSlugs.push({ slug: parsed.slug, file });
    } catch (e) {
      console.error(`Could not parse ${file}:`, e.message);
    }
  }

  console.log(`Found ${localSlugs.length} local slug(s):`, localSlugs.map((s) => s.slug).join(', '));

  const { data: landings, error: landingsErr } = await supabase.from('landings').select('slug');
  if (landingsErr) {
    console.error('Error querying landings table:', landingsErr.message);
    process.exit(2);
  }
  const landingSlugs = new Set((landings || []).map((r) => r.slug));

  const { data: programas, error: programasErr } = await supabase.from('programas').select('slug');
  if (programasErr) {
    console.error('Error querying programas table:', programasErr.message);
    process.exit(2);
  }
  const programaSlugs = new Set((programas || []).map((r) => r.slug));

  let missing = [];
  for (const { slug, file } of localSlugs) {
    if (landingSlugs.has(slug)) {
      console.log(`OK   ${slug} (${file}) -> found in Supabase 'landings'`);
    } else if (programaSlugs.has(slug)) {
      console.log(
        `WARN ${slug} (${file}) -> found in Supabase 'programas' only (generated-default tier; verify content equivalence manually)`
      );
    } else {
      console.log(`MISSING ${slug} (${file}) -> NOT found in 'landings' or 'programas'`);
      missing.push({ slug, file });
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n${missing.length} slug(s) missing from Supabase. Do NOT delete data/landings/ until these are migrated ` +
        'into the landings/programas tables or explicitly abandoned in writing:'
    );
    missing.forEach(({ slug, file }) => console.error(`  - ${slug} (${file})`));
    process.exit(1);
  }

  console.log('\nAll local slugs are represented in Supabase. Safe to proceed with FS tier removal.');
  process.exit(0);
}

main();
