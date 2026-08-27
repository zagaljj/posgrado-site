import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TEMPLATE_DIR = path.join(ROOT, 'template');
const DATA_DIR = path.join(ROOT, 'data', 'landings');

// Helper to resolve image URL
function resolveImgUrl(file, defaultFilename, subfolder = '') {
  const name = file || defaultFilename;
  if (!name) return '';
  if (name.startsWith('data:') || name.startsWith('http://') || name.startsWith('https://')) {
    return name;
  }
  if (name.startsWith('/uploads/') || name.startsWith('uploads/')) {
    return name.startsWith('/') ? name : `/${name}`;
  }
  return subfolder ? `/assets/img/${subfolder}/${name}` : `/assets/img/${name}`;
}

export function renderLandingPage(slug) {
  let data = null;
  const dataPath = path.join(DATA_DIR, `${slug}.json`);
  
  if (fs.existsSync(dataPath)) {
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (e) {}
  }

  // Fallback default fullstack if slug is 'fullstack' and file not found
  if (!data && slug === 'fullstack') {
    data = {
      slug: 'fullstack',
      title: 'Full Stack Developer',
      subtitle: 'Conviértete en un desarrollador Full Stack',
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
  }

  if (!data) return null;

  let template = null;
  const templatePath = path.join(TEMPLATE_DIR, 'landing.html');
  if (fs.existsSync(templatePath)) {
    try {
      template = fs.readFileSync(templatePath, 'utf-8');
    } catch (e) {}
  }

  if (!template) return null;

  let heroTitleMain = data.heroTitleMain || '';
  let heroTitleSub = data.heroTitleSub || '';
  if (!heroTitleMain && data.title) {
    const parts = data.title.trim().toUpperCase().split(/\s+/);
    if (parts.length >= 3) {
      const mid = Math.ceil(parts.length / 2);
      heroTitleMain = parts.slice(0, mid).join(' ');
      heroTitleSub = parts.slice(mid).join(' ');
    } else if (parts.length === 2) {
      heroTitleMain = parts[0];
      heroTitleSub = parts[1];
    } else {
      heroTitleMain = parts[0] || '';
      heroTitleSub = '';
    }
  }

  const rawTeachers = data.teachers || data.docentes || [];
  const teacherList = rawTeachers.map((d) => {
    const modulesList = [];
    const modStr = d.teacherModulesText || d.teacherModule || d.modulo || '';
    if (typeof modStr === 'string' && modStr.trim()) {
      const lines = modStr.split(/[\n;]+/).map((s) => s.trim()).filter(Boolean);
      lines.forEach((line) => modulesList.push({ moduleTitle: line }));
    } else if (Array.isArray(modStr)) {
      modStr.forEach((m) => modulesList.push({ moduleTitle: typeof m === 'object' ? m.moduleTitle || m.title : String(m) }));
    }

    if (d.teacherModule2 && !modulesList.some((m) => m.moduleTitle === d.teacherModule2)) {
      modulesList.push({ moduleTitle: d.teacherModule2 });
    }

    const photoName = d.teacherPhoto || d.foto || 'teacher-default.jpg';
    return {
      teacherName: d.teacherName || d.nombre || '',
      teacherPhotoSrc: resolveImgUrl(photoName, 'teacher-default.jpg', 'teachers'),
      teacherBio: d.teacherBio || d.bio || '',
      teacherModules: modulesList,
    };
  });

  const flat = {
    title: data.title || '',
    subtitle: data.subtitle || '',
    heroTitleMain,
    heroTitleSub,
    slug: data.slug || slug,
    objetivoGeneral: data.objetivoGeneral || '',
    dirigidoA: data.dirigidoA || '',
    heroImageSrc: resolveImgUrl(data.heroImage, 'hero-fullstack.jpg'),
    objetivoImageSrc: resolveImgUrl(data.objetivoImage, 'objetivo-fullstack.jpg'),
    dirigidoBgSrc: resolveImgUrl(data.dirigidoBgImage, 'dirigido-bg.png'),
    docentesBgSrc: resolveImgUrl(data.docentesBgImage, 'docentes-bg.png'),
    contactoBgSrc: resolveImgUrl(data.contactoBgImage, 'contacto-bg.png'),
    fechaInicio: data.fechaInicio || data.caracteristicas?.fechaInicio || '',
    modalidad: data.modalidad || data.caracteristicas?.modalidad || '',
    horarios: data.horarios || data.caracteristicas?.horarios || '',
    schedule1Title: data.schedule1Title || '',
    schedule1Time: data.schedule1Time || '',
    schedule2Title: data.schedule2Title || '',
    schedule2Time: data.schedule2Time || '',
    schedules: (() => {
      const raw = data.schedules || [];
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((s) => ({
          scheduleTitle: s.scheduleTitle || s.titulo || '',
          scheduleTime: s.scheduleTime || s.detalle || s.time || '',
        }));
      }
      const list = [];
      if (data.schedule1Title || data.schedule1Time) {
        list.push({ scheduleTitle: data.schedule1Title || 'Horario', scheduleTime: data.schedule1Time || '' });
      }
      if (data.schedule2Title || data.schedule2Time) {
        list.push({ scheduleTitle: data.schedule2Title || 'Horario', scheduleTime: data.schedule2Time || '' });
      }
      return list;
    })(),
    whatsappNumber: (data.whatsappNumber || data.contacto?.whatsapp || '').replace(/[^0-9]/g, ''),
    whatsappMessage: encodeURIComponent(data.whatsappMessage || `Hola, me interesa el Diplomado en ${data.title}.`),
    email: data.email || data.contacto?.email || '',
    phone: data.phone || data.contacto?.whatsapp || '',
    web: data.web || data.contacto?.web || '',
    facebookUrl: data.social?.facebook || '#',
    instagramUrl: data.social?.instagram || '#',
    linkedinUrl: data.social?.linkedin || '#',
    modules: (data.modules || data.modulos || []).map((m, i) => ({
      moduleNumber: m.moduleNumber || m.numero || i + 1,
      moduleName: m.moduleName || m.nombre || '',
      moduleDates: m.moduleDates || m.fechas || '',
      moduleSchedule: m.moduleSchedule || m.horario || '',
    })),
    teachers: teacherList,
  };

  function processBlocks(str, scope) {
    const blockRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    return str.replace(blockRegex, (_, arrayKey, blockContent) => {
      const items = scope[arrayKey];
      if (!items) return '';

      if (Array.isArray(items)) {
        if (items.length === 0) return '';
        return items
          .map((item) => {
            let rendered = processBlocks(blockContent, item);
            if (typeof item === 'object' && item !== null) {
              for (const [key, value] of Object.entries(item)) {
                if (Array.isArray(value)) continue;
                rendered = rendered.replace(
                  new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
                  String(value ?? '')
                );
              }
            } else {
              rendered = rendered.replace(
                new RegExp(`\\{\\{${arrayKey}\\}\\}`, 'g'),
                String(item ?? '')
              );
            }
            return rendered;
          })
          .join('\n');
      }

      let rendered = processBlocks(blockContent, scope);
      return rendered.replace(
        new RegExp(`\\{\\{${arrayKey}\\}\\}`, 'g'),
        String(items ?? '')
      );
    });
  }

  let result = processBlocks(template, flat);
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in flat ? String(flat[key] ?? '') : match));
  return result;
}
