"use client";

import { useState, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";
import { supabase } from "@/lib/supabase";

const COLORS = [
  "#002744","#1a3a6b","#B81A1C","#2d5016","#1a4a5a",
  "#4a1a6b","#5a1a4a","#6b1a1a","#1a5a3a","#5a4a1a",
];

const ICONOS = ["⚖️","📋","📣","💹","👥","💻","⚙️","🎓","📊","🏥","📡","🏗️","🌿","🏛️","🚀","🔬","✈️","🎨","🎭","🏆"];

export default function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", color: COLORS[0], icono: "📚" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const { data, error } = await supabase.from('areas').select('*').order('id', { ascending: true });
    if (!error && data) setAreas(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await supabase.from('areas').update(form).eq('id', editId);
    } else {
      await supabase.from('areas').insert(form);
    }
    await fetchAreas();
    setShowModal(false);
    setForm({ nombre: "", color: COLORS[0], icono: "📚" });
    setEditId(null);
    setLoading(false);
  };

  const handleEdit = (a) => {
    setForm({ nombre: a.nombre, color: a.color, icono: a.icono });
    setEditId(a.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta área?")) return;
    await supabase.from('areas').delete().eq('id', id);
    await fetchAreas();
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <SectionLabel n={3} label="Clasificación académica" />
          <h1 className="font-montserrat font-black text-4xl text-udi-navy tracking-[-1px] uppercase m-0">
            Gestión de<br />
            <span className="text-udi-gray font-light italic">Áreas</span>
          </h1>
        </div>
        <button
          onClick={() => { setForm({ nombre: "", color: COLORS[0], icono: "📚" }); setEditId(null); setShowModal(true); }}
          className="bg-udi-navy text-white px-8 py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase hover:shadow-xl transition-all"
        >
          + Nueva Área
        </button>
      </div>

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {areas.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-udi-border rounded-sm p-6 hover:shadow-md transition-shadow group relative"
          >
            {/* Color accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-sm" style={{ background: a.color }} />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl" style={{ background: a.color + "18" }}>
                  {a.icono}
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-udi-text">{a.nombre}</div>
                  <div className="w-4 h-1 rounded-full mt-1.5" style={{ background: a.color }} />
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(a)} className="p-1.5 hover:bg-udi-light rounded-sm text-sm" title="Editar">✏️</button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded-sm text-sm" title="Eliminar">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-udi-navy/90 backdrop-blur-sm z-[2000] flex items-center justify-center p-10">
          <div className="bg-white w-full max-w-[480px] rounded-sm shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-udi-border">
              <h2 className="font-montserrat font-black text-xl text-udi-navy uppercase tracking-[1px]">
                {editId ? "Editar Área" : "Nueva Área"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-udi-gray hover:text-udi-navy text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Preview */}
              <div className="flex items-center gap-4 p-5 border border-udi-border rounded-sm bg-udi-light">
                <div className="w-14 h-14 rounded-sm flex items-center justify-center text-3xl" style={{ background: form.color + "20" }}>
                  {form.icono}
                </div>
                <div>
                  <div className="font-poppins font-bold text-sm text-udi-text">{form.nombre || "Nombre del área"}</div>
                  <div className="w-8 h-1 rounded-full mt-1.5" style={{ background: form.color }} />
                </div>
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Nombre del Área *</label>
                <input required type="text" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy"
                  placeholder="Ej: Derecho, Finanzas..." />
              </div>

              {/* Ícono */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Ícono</label>
                <div className="grid grid-cols-10 gap-2">
                  {ICONOS.map(ic => (
                    <button
                      key={ic} type="button"
                      onClick={() => setForm({ ...form, icono: ic })}
                      className={`w-9 h-9 rounded-sm text-lg flex items-center justify-center transition-all ${form.icono === ic ? "ring-2 ring-udi-navy bg-udi-light" : "hover:bg-udi-light"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Color Representativo</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className={`w-9 h-9 rounded-sm transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-udi-navy scale-110" : ""}`}
                      style={{ background: c }}
                    />
                  ))}
                  <input
                    type="color" value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    className="w-9 h-9 rounded-sm border border-udi-border cursor-pointer"
                    title="Color personalizado"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-udi-border">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-udi-border py-4 font-montserrat font-bold text-[11px] tracking-[2px] uppercase text-udi-gray hover:bg-udi-light transition-all">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-udi-navy text-white py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase hover:shadow-xl transition-all">
                  {editId ? "Guardar" : "Crear Área"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
