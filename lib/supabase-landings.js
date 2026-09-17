import { supabase } from './supabase';

const memoryStore = new Map();

const DEFAULT_FULLSTACK = {
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

memoryStore.set('fullstack', DEFAULT_FULLSTACK);

export async function getDiplomadoBySlug(slug) {
  // 1. Try Supabase landings table
  try {
    const { data, error } = await supabase
      .from('landings')
      .select('data')
      .eq('slug', slug)
      .single();

    if (!error && data && data.data) {
      return data.data;
    }
  } catch (e) {}

  // 2. Try in-memory store
  if (memoryStore.has(slug)) {
    return memoryStore.get(slug);
  }

  // 3. Try loading canonical data from 'programas' table to auto-generate default landing structure
  try {
    const { data: prog, error: progErr } = await supabase
      .from('programas')
      .select('*, areas(nombre)')
      .eq('slug', slug)
      .single();

    if (!progErr && prog) {
      const generated = {
        slug: prog.slug,
        title: prog.titulo,
        heroTitleMain: prog.titulo,
        heroTitleSub: '',
        subtitle: prog.descripcion || `Diplomado en ${prog.titulo}`,
        heroImage: prog.arte_url || 'hero-fullstack.jpg',
        objetivoImage: 'objetivo-fullstack.jpg',
        dirigidoBgImage: 'dirigido-bg.png',
        docentesBgImage: 'docentes-bg.png',
        contactoBgImage: 'contacto-bg.png',
        objetivoGeneral: Array.isArray(prog.objetivos) && prog.objetivos.length > 0 
          ? prog.objetivos.filter(Boolean).join('. ') 
          : (prog.descripcion || ''),
        dirigidoA: 'Profesionales y graduados interesados en especializarse y actualizarse en esta disciplina.',
        fechaInicio: prog.inicio || 'Próximo inicio',
        modalidad: prog.modalidad || 'Virtual — Clases en vivo',
        horarios: 'Lunes, Miércoles y Viernes de 19:30 a 22:00',
        modules: [],
        teachers: (prog.docentes || []).filter(Boolean).map((dName, idx) => ({
          teacherName: dName,
          teacherBio: 'Docente especialista del programa.',
          teacherPhoto: '',
          teacherModule: `Módulo ${idx + 1}`
        }))
      };
      return generated;
    }
  } catch (e) {}

  if (slug === 'fullstack') {
    return DEFAULT_FULLSTACK;
  }

  return null;
}

export async function getAllDiplomados() {
  const diplomadosMap = new Map();
  diplomadosMap.set('fullstack', DEFAULT_FULLSTACK);

  for (const [key, val] of memoryStore.entries()) {
    diplomadosMap.set(key, { ...val, hasOutput: true });
  }

  // Load landings from Supabase
  try {
    const { data: landingsData, error: landingsErr } = await supabase.from('landings').select('slug, data');
    if (!landingsErr && Array.isArray(landingsData)) {
      for (const row of landingsData) {
        if (row.slug && row.data) {
          diplomadosMap.set(row.slug, { ...row.data, hasOutput: true });
        }
      }
    }
  } catch (e) {}

  // Load catalog programas from Supabase to include those that don't have custom landing yet
  try {
    const { data: programasData, error: progErr } = await supabase.from('programas').select('*');
    if (!progErr && Array.isArray(programasData)) {
      for (const p of programasData) {
        if (p.slug && !diplomadosMap.has(p.slug)) {
          diplomadosMap.set(p.slug, {
            slug: p.slug,
            title: p.titulo,
            subtitle: p.descripcion || '',
            fechaInicio: p.inicio || '',
            modalidad: p.modalidad || '',
            modules: [],
            teachers: (p.docentes || []).filter(Boolean).map((dName, idx) => ({
              teacherName: dName,
              teacherBio: '',
              teacherPhoto: '',
              teacherModule: `Módulo ${idx + 1}`
            })),
            hasOutput: false
          });
        }
      }
    }
  } catch (e) {}

  return Array.from(diplomadosMap.values());
}

export async function saveDiplomado(data) {
  if (!data.slug || !data.title) return false;

  memoryStore.set(data.slug, data);

  try {
    const { error } = await supabase.from('landings').upsert(
      {
        slug: data.slug,
        title: data.title,
        data: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    );

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (e) {
    return { success: false, error: e.message || 'Error al guardar el diplomado.' };
  }

  return { success: true };
}

export async function deleteDiplomado(slug) {
  memoryStore.delete(slug);

  try {
    await supabase.from('landings').delete().eq('slug', slug);
  } catch (e) {}

  return true;
}
