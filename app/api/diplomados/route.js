import { getAllDiplomados, saveDiplomado } from '../../../lib/supabase-landings';

export async function GET() {
  const all = await getAllDiplomados();
  const result = all.map((data) => ({
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    fechaInicio: data.caracteristicas?.fechaInicio || data.fechaInicio || '',
    modulesCount: (data.modules || data.modulos || []).length,
    docentesCount: (data.teachers || data.docentes || []).length,
    hasOutput: true,
  }));

  return Response.json(result);
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.slug || !data.title) {
      return Response.json({ error: 'Missing slug or title' }, { status: 400 });
    }

    await saveDiplomado(data);
    return Response.json({ success: true, slug: data.slug });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
