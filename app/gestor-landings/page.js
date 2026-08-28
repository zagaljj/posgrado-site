'use client';
import { useEffect } from 'react';

const ADMIN_HTML = `
  <link rel="stylesheet" href="/adminlanding/css/admin.css">

  <header class="header" id="header">
    <div class="header__inner">
      <div class="header__brand">
        <span class="header__logo">LG</span>
        <div>
          <h1 class="header__title">Landing Generator</h1>
          <p class="header__sub">UDI Posgrado</p>
        </div>
      </div>
      <div class="header__actions">
        <button class="btn btn--outline" id="btn-generate-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Generar todas
        </button>
        <button class="btn btn--primary" id="btn-new">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Diplomado
        </button>
      </div>
    </div>
  </header>

  <main class="main">
    <section class="view" id="view-list">
      <div class="view__header">
        <h2 class="view__title">Diplomados en Sistema</h2>
        <span class="view__badge" id="diplomado-count">0 diplomados</span>
      </div>
      <div class="diplomados-grid" id="diplomados-grid"></div>
      <div class="empty-state" id="empty-state" style="display:none">
        <div class="empty-state__icon">📚</div>
        <h3>No hay diplomados registrados</h3>
        <p>Comienza creando el primero con el botón "Nuevo Diplomado"</p>
      </div>
    </section>

    <section class="view" id="view-editor" style="display:none">
      <div class="view__header">
        <button class="btn btn--ghost" id="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
        <h2 class="view__title" id="editor-title">Nuevo Diplomado</h2>
        <div class="editor__actions">
          <button class="btn btn--outline" id="btn-preview-editor" style="display:none">Ver Landing</button>
          <button class="btn btn--primary" id="btn-save">Guardar Cambios</button>
        </div>
      </div>

      <form id="editor-form" class="editor__form" onsubmit="return false;">
        <fieldset class="editor__section">
          <legend class="editor__legend">Información Principal</legend>
          <div class="field-row">
            <div class="field">
              <label for="ed-title">Título del Diplomado *</label>
              <input type="text" id="ed-title" placeholder="Ej: Full Stack Developer" required>
            </div>
            <div class="field">
              <label for="ed-slug">Slug (URL) *</label>
              <input type="text" id="ed-slug" placeholder="Ej: fullstack" required>
              <span class="field__help">Identificador único para la carpeta de salida</span>
            </div>
          </div>
          <div class="field">
            <label for="ed-subtitle">Subtítulo / Bajada</label>
            <input type="text" id="ed-subtitle" placeholder="Ej: Conviértete en un desarrollador Full Stack con estándares de la industria">
          </div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">Imágenes Principales</legend>
          <div class="field-row">
            <div class="field">
              <label>Imagen Hero (Fondo Principal)</label>
              <div class="upload-area" id="hero-upload-area">
                <input type="file" id="ed-hero-file" accept="image/jpeg,image/png,image/webp" hidden>
                <img id="hero-preview" class="upload-area__preview" style="display:none" alt="Hero preview">
                <div class="upload-area__placeholder" id="hero-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Click o arrastrá para subir imagen</p>
                </div>
              </div>
              <input type="hidden" id="ed-hero-filename">
            </div>

            <div class="field">
              <label>Imagen Sección Objetivo</label>
              <div class="upload-area" id="objetivo-upload-area">
                <input type="file" id="ed-objetivo-file" accept="image/jpeg,image/png,image/webp" hidden>
                <img id="objetivo-preview" class="upload-area__preview" style="display:none" alt="Objetivo preview">
                <div class="upload-area__placeholder" id="objetivo-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Click o arrastrá para subir imagen</p>
                </div>
              </div>
              <input type="hidden" id="ed-objetivo-img">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Fondo Sección "Dirigido A"</label>
              <div class="upload-area upload-area--small" id="dirigido-upload-area">
                <input type="file" id="ed-dirigido-file" accept="image/jpeg,image/png,image/webp" hidden>
                <img id="dirigido-preview" class="upload-area__preview" style="display:none" alt="Dirigido A preview">
                <div class="upload-area__placeholder" id="dirigido-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Click o arrastrá para subir fondo</p>
                </div>
              </div>
              <input type="hidden" id="ed-dirigido-bg">
            </div>

            <div class="field">
              <label>Fondo Sección Plantel Docente</label>
              <div class="upload-area upload-area--small" id="docentes-upload-area">
                <input type="file" id="ed-docentes-file" accept="image/jpeg,image/png,image/webp" hidden>
                <img id="docentes-preview" class="upload-area__preview" style="display:none" alt="Docentes preview">
                <div class="upload-area__placeholder" id="docentes-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Click o arrastrá para subir fondo</p>
                </div>
              </div>
              <input type="hidden" id="ed-docentes-bg">
            </div>

            <div class="field">
              <label>Fondo Sección Contacto</label>
              <div class="upload-area upload-area--small" id="contacto-upload-area">
                <input type="file" id="ed-contacto-file" accept="image/jpeg,image/png,image/webp" hidden>
                <img id="contacto-preview" class="upload-area__preview" style="display:none" alt="Contacto preview">
                <div class="upload-area__placeholder" id="contacto-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Click o arrastrá para subir fondo</p>
                </div>
              </div>
              <input type="hidden" id="ed-contacto-bg">
            </div>
          </div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">Contenido</legend>
          <div class="field">
            <label for="ed-objetivo">Objetivo General</label>
            <textarea id="ed-objetivo" rows="4" placeholder="Formar desarrolladores Full Stack..."></textarea>
          </div>
          <div class="field">
            <label for="ed-dirigido">Dirigido A</label>
            <textarea id="ed-dirigido" rows="3" placeholder="Todos los profesionales que..."></textarea>
          </div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">Características y Horarios</legend>
          <div class="field-row field-row--3">
            <div class="field">
              <label for="ed-fecha">Fecha de Inicio</label>
              <input type="text" id="ed-fecha" placeholder="02 de Septiembre">
            </div>
            <div class="field">
              <label for="ed-modalidad">Modalidad</label>
              <input type="text" id="ed-modalidad" placeholder="Virtual">
            </div>
            <div class="field">
              <label for="ed-horarios">Horarios Resumen</label>
              <input type="text" id="ed-horarios" placeholder="Martes y Jueves 19:00 - 21:00">
            </div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
            <label style="font-weight: 600; color: #e4e4e7;">Bloques de Horarios</label>
            <button type="button" class="btn btn--secondary btn--sm" id="btn-add-schedule" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">+ Agregar Bloque de Horario</button>
          </div>
          <div id="schedules-list" class="dynamic-list" style="margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.75rem;"></div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">
            Plan de Estudio
            <button type="button" class="btn btn--small btn--outline" id="btn-add-module">+ Módulo</button>
          </legend>
          <div class="dynamic-list" id="modules-list"></div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">
            Plantel Docente
            <button type="button" class="btn btn--small btn--outline" id="btn-add-teacher">+ Docente</button>
          </legend>
          <div class="dynamic-list" id="teachers-list"></div>
        </fieldset>

        <fieldset class="editor__section">
          <legend class="editor__legend">Contacto y Redes</legend>
          <div class="field-row field-row--3">
            <div class="field">
              <label for="ed-whatsapp">WhatsApp</label>
              <input type="text" id="ed-whatsapp" placeholder="+591 70445618">
            </div>
            <div class="field">
              <label for="ed-email">Email</label>
              <input type="email" id="ed-email" placeholder="posgrado@udi.edu.bo">
            </div>
            <div class="field">
              <label for="ed-web">Sitio Web</label>
              <input type="text" id="ed-web" placeholder="www.udi.edu.bo">
            </div>
          </div>
          <div class="field-row field-row--3">
            <div class="field">
              <label for="ed-facebook">Facebook URL</label>
              <input type="url" id="ed-facebook" placeholder="https://facebook.com/...">
            </div>
            <div class="field">
              <label for="ed-instagram">Instagram URL</label>
              <input type="url" id="ed-instagram" placeholder="https://instagram.com/...">
            </div>
            <div class="field">
              <label for="ed-linkedin">LinkedIn URL</label>
              <input type="url" id="ed-linkedin" placeholder="https://linkedin.com/...">
            </div>
          </div>
        </fieldset>
      </form>
    </section>

    <section class="view" id="view-leads" style="display:none">
      <div class="view__header">
        <button class="btn btn--ghost" id="btn-back-leads">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
        <h2 class="view__title">Leads / Consultas</h2>
      </div>
      <div id="leads-table-container"></div>
    </section>
  </main>

  <div class="toast" id="toast" role="alert" aria-live="polite"></div>
`;

export default function GestorLandingsPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/adminlanding/js/admin.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: '#09090b',
        color: '#f4f4f5',
        overflowY: 'auto',
      }}
      dangerouslySetInnerHTML={{ __html: ADMIN_HTML }}
    />
  );
}
