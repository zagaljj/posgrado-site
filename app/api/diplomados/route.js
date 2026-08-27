import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'landings');

export async function GET() {
  const diplomados = [];
  try {
    if (fs.existsSync(DATA_DIR)) {
      const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
          const data = JSON.parse(content);
          if (data.slug) {
            diplomados.push({
              slug: data.slug,
              title: data.title,
              subtitle: data.subtitle,
              fechaInicio: data.caracteristicas?.fechaInicio || data.fechaInicio || '',
              modulesCount: (data.modules || data.modulos || []).length,
              docentesCount: (data.teachers || data.docentes || []).length,
              hasOutput: true,
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  return Response.json(diplomados);
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.slug || !data.title) {
      return Response.json({ error: 'Missing slug or title' }, { status: 400 });
    }

    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      const filePath = path.join(DATA_DIR, `${data.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {}

    return Response.json({ success: true, slug: data.slug });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
