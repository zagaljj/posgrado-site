import { supabase } from '../../../lib/supabase';
import { requireGestorSession } from '../../../lib/gestor-session';

export async function GET() {
  const denied = await requireGestorSession();
  if (denied) return denied;

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('received_at', { ascending: false });

    if (error) return Response.json([]);
    return Response.json(data || []);
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

    const { error } = await supabase.from('leads').insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      diplomado_slug: body.diplomadoSlug,
      diplomado_title: body.diplomadoTitle,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
