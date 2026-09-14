import fs from 'fs';
import path from 'path';
import { requireGestorSession } from '../../../lib/gestor-session';

const LEADS_FILE = path.join(process.cwd(), 'data', 'landings', '_leads.json');

export async function GET() {
  const denied = await requireGestorSession();
  if (denied) return denied;

  try {
    if (!fs.existsSync(LEADS_FILE)) return Response.json([]);
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
    return Response.json(leads);
  } catch (err) {
    return Response.json([]);
  }
}

// NOTE: intentionally public/unauthenticated — this is the live public
// contact-form submission endpoint (template/landing.html). Do not add
// requireGestorSession() here or lead capture breaks.
export async function POST(req) {
  try {
    const body = await req.json();
    const lead = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    let leads = [];
    try {
      if (fs.existsSync(LEADS_FILE)) {
        leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
      }
      leads.push(lead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    } catch (e) {}

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
