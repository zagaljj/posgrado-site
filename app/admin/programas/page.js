"use client";

import { useState, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";
import { supabase } from "@/lib/supabase";

const EMPTY_FORM = {
  titulo: "", tipo: "Diplomado", area_id: "", modalidad: "Presencial", precio: 1500,
  estado_academico: "Disponible", duracion: "5 meses", horas: 200, inicio: "",
  descripcion: "", objetivos: ["", "", ""], docentes: ["", "", "", ""],
  destacado: false, activo: true, arte_url: "", brochure_url: "",
};

export default function AdminProgramas() {
  const [programas, setProgramas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [artePreview, setArtePreview] = useState("");
  const [arteFile, setArteFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgramas();
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const { data } = await supabase.from('areas').select('*').order('nombre');
    if (data) setAreas(data);
  };

  const fetchProgramas = async () => {
    const { data, error } = await supabase
      .from('programas')
      .select('*, areas(nombre, color)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching programas:", error);
    } else {
      setProgramas(data);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArteFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setArtePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBrochureFile(file);
  };

  const uploadFile = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('posgrado-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('posgrado-assets')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clean = {
        ...form,
        objetivos: form.objetivos.filter(o => o.trim()),
        docentes: form.docentes.filter(d => d.trim()),
      };
      delete clean.areas;

      if (arteFile) {
        clean.arte_url = await uploadFile(arteFile, 'artes');
      }
      if (brochureFile) {
        clean.brochure_url = await uploadFile(brochureFile, 'brochures');
      }

      if (editId) {
        const { error } = await supabase.from('programas').update(clean).eq('id', editId);
        if (error) throw error;
      } else {
        const slug = clean.titulo.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const { error } = await supabase.from('programas').insert({ ...clean, slug });
        if (error) throw error;
      }

      await fetchProgramas();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving programa:", error);
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { 
    setForm(EMPTY_FORM); 
    setEditId(null); 
    setArtePreview(""); 
    setArteFile(null);
    setBrochureFile(null);
  };

  const handleEdit = (p) => {
    setForm({ 
      ...EMPTY_FORM, 
      ...p, 
      objetivos: p.objetivos?.length ? p.objetivos : ["", "", ""], 
      docentes: p.docentes?.length ? p.docentes : ["", "", "", ""] 
    });
    setArtePreview(p.arte_url || "");
    setEditId(p.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este diplomado?")) return;
    try {
      const { error } = await supabase.from('programas').delete().eq('id', id);
      if (error) throw error;
      setProgramas(programas.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <SectionLabel n={2} label="Oferta académica" />
          <h1 className="font-montserrat font-black text-4xl text-udi-navy tracking-[-1px] uppercase m-0">
            Gestión de<br />
            <span className="text-udi-gray font-light italic">Programas</span>
          </h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-udi-navy text-white px-8 py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase hover:shadow-xl transition-all"
        >
          + Nuevo Programa
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-udi-border rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-udi-light border-b border-udi-border">
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy w-20">Arte</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Título</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Tipo</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Área</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Modalidad</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Precio</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Estado Acad.</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Publicación</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy">Brochure</th>
              <th className="p-5 font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-navy text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-udi-light">
            {programas.map((p) => (
              <tr key={p.id} className="hover:bg-udi-light/40 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-14 rounded-sm overflow-hidden bg-udi-light border border-udi-border flex-shrink-0">
                    {p.arte_url ? (
                      <img src={p.arte_url} alt={p.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base opacity-20">📷</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-poppins text-sm font-bold text-udi-text max-w-[260px]">{p.titulo}</div>
                  {p.destacado && <span className="text-[9px] font-poppins text-amber-600 font-bold uppercase tracking-[1px]">⭐ Destacado</span>}
                </td>
                <td className="p-4 font-poppins text-xs text-udi-gray font-medium">{p.tipo || "Diplomado"}</td>
                <td className="p-4 font-poppins text-xs text-udi-navy font-semibold">{p.areas?.nombre}</td>
                <td className="p-4 font-poppins text-xs text-udi-gray">{p.modalidad}</td>
                <td className="p-4 font-poppins text-sm font-bold text-udi-navy">Bs. {p.precio.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-[2px] font-poppins text-[9px] font-bold uppercase tracking-[1px] ${p.estado_academico === 'Disponible' ? 'bg-green-100 text-green-700' : p.estado_academico === 'Completo' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {p.estado_academico}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-[2px] font-poppins text-[9px] font-bold uppercase tracking-[1px] ${p.activo ? "bg-udi-navy/10 text-udi-navy" : "bg-udi-gray/10 text-udi-gray"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  {p.brochure_url ? (
                    <span className="text-xl" title="PDF Disponible">📄</span>
                  ) : (
                    <span className="opacity-20 text-xl">🚫</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(p)} className="p-2 opacity-40 hover:opacity-100 transition-opacity" title="Editar">✏️</button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 opacity-30 hover:opacity-100 transition-opacity text-red-600" title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-udi-navy/90 backdrop-blur-sm z-[2000] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-[760px] my-auto rounded-sm shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-udi-border">
              <h2 className="font-montserrat font-black text-xl text-udi-navy uppercase tracking-[1px]">
                {editId ? "Editar Programa" : "Nuevo Programa"}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-udi-gray hover:text-udi-navy text-xl" disabled={loading}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Arte Upload */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-start">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">
                    Título del Programa *
                  </label>
                  <input
                    required type="text" value={form.titulo}
                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy w-full"
                    placeholder="Ej: Diplomado en Derecho Empresarial"
                  />
                  <div className="mt-4">
                    <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray block mb-2">
                      Arte / Flyer del Programa
                    </label>
                    <label className="cursor-pointer border-2 border-dashed border-udi-border hover:border-udi-navy transition-colors p-4 flex flex-col items-center gap-2 rounded-sm">
                      <span className="text-2xl">🖼️</span>
                      <span className="font-poppins text-xs text-udi-gray">Clic para subir imagen (JPG, PNG)</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
                {/* Arte Preview */}
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Vista Previa</label>
                  <div className="w-[200px] aspect-[4/5] bg-udi-light border border-udi-border rounded-sm overflow-hidden flex items-center justify-center relative">
                    {artePreview ? (
                      <img src={artePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center opacity-20">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="font-poppins text-[9px] uppercase tracking-[1px]">Sin arte</div>
                      </div>
                    )}
                  </div>
                  {artePreview && (
                    <button type="button" onClick={() => { setForm(f => ({...f, arte_url: ""})); setArtePreview(""); setArteFile(null); }}
                      className="text-[10px] font-poppins text-red-500 hover:text-red-700 text-center mt-1">
                      × Quitar imagen
                    </button>
                  )}
                </div>
              </div>

              {/* Brochure Upload */}
              <div className="bg-udi-light/30 p-6 rounded-sm border border-udi-border">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray block mb-3">
                  Documento Brochure (PDF)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer bg-white border border-udi-border hover:border-udi-navy transition-colors p-4 flex items-center justify-center gap-3 rounded-sm">
                    <span className="text-xl">📄</span>
                    <span className="font-poppins text-xs text-udi-gray">
                      {brochureFile ? `Archivo listo para subir: ${brochureFile.name}` : (form.brochure_url ? "Archivo PDF actual cargado" : "Clic para subir Brochure PDF")}
                    </span>
                    <input type="file" accept="application/pdf" onChange={handleBrochureChange} className="hidden" />
                  </label>
                  {(brochureFile || form.brochure_url) && (
                    <button type="button" onClick={() => { setForm(f => ({...f, brochure_url: ""})); setBrochureFile(null); }}
                      className="bg-red-50 text-red-500 p-4 rounded-sm border border-red-100 hover:bg-red-100 transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Tipo, Area, Modalidad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Tipo *</label>
                  <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none bg-white focus:border-udi-navy">
                    <option>Diplomado</option><option>Postítulo</option><option>Curso</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Área *</label>
                  <select required value={form.area_id} onChange={e => setForm({ ...form, area_id: e.target.value ? parseInt(e.target.value) : "" })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none bg-white focus:border-udi-navy">
                    <option value="">Seleccionar área...</option>
                    {areas.map(a => <option key={a.id} value={a.id}>{a.icono} {a.nombre}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Modalidad *</label>
                  <select value={form.modalidad} onChange={e => setForm({ ...form, modalidad: e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none bg-white focus:border-udi-navy">
                    <option>Presencial</option><option>Virtual</option><option>Semipresencial</option>
                  </select>
                </div>
              </div>

              {/* Precio, Estado Academico, Duración, Horas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Inversión (Bs.)</label>
                  <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: +e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Estado Académico</label>
                  <select value={form.estado_academico} onChange={e => setForm({ ...form, estado_academico: e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none bg-white focus:border-udi-navy">
                    <option>Disponible</option><option>Completo</option><option>Próximamente</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Duración</label>
                  <input type="text" value={form.duracion} placeholder="Ej: 5 meses" onChange={e => setForm({ ...form, duracion: e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Horas Acad.</label>
                  <input type="number" value={form.horas} onChange={e => setForm({ ...form, horas: +e.target.value })}
                    className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy" />
                </div>
              </div>

              {/* Inicio */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Fecha de Inicio</label>
                <input type="text" value={form.inicio} placeholder="Ej: Mayo 2025"
                  onChange={e => setForm({ ...form, inicio: e.target.value })}
                  className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy" />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Descripción</label>
                <textarea value={form.descripcion} rows={3}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy resize-none"
                  placeholder="Describí brevemente el programa..." />
              </div>

              {/* Objetivos */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Objetivos (hasta 3)</label>
                {form.objetivos.map((obj, i) => (
                  <input key={i} type="text" value={obj} placeholder={`Objetivo ${i + 1}`}
                    onChange={e => { const arr = [...form.objetivos]; arr[i] = e.target.value; setForm({ ...form, objetivos: arr }); }}
                    className="border border-udi-border px-4 py-2.5 font-poppins text-sm outline-none focus:border-udi-navy" />
                ))}
              </div>

              {/* Docentes */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Docentes del Programa</label>
                {form.docentes.map((doc, i) => (
                  <input key={i} type="text" value={doc} placeholder={`Docente ${i + 1}`}
                    onChange={e => { const arr = [...form.docentes]; arr[i] = e.target.value; setForm({ ...form, docentes: arr }); }}
                    className="border border-udi-border px-4 py-2.5 font-poppins text-sm outline-none focus:border-udi-navy" />
                ))}
              </div>

              {/* Flags */}
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.destacado} onChange={e => setForm({ ...form, destacado: e.target.checked })} className="w-4 h-4" />
                  <span className="font-poppins text-xs text-udi-text uppercase tracking-[1px]">⭐ Destacar en inicio</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} className="w-4 h-4" />
                  <span className="font-poppins text-xs text-udi-text uppercase tracking-[1px]">✅ Publicar activo</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-udi-border">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} disabled={loading}
                  className="flex-1 border border-udi-border py-4 font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-udi-gray hover:bg-udi-light transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-udi-navy text-white py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>}
                  {editId ? "Guardar Cambios" : "Crear Programa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
