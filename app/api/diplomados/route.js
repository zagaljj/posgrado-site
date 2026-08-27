import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'landings');

const defaultDiplomadosMap = new Map([
  [
    'fullstack',
    {
      slug: 'fullstack',
      title: 'Full Stack Developer',
      subtitle: 'Conviértete en un desarrollador Full Stack con estándares de la industria',
      heroImage: 'hero-fullstack.jpg',
      objetivoImage: 'objetivo-fullstack.jpg',
      dirigidoBgImage: 'dirigido-bg.png',
      docentesBgImage: 'docentes-bg.png',
      contactoBgImage: 'contacto-bg.png',
      objetivoGeneral: 'Formar desarrolladores Full Stack capaces de integrarse a equipos profesionales, desarrollando, desplegando y manteniendo aplicaciones completas en entornos productivos.',
      dirigidoA: 'Profesionales en TI, desarrolladores junior o semi-senior, egresados de carreras de ingeniería de sistemas.',
      fechaInicio: 'Del 07 de Septiembre al 21 de Enero',
      modalidad: 'Virtual — Clases en vivo',
      horarios: 'Lunes, Miércoles y Viernes de 19:30 a 22:00',
      modules: [
        { moduleNumber: '1', moduleName: 'Fundamentos de Ingeniería de Software', moduleDates: 'Del 07 al 28 de Septiembre' },
        { moduleNumber: '2', moduleName: 'Desarrollo Frontend Profesional', moduleDates: 'Del 05 al 26 de Octubre' },
        { moduleNumber: '3', moduleName: 'Backend Development', moduleDates: 'Del 04 al 25 de Noviembre' }
      ],
      teachers: [
        {
          teacherName: 'Marcelo Casanovas',
          teacherBio: 'Líder Técnico especializado en .NET Core y Ciberseguridad.',
          teacherPhoto: 'marcelo-casanovas.jpg',
          teacherModule: 'Módulo I: Fundamentos de Ingeniería de Software'
        }
      ]
    }
  ]
]);

export async function GET() {
  const diplomadosMap = new Map(defaultDiplomadosMap);

  try {
    if (fs.existsSync(DATA_DIR)) {
      const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
          const data = JSON.parse(content);
          if (data.slug) {
            diplomadosMap.set(data.slug, data);
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  const result = Array.from(diplomadosMap.values()).map((data) => ({
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

    defaultDiplomadosMap.set(data.slug, data);

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
