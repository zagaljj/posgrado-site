import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'landings');

const defaultFullstack = {
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
};

export async function GET(req, { params }) {
  const { slug } = await params;
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return Response.json(data);
    } catch (e) {}
  }

  if (slug === 'fullstack') {
    return Response.json(defaultFullstack);
  }

  return Response.json({ error: 'Diplomado not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {}

  return Response.json({ success: true });
}
