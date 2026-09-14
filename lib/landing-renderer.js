import fs from 'fs';
import path from 'path';
import { getDiplomadoBySlug } from './supabase-landings';

const ROOT = process.cwd();
const TEMPLATE_DIR = path.join(ROOT, 'template');

// Slot-contract rule: every {{slot}} in template/landing.html is plain text
// by default. Adding a slot that renders caller-supplied markup requires
// (a) an explicit RAW_SLOTS entry and (b) a sanitizer at the write path,
// not the read path. No slot may become rich by default.
const URL_SLOTS = new Set([
  'heroImageSrc',
  'objetivoImageSrc',
  'dirigidoBgSrc',
  'docentesBgSrc',
  'contactoBgSrc',
  'teacherPhotoSrc',
  'facebookUrl',
  'instagramUrl',
  'linkedinUrl',
]);
// whatsappMessage is already percent-encoded (encodeURIComponent) at the
// point it's built into `flat` below — this is cosmetic, not a security
// exemption. It still passes through escapeHtml() by default since it's
// not in URL_SLOTS and doesn't need scheme validation (used as a query
// param value, not an href itself).
const RAW_SLOTS = new Set([]);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    // Also escape braces: processBlocks + the final flat sweep are two
    // sequential passes over the same string. A value like "{{title}}"
    // inserted by the inner (block-scoped) pass would otherwise be
    // re-matched and re-expanded by the outer flat sweep (§3.6 recursion
    // risk). Encoding braces as entities is visually identical in a
    // browser and makes injected values immune to re-parsing.
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function safeUrl(value) {
  const raw = String(value ?? '');
  // Strip control chars (e.g. tabs/newlines used to obscure a scheme like
  // "java\tscript:") before scheme sniffing.
  const stripped = raw.replace(/[\x00-\x20]+/g, '');
  const isAllowedScheme =
    /^https?:/i.test(stripped) ||
    /^mailto:/i.test(stripped) ||
    /^tel:/i.test(stripped) ||
    /^data:image\//i.test(stripped) ||
    stripped.startsWith('/') ||
    stripped.startsWith('#');
  if (!isAllowedScheme) return '';
  return escapeHtml(raw);
}

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

export async function renderLandingPage(slug) {
  const data = await getDiplomadoBySlug(slug);
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

  // Escape a value according to its slot context (§3 of the design).
  // Unknown/unlisted slots default to escapeHtml (default-deny).
  function renderSlotValue(key, value) {
    if (URL_SLOTS.has(key)) return safeUrl(value);
    if (RAW_SLOTS.has(key)) return String(value ?? '');
    return escapeHtml(value);
  }

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
                if (!/^\w+$/.test(key)) continue;
                const escaped = renderSlotValue(key, value);
                rendered = rendered.replace(
                  new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
                  () => escaped
                );
              }
            } else {
              const escaped = renderSlotValue(arrayKey, item);
              rendered = rendered.replace(
                new RegExp(`\\{\\{${arrayKey}\\}\\}`, 'g'),
                () => escaped
              );
            }
            return rendered;
          })
          .join('\n');
      }

      let rendered = processBlocks(blockContent, scope);
      const escaped = renderSlotValue(arrayKey, items);
      return rendered.replace(
        new RegExp(`\\{\\{${arrayKey}\\}\\}`, 'g'),
        () => escaped
      );
    });
  }

  let result = processBlocks(template, flat);
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in flat)) return match;
    return renderSlotValue(key, flat[key]);
  });
  return result;
}
