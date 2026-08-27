/**
 * Admin Panel — Client Logic
 * CRUD for diplomados, image uploads, generation
 */

(function () {
  'use strict';

  // ---------- State ----------
  let currentSlug = null; // null = new, string = editing
  let moduleCount = 0;
  let teacherCount = 0;

  // ---------- DOM refs ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const viewList = $('#view-list');
  const viewEditor = $('#view-editor');
  const viewLeads = $('#view-leads');
  const diplomadosGrid = $('#diplomados-grid');
  const emptyState = $('#empty-state');
  const diplomadoCount = $('#diplomado-count');
  const modulesList = $('#modules-list');
  const teachersList = $('#teachers-list');
  const schedulesList = $('#schedules-list');
  const toast = $('#toast');

  // ---------- Navigation ----------
  function showView(view) {
    [viewList, viewEditor, viewLeads].forEach((v) => (v.style.display = 'none'));
    view.style.display = '';
  }

  // ---------- Toast ----------
  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast toast--${type} is-visible`;
    setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

  // ---------- API helpers ----------
  async function api(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    return res.json();
  }

  // ---------- Load diplomados list ----------
  async function loadDiplomados() {
    const data = await api('/api/diplomados');

    diplomadoCount.textContent = `${data.length} diplomado${data.length !== 1 ? 's' : ''}`;

    if (data.length === 0) {
      diplomadosGrid.style.display = 'none';
      emptyState.style.display = '';
      return;
    }

    diplomadosGrid.style.display = '';
    emptyState.style.display = 'none';

    diplomadosGrid.innerHTML = data
      .map(
        (d) => `
        <div class="dip-card" data-slug="${d.slug}">
          <div class="dip-card__status ${d.hasOutput ? 'dip-card__status--generated' : ''}" title="${d.hasOutput ? 'Generada' : 'Sin generar'}"></div>
          <h3 class="dip-card__title">${escapeHtml(d.title)}</h3>
          <p class="dip-card__subtitle">${escapeHtml(d.subtitle || '')}</p>
          <div class="dip-card__meta">
            <span>📅 ${escapeHtml(d.fechaInicio || 'Sin fecha')}</span>
            <span>📚 ${d.modulesCount} módulos</span>
            <span>👩‍🏫 ${d.docentesCount} docentes</span>
          </div>
          <div class="dip-card__actions">
            <button class="btn btn--small btn--outline btn-edit" data-slug="${d.slug}">Editar</button>
            <button class="btn btn--small btn--success btn-generate" data-slug="${d.slug}">Generar</button>
            ${d.hasOutput ? `<a class="btn btn--small btn--ghost" href="/preview/${d.slug}/index.html" target="_blank">Ver</a>` : ''}
            <button class="btn btn--small btn--danger btn-delete" data-slug="${d.slug}">Eliminar</button>
          </div>
        </div>
      `
      )
      .join('');

    // Bind card events
    diplomadosGrid.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditor(btn.dataset.slug);
      });
    });

    diplomadosGrid.querySelectorAll('.btn-generate').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(`/preview/${btn.dataset.slug}/index.html`, '_blank');
      });
    });

    diplomadosGrid.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`¿Eliminar el diplomado "${btn.dataset.slug}"?`)) return;
        await api(`/api/diplomados/${btn.dataset.slug}`, { method: 'DELETE' });
        showToast('Diplomado eliminado');
        loadDiplomados();
      });
    });

    // Click on card opens editor
    diplomadosGrid.querySelectorAll('.dip-card').forEach((card) => {
      card.addEventListener('click', () => openEditor(card.dataset.slug));
    });
  }

  // ---------- Editor ----------
  async function openEditor(slug = null) {
    currentSlug = slug;
    moduleCount = 0;
    teacherCount = 0;
    modulesList.innerHTML = '';
    teachersList.innerHTML = '';
    showView(viewEditor);

    // Reset form
    const form = $('#editor-form');
    form.reset();
    $('#hero-preview').style.display = 'none';
    $('#hero-placeholder').style.display = '';
    $('#ed-hero-filename').value = '';

    if (slug) {
      // Load existing data
      const data = await api(`/api/diplomados/${slug}`);
      populateEditor(data);
    } else {
      // New: add one empty module and teacher
      addModule();
      addTeacher();
    }
  }

  function populateEditor(data) {
    $('#ed-slug').value = data.slug || '';
    $('#ed-slug').disabled = true; // Can't change slug of existing
    $('#ed-title').value = data.title || '';
    if ($('#ed-title-main')) $('#ed-title-main').value = data.heroTitleMain || '';
    if ($('#ed-title-sub')) $('#ed-title-sub').value = data.heroTitleSub || '';
    $('#ed-subtitle').value = data.subtitle || '';
    $('#ed-objetivo').value = data.objetivoGeneral || '';
    $('#ed-dirigido').value = data.dirigidoA || '';
    $('#ed-fecha').value = data.caracteristicas?.fechaInicio || data.fechaInicio || '';
    $('#ed-modalidad').value = data.caracteristicas?.modalidad || data.modalidad || '';
    $('#ed-horarios').value = data.caracteristicas?.horarios || data.horarios || '';

    if ($('#ed-sched1-title')) $('#ed-sched1-title').value = data.schedule1Title || '';
    if ($('#ed-sched1-time')) $('#ed-sched1-time').value = data.schedule1Time || '';
    if ($('#ed-sched2-title')) $('#ed-sched2-title').value = data.schedule2Title || '';
    if ($('#ed-sched2-time')) $('#ed-sched2-time').value = data.schedule2Time || '';

    function setFieldPreview(hiddenId, previewId, placeholderId, value, defaultFilename) {
      const hidden = $('#' + hiddenId);
      const preview = $('#' + previewId);
      const placeholder = $('#' + placeholderId);
      const val = value || defaultFilename;

      if (hidden) hidden.value = val || '';
      if (preview && val) {
        if (val.startsWith('data:') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')) {
          preview.src = val;
        } else {
          preview.src = `/uploads/heroes/${val}`;
        }
        preview.style.display = '';
        if (placeholder) placeholder.style.display = 'none';
      } else if (preview && placeholder) {
        preview.style.display = 'none';
        placeholder.style.display = '';
      }
    }

    setFieldPreview('ed-hero-filename', 'hero-preview', 'hero-placeholder', data.heroImage, 'hero-fullstack.jpg');
    setFieldPreview('ed-objetivo-img', 'objetivo-preview', 'objetivo-placeholder', data.objetivoImage, 'objetivo-fullstack.jpg');
    setFieldPreview('ed-dirigido-bg', 'dirigido-preview', 'dirigido-placeholder', data.dirigidoBgImage, 'dirigido-bg.png');
    setFieldPreview('ed-docentes-bg', 'docentes-preview', 'docentes-placeholder', data.docentesBgImage, 'docentes-bg.png');
    setFieldPreview('ed-contacto-bg', 'contacto-preview', 'contacto-placeholder', data.contactoBgImage, 'contacto-bg.png');

    $('#ed-whatsapp').value = data.contacto?.whatsapp || data.whatsappNumber || '';
    $('#ed-email').value = data.contacto?.email || data.email || '';
    $('#ed-web').value = data.contacto?.web || data.web || '';
    $('#ed-facebook').value = data.social?.facebook || '';
    $('#ed-instagram').value = data.social?.instagram || '';
    $('#ed-linkedin').value = data.social?.linkedin || '';

    // Schedules
    scheduleCount = 0;
    if (schedulesList) schedulesList.innerHTML = '';
    const rawScheds = data.schedules || [];
    if (Array.isArray(rawScheds) && rawScheds.length > 0) {
      rawScheds.forEach((s) => addScheduleBlock(s));
    } else {
      if (data.schedule1Title || data.schedule1Time) {
        addScheduleBlock({ scheduleTitle: data.schedule1Title, scheduleTime: data.schedule1Time });
      }
      if (data.schedule2Title || data.schedule2Time) {
        addScheduleBlock({ scheduleTitle: data.schedule2Title, scheduleTime: data.schedule2Time });
      }
      if (!data.schedule1Title && !data.schedule2Title) addScheduleBlock();
    }

    // Modules
    (data.modules || data.modulos || []).forEach((m) => addModule(m));
    if (!(data.modules || data.modulos)?.length) addModule();

    // Teachers
    (data.teachers || data.docentes || []).forEach((t) => addTeacher(t));
    if (!(data.teachers || data.docentes)?.length) addTeacher();
  }

  function collectEditorData() {
    const data = {
      slug: $('#ed-slug').value.trim(),
      title: $('#ed-title').value.trim(),
      heroTitleMain: $('#ed-title-main')?.value?.trim() || '',
      heroTitleSub: $('#ed-title-sub')?.value?.trim() || '',
      subtitle: $('#ed-subtitle').value.trim(),
      heroImage: $('#ed-hero-filename').value || '',
      objetivoImage: $('#ed-objetivo-img')?.value?.trim() || 'objetivo-fullstack.jpg',
      dirigidoBgImage: $('#ed-dirigido-bg')?.value?.trim() || 'dirigido-bg.png',
      docentesBgImage: $('#ed-docentes-bg')?.value?.trim() || 'docentes-bg.png',
      contactoBgImage: $('#ed-contacto-bg')?.value?.trim() || 'contacto-bg.png',
      objetivoGeneral: $('#ed-objetivo').value.trim(),
      dirigidoA: $('#ed-dirigido').value.trim(),
      fechaInicio: $('#ed-fecha').value.trim(),
      modalidad: $('#ed-modalidad').value.trim(),
      horarios: $('#ed-horarios').value.trim(),
      schedule1Title: $('#ed-sched1-title')?.value?.trim() || '',
      schedule1Time: $('#ed-sched1-time')?.value?.trim() || '',
      schedule2Title: $('#ed-sched2-title')?.value?.trim() || '',
      schedule2Time: $('#ed-sched2-time')?.value?.trim() || '',
      schedules: [],
      caracteristicas: {
        fechaInicio: $('#ed-fecha').value.trim(),
        modalidad: $('#ed-modalidad').value.trim(),
        horarios: $('#ed-horarios').value.trim(),
      },
      modules: [],
      modulos: [],
      teachers: [],
      docentes: [],
      whatsappNumber: $('#ed-whatsapp').value.trim(),
      email: $('#ed-email').value.trim(),
      web: $('#ed-web').value.trim(),
      phone: $('#ed-whatsapp').value.trim(),
      contacto: {
        whatsapp: $('#ed-whatsapp').value.trim(),
        email: $('#ed-email').value.trim(),
        web: $('#ed-web').value.trim(),
      },
      social: {
        facebook: $('#ed-facebook').value.trim(),
        instagram: $('#ed-instagram').value.trim(),
        linkedin: $('#ed-linkedin').value.trim(),
      },
    };

    // Collect schedule blocks
    if (schedulesList) {
      schedulesList.querySelectorAll('.dynamic-item').forEach((item) => {
        const title = item.querySelector('.schedule-title')?.value?.trim() || '';
        const time = item.querySelector('.schedule-time')?.value?.trim() || '';
        if (title || time) {
          data.schedules.push({ scheduleTitle: title, scheduleTime: time });
        }
      });
    }

    // Collect modules
    modulesList.querySelectorAll('.dynamic-item').forEach((item, i) => {
      const name = item.querySelector('.module-name')?.value?.trim();
      const dates = item.querySelector('.module-dates')?.value?.trim() || '';
      const sched = item.querySelector('.module-schedule')?.value?.trim() || '';
      if (name) {
        data.modules.push({ moduleNumber: String(i + 1), moduleName: name, moduleDates: dates, moduleSchedule: sched });
        data.modulos.push({ numero: i + 1, nombre: name, fechas: dates, horario: sched });
      }
    });

    // Collect teachers
    teachersList.querySelectorAll('.dynamic-item').forEach((item) => {
      const name = item.querySelector('.teacher-name')?.value?.trim();
      const photo = item.querySelector('.teacher-foto-value')?.value || '';
      const bio = item.querySelector('.teacher-bio')?.value?.trim() || '';
      const modulosText = item.querySelector('.teacher-modulos')?.value?.trim() || '';
      if (name) {
        data.teachers.push({
          teacherName: name,
          teacherPhoto: photo,
          teacherBio: bio,
          teacherModule: modulosText,
          teacherModulesText: modulosText,
        });
        data.docentes.push({
          nombre: name,
          foto: photo,
          bio: bio,
          modulo: modulosText,
        });
      }
    });

    return data;
  }

  // ---------- Dynamic schedule blocks ----------
  let scheduleCount = 0;
  function addScheduleBlock(data = null) {
    scheduleCount++;
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <span class="dynamic-item__number">${scheduleCount}</span>
      <div class="dynamic-item__fields">
        <input type="text" class="schedule-title" placeholder="Título del bloque (ej: Módulos 1 al 4 o Módulo I)" value="${escapeAttr(data?.scheduleTitle || data?.titulo || data?.title || '')}">
        <input type="text" class="schedule-time" placeholder="Días y horarios (ej: Lunes, Miércoles y Viernes de 19:30 a 22:00 hrs.)" value="${escapeAttr(data?.scheduleTime || data?.detalle || data?.time || '')}">
      </div>
      <button type="button" class="dynamic-item__remove" title="Eliminar bloque de horario">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;
    div.querySelector('.dynamic-item__remove').addEventListener('click', () => {
      div.remove();
      renumberSchedules();
    });
    if (schedulesList) schedulesList.appendChild(div);
  }

  function renumberSchedules() {
    if (!schedulesList) return;
    schedulesList.querySelectorAll('.dynamic-item__number').forEach((el, i) => {
      el.textContent = i + 1;
    });
    scheduleCount = schedulesList.querySelectorAll('.dynamic-item').length;
  }

  // ---------- Dynamic modules ----------
  function addModule(data = null) {
    moduleCount++;
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <span class="dynamic-item__number">${moduleCount}</span>
      <div class="dynamic-item__fields">
        <input type="text" class="module-name" placeholder="Nombre del módulo" value="${escapeAttr(data?.nombre || data?.moduleName || '')}">
        <input type="text" class="module-dates" placeholder="Fechas (ej: Del 07 de Septiembre al 30 de Septiembre)" value="${escapeAttr(data?.fechas || data?.moduleDates || '')}">
        <input type="text" class="module-schedule" placeholder="Horarios de este módulo (ej: Lunes, Miércoles y Viernes de 19:30 a 22:00)" value="${escapeAttr(data?.horario || data?.moduleSchedule || '')}">
      </div>
      <button type="button" class="dynamic-item__remove" title="Eliminar módulo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;
    div.querySelector('.dynamic-item__remove').addEventListener('click', () => {
      div.remove();
      renumberModules();
    });
    modulesList.appendChild(div);
  }

  function renumberModules() {
    modulesList.querySelectorAll('.dynamic-item__number').forEach((el, i) => {
      el.textContent = i + 1;
    });
    moduleCount = modulesList.querySelectorAll('.dynamic-item').length;
  }

  // ---------- Dynamic teachers ----------
  function addTeacher(data = null) {
    teacherCount++;
    const div = document.createElement('div');
    div.className = 'dynamic-item';

    const photoSrc = data?.foto || data?.teacherPhoto ? (
      (data?.foto || data?.teacherPhoto).startsWith('data:') || (data?.foto || data?.teacherPhoto).startsWith('http') || (data?.foto || data?.teacherPhoto).startsWith('/')
        ? (data?.foto || data?.teacherPhoto)
        : `/uploads/teachers/${data?.foto || data?.teacherPhoto}`
    ) : '';

    const defaultModText = data?.teacherModulesText || (data?.teacherModule2 ? (data.teacherModule + '\n' + data.teacherModule2) : (data?.teacherModule || data?.modulo || ''));

    div.innerHTML = `
      <span class="dynamic-item__number">${teacherCount}</span>
      <div class="dynamic-item__fields">
        <input type="text" class="teacher-name" placeholder="Nombre del docente" value="${escapeAttr(data?.nombre || data?.teacherName || '')}">
        <div class="teacher-photo-area">
          <img class="teacher-photo-thumb" src="${photoSrc || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 48%22%3E%3Crect fill=%22%231a1d27%22 width=%2248%22 height=%2248%22/%3E%3Ctext x=%2224%22 y=%2228%22 fill=%22%2371717a%22 font-size=%2218%22 text-anchor=%22middle%22%3E📷%3C/text%3E%3C/svg%3E'}" alt="">
          <input type="file" class="teacher-file-input" accept="image/jpeg,image/png,image/webp" hidden>
          <button type="button" class="teacher-photo-btn">Subir foto</button>
          <input type="hidden" class="teacher-foto-value" value="${escapeAttr(data?.foto || data?.teacherPhoto || '')}">
        </div>
        <textarea class="teacher-bio" placeholder="Biografía breve del docente" rows="2">${escapeHtml(data?.bio || data?.teacherBio || '')}</textarea>
        <textarea class="teacher-modulos" placeholder="Módulos que dicta (escribí 1 o más módulos, un módulo por línea)" rows="2">${escapeHtml(defaultModText)}</textarea>
      </div>
      <button type="button" class="dynamic-item__remove" title="Eliminar docente">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;

    // Photo upload
    const fileInput = div.querySelector('.teacher-file-input');
    const photoBtn = div.querySelector('.teacher-photo-btn');
    const photoThumb = div.querySelector('.teacher-photo-thumb');
    const fotoValue = div.querySelector('.teacher-foto-value');

    photoBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/upload/teacher', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        photoThumb.src = result.path;
        fotoValue.value = result.filename;
        showToast('Foto subida');
      } else {
        showToast('Error al subir foto', 'error');
      }
    });

    // Remove
    div.querySelector('.dynamic-item__remove').addEventListener('click', () => {
      div.remove();
      renumberTeachers();
    });

    teachersList.appendChild(div);
  }

  function renumberTeachers() {
    teachersList.querySelectorAll('.dynamic-item__number').forEach((el, i) => {
      el.textContent = i + 1;
    });
    teacherCount = teachersList.querySelectorAll('.dynamic-item').length;
  }

  // ---------- Image Upload Dropzones ----------
  function setupUploadDropzone({ areaId, inputId, previewId, placeholderId, hiddenId, apiEndpoint }) {
    const area = $('#' + areaId);
    const input = $('#' + inputId);
    const preview = $('#' + previewId);
    const placeholder = $('#' + placeholderId);
    const hidden = $('#' + hiddenId);

    if (!area || !input) return;

    area.addEventListener('click', (e) => {
      e.stopPropagation();
      input.click();
    });

    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.style.borderColor = 'var(--primary)';
    });
    area.addEventListener('dragleave', () => {
      area.style.borderColor = '';
    });
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.style.borderColor = '';
      if (e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    input.addEventListener('change', () => {
      if (input.files[0]) handleFile(input.files[0]);
    });

    async function handleFile(file) {
      // 1. Immediate client preview (base64 fallback)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        preview.src = dataUrl;
        preview.style.display = '';
        if (placeholder) placeholder.style.display = 'none';
        hidden.value = dataUrl;
      };
      reader.readAsDataURL(file);

      // 2. Upload to API
      try {
        const slug = $('#ed-slug').value.trim() || 'temp';
        const formData = new FormData();
        formData.append('hero', file);
        formData.append('image', file);
        formData.append('slug', slug);

        const res = await fetch(apiEndpoint, { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success && result.filename) {
          hidden.value = result.filename;
          showToast('Imagen subida correctamente');
        }
      } catch (err) {
        showToast('Imagen cargada en previsualización');
      }
    }
  }

  function initUploadDropzones() {
    setupUploadDropzone({
      areaId: 'hero-upload-area',
      inputId: 'ed-hero-file',
      previewId: 'hero-preview',
      placeholderId: 'hero-placeholder',
      hiddenId: 'ed-hero-filename',
      apiEndpoint: '/api/upload/hero',
    });

    setupUploadDropzone({
      areaId: 'objetivo-upload-area',
      inputId: 'ed-objetivo-file',
      previewId: 'objetivo-preview',
      placeholderId: 'objetivo-placeholder',
      hiddenId: 'ed-objetivo-img',
      apiEndpoint: '/api/upload/section',
    });

    setupUploadDropzone({
      areaId: 'dirigido-upload-area',
      inputId: 'ed-dirigido-file',
      previewId: 'dirigido-preview',
      placeholderId: 'dirigido-placeholder',
      hiddenId: 'ed-dirigido-bg',
      apiEndpoint: '/api/upload/section',
    });

    setupUploadDropzone({
      areaId: 'docentes-upload-area',
      inputId: 'ed-docentes-file',
      previewId: 'docentes-preview',
      placeholderId: 'docentes-placeholder',
      hiddenId: 'ed-docentes-bg',
      apiEndpoint: '/api/upload/section',
    });

    setupUploadDropzone({
      areaId: 'contacto-upload-area',
      inputId: 'ed-contacto-file',
      previewId: 'contacto-preview',
      placeholderId: 'contacto-placeholder',
      hiddenId: 'ed-contacto-bg',
      apiEndpoint: '/api/upload/section',
    });
  }

  // ---------- Save ----------
  async function saveDiplomado() {
    const data = collectEditorData();

    if (!data.slug || !data.title) {
      showToast('Slug y título son obligatorios', 'error');
      return false;
    }

    try {
      const result = await api('/api/diplomados', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (result.success) {
        showToast('Diplomado guardado correctamente');
        currentSlug = result.slug;
        $('#ed-slug').disabled = true;
        return true;
      } else {
        showToast('Error al guardar: ' + (result.error || ''), 'error');
        return false;
      }
    } catch (err) {
      showToast('Error al guardar diplomado', 'error');
      return false;
    }
  }

  // ---------- Generate & Preview ----------
  async function generateCurrent() {
    const slugInput = $('#ed-slug');
    const slugVal = slugInput?.value?.trim();

    if (!slugVal) {
      showToast('Ingresá el slug y título del diplomado', 'error');
      return;
    }

    const btn = $('#btn-preview');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    // Auto-save form first
    const saved = await saveDiplomado();
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      Preview
    `;

    if (!saved) return;

    const targetSlug = currentSlug || slugVal;
    const previewUrl = `/preview/${targetSlug}/index.html`;
    window.open(previewUrl, '_blank');
  }

  // ---------- Leads ----------
  async function loadLeads() {
    showView(viewLeads);
    const leads = await api('/api/leads');
    const container = $('#leads-table-container');

    if (!leads.length) {
      container.innerHTML = '<div class="empty-state"><p>No hay consultas aún.</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="leads-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Diplomado</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          ${leads
            .reverse()
            .map(
              (l) => `
              <tr>
                <td>${new Date(l.receivedAt || l.timestamp).toLocaleString('es')}</td>
                <td>${escapeHtml(l.diplomado || '')}</td>
                <td>${escapeHtml(l.name || '')}</td>
                <td>${escapeHtml(l.email || '')}</td>
                <td>${escapeHtml(l.phone || '')}</td>
                <td>${escapeHtml(l.message || '')}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  // ---------- Helpers ----------
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeAttr(text) {
    return (text || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---------- Event bindings ----------
  function init() {
    // Navigation
    $('#btn-new').addEventListener('click', () => openEditor(null));
    $('#btn-empty-new')?.addEventListener('click', () => openEditor(null));
    $('#btn-back').addEventListener('click', () => {
      showView(viewList);
      $('#ed-slug').disabled = false;
      loadDiplomados();
    });
    $('#btn-back-leads').addEventListener('click', () => {
      showView(viewList);
      loadDiplomados();
    });

    // Editor actions
    $('#btn-save').addEventListener('click', saveDiplomado);
    $('#btn-preview').addEventListener('click', generateCurrent);
    $('#btn-add-module').addEventListener('click', () => addModule());
    $('#btn-add-teacher').addEventListener('click', () => addTeacher());
    $('#btn-add-schedule')?.addEventListener('click', () => addScheduleBlock());

    // Generate all
    $('#btn-generate-all').addEventListener('click', async () => {
      const btn = $('#btn-generate-all');
      btn.disabled = true;
      btn.textContent = 'Generando...';
      const result = await api('/api/generate', { method: 'POST' });
      if (result.success) {
        showToast('Todas las landings generadas');
        loadDiplomados();
      } else {
        showToast('Error: ' + (result.error || ''), 'error');
      }
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Generar todas
      `;
    });

    // Upload dropzones
    initUploadDropzones();

    // Initial load
    loadDiplomados();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
