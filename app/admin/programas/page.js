"use client";

import { useState, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";

export default function AdminProgramas() {
  const [diplomados, setDiplomados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newModalidad, setNewModalidad] = useState("Virtual — Clases en vivo");
  const [newInicio, setNewInicio] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDiplomados = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/diplomados');
      const data = await res.json();
      setDiplomados(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setDiplomados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomados();
  }, []);

  const handleTitleChange = (val) => {
    setNewTitle(val);
    if (!newSlug || newSlug === autoSlug(newTitle)) {
      setNewSlug(autoSlug(val));
    }
  };

  const autoSlug = (text) => {
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;
    setSaving(true);
    try {
      const payload = {
        slug: newSlug.trim(),
        title: newTitle.trim(),
        heroTitleMain: newTitle.trim(),
        heroTitleSub: "",
        subtitle: newSubtitle.trim() || `Diplomado en ${newTitle.trim()}`,
        fechaInicio: newInicio.trim() || "Próximo inicio",
        modalidad: newModalidad,
        objetivoGeneral: "Formar profesionales altamente capacitados en las últimas tecnologías y metodologías de la industria.",
        dirigidoA: "Profesionales, graduados y estudiantes avanzados interesados en especializarse en esta área.",
        horarios: "A coordinar",
        modules: [],
        teachers: []
      };

      const res = await fetch('/api/diplomados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        setShowModal(false);
        setNewTitle("");
        setNewSlug("");
        setNewSubtitle("");
        setNewInicio("");
        await fetchDiplomados();
        // Redirect to editor to customize landing
        window.location.href = `/gestor-landings?slug=${payload.slug}`;
      } else {
        alert("Error al crear diplomado: " + (result.error || ""));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`¿Estás seguro de eliminar el diplomado "${title || slug}"?`)) return;
    try {
      await fetch(`/api/diplomados/${slug}`, { method: 'DELETE' });
      await fetchDiplomados();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <SectionLabel n={2} label="Oferta académica" />
          <h1 className="font-montserrat font-black text-3xl md:text-4xl text-udi-navy tracking-[-1px] uppercase m-0">
            Catálogo de<br />
            <span className="text-udi-gray font-light italic">Programas & Landings</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/gestor-landings"
            className="border border-udi-navy text-udi-navy px-5 py-3.5 font-montserrat font-bold text-[10px] tracking-[2px] uppercase hover:bg-udi-navy hover:text-white transition-all flex items-center gap-2 rounded-sm"
          >
            🚀 Gestor de Landings
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="bg-udi-navy text-white px-6 py-3.5 font-montserrat font-black text-[10px] tracking-[2px] uppercase hover:shadow-xl transition-all rounded-sm flex items-center gap-2"
          >
            + Nuevo Diplomado
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-udi-border rounded-sm overflow-x-auto shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-udi-gray font-poppins text-sm flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-udi-navy border-t-transparent"></div>
            Cargando diplomados desde la base de datos...
          </div>
        ) : diplomados.length === 0 ? (
          <div className="p-16 text-center text-udi-gray font-poppins text-sm">
            <p className="text-2xl mb-2">📚</p>
            <p className="font-semibold text-udi-navy">No hay diplomados registrados aún.</p>
            <p className="text-xs text-udi-gray mt-1">Creá el primero con el botón "+ Nuevo Diplomado".</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-udi-light/80 border-b border-udi-border">
                <th className="p-4 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Diplomado</th>
                <th className="p-4 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Inicio</th>
                <th className="p-4 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Estructura</th>
                <th className="p-4 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Landing Page</th>
                <th className="p-4 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-udi-light">
              {diplomados.map((d) => (
                <tr key={d.slug} className="hover:bg-udi-light/30 transition-colors">
                  <td className="p-4">
                    <div className="font-poppins text-sm font-bold text-udi-navy">{d.title || d.slug}</div>
                    <div className="font-poppins text-xs text-udi-gray truncate max-w-[320px]">{d.subtitle || `/${d.slug}`}</div>
                  </td>
                  <td className="p-4 font-poppins text-xs text-udi-text font-medium">
                    {d.fechaInicio || "A coordinar"}
                  </td>
                  <td className="p-4 font-poppins text-xs text-udi-gray">
                    <div className="flex items-center gap-3">
                      <span>📚 {d.modulesCount || 0} módulos</span>
                      <span>👨‍🏫 {d.docentesCount || 0} docentes</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/${d.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[2px] font-poppins text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                        title="Ver Landing Pública"
                      >
                        🟢 Ver Landing
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/gestor-landings?slug=${d.slug}`}
                        className="px-3 py-1 bg-udi-navy text-white rounded-[2px] font-poppins text-[11px] font-semibold hover:bg-udi-navy/80 transition-colors inline-flex items-center gap-1"
                        title="Editar Contenidos de la Landing"
                      >
                        🎨 Editar
                      </a>
                      <button
                        onClick={() => handleDelete(d.slug, d.title)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-[2px] font-poppins text-xs transition-colors"
                        title="Eliminar Diplomado"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-udi-navy/85 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[540px] rounded-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-udi-border">
              <h2 className="font-montserrat font-black text-lg text-udi-navy uppercase tracking-[1px]">
                Nuevo Diplomado & Landing
              </h2>
              <button onClick={() => setShowModal(false)} className="text-udi-gray hover:text-udi-navy text-xl" disabled={saving}>✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Título del Diplomado *</label>
                <input
                  type="text" required value={newTitle}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy font-bold text-udi-navy"
                  placeholder="Ej: Ciberseguridad y Ethical Hacking"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Slug URL * (identificador único)</label>
                <div className="flex items-center border border-udi-border px-3 py-2.5 bg-udi-light/40">
                  <span className="font-poppins text-xs text-udi-gray select-none">/</span>
                  <input
                    type="text" required value={newSlug}
                    onChange={e => setNewSlug(autoSlug(e.target.value))}
                    className="bg-transparent font-poppins text-sm outline-none font-semibold text-udi-navy w-full ml-1"
                    placeholder="ciberseguridad-ethical-hacking"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Subtítulo / Breve descripción</label>
                <input
                  type="text" value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy"
                  placeholder="Especialízate en protección de infraestructura y pentesting"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Fecha de Inicio</label>
                  <input
                    type="text" value={newInicio}
                    onChange={e => setNewInicio(e.target.value)}
                    className="border border-udi-border px-3 py-2.5 font-poppins text-sm outline-none focus:border-udi-navy"
                    placeholder="Ej: 15 de Octubre"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Modalidad</label>
                  <select
                    value={newModalidad}
                    onChange={e => setNewModalidad(e.target.value)}
                    className="border border-udi-border px-3 py-2.5 font-poppins text-sm outline-none bg-white focus:border-udi-navy"
                  >
                    <option>Virtual — Clases en vivo</option>
                    <option>Presencial — Santa Cruz</option>
                    <option>Semipresencial (Híbrido)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-[2px] text-[11px] text-indigo-900 font-poppins">
                💡 Al crearlo, se guardará en la base de datos y se abrirá automáticamente el editor visual para cargar fotos, módulos y docentes.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowModal(false)} disabled={saving}
                  className="flex-1 border border-udi-border py-3 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-gray hover:bg-udi-light transition-all rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-udi-navy text-white py-3 font-montserrat font-black text-[10px] tracking-[2px] uppercase hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
                >
                  {saving && <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>}
                  Crear y Diseñar Landing →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
