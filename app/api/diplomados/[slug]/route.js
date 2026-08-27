import { getDiplomadoBySlug, deleteDiplomado } from '../../../../lib/supabase-landings';

export async function GET(req, { params }) {
  const { slug } = await params;
  const data = await getDiplomadoBySlug(slug);
  if (data) {
    return Response.json(data);
  }
  return Response.json({ error: 'Diplomado not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  await deleteDiplomado(slug);
  return Response.json({ success: true });
}
