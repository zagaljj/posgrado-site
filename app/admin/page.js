"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [diplomados, setDiplomados] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [dipRes, areasRes] = await Promise.all([
        supabase.from('programas').select('*, areas(nombre, color)').order('created_at', { ascending: true }),
        supabase.from('areas').select('*').order('nombre')
      ]);
      if (dipRes.data) setDiplomados(dipRes.data);
      if (areasRes.data) setAreas(areasRes.data);
    };
    fetchData();
  }, []);

  const activos = diplomados.filter(d => d.activo).length;
  const conArte = diplomados.filter(d => d.arte).length;
  const proximos = diplomados.filter(d => d.estadoAcademico === "Próximamente").length;
  const recientes = [...diplomados].slice(-4).reverse();

  const stats = [
    { label: "Programas Activos", val: activos, icon: "📚", sub: `${diplomados.length} en total` },
    { label: "Áreas Académicas", val: areas.length, icon: "🗂️", sub: "disponibles" },
    { label: "Próximos Lanzamientos", val: proximos, icon: "🚀", sub: "programas en preparación" },
    { label: "Con Arte / Flyer", val: conArte, icon: "🖼️", sub: `${diplomados.length - conArte} sin imagen` },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <SectionLabel n={1} label="Estado de la oferta" />
          <h1 className="font-montserrat font-black text-4xl text-udi-navy tracking-[-1px] uppercase m-0">
            Dashboard<br />
            <span className="text-udi-gray font-light italic">Académico</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/programas" className="bg-udi-navy text-white px-6 py-3 font-montserrat font-black text-[10px] tracking-[3px] uppercase hover:shadow-lg transition-all">
            + Programa
          </Link>
          <Link href="/admin/areas" className="border border-udi-navy text-udi-navy px-6 py-3 font-montserrat font-black text-[10px] tracking-[3px] uppercase hover:bg-udi-navy hover:text-white transition-all">
            + Área
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 border border-udi-border rounded-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-4">{s.icon}</div>
            <div className="font-montserrat font-black text-4xl text-udi-navy mb-1">{s.val}</div>
            <div className="font-poppins text-[11px] font-bold text-udi-gray uppercase tracking-[1px]">{s.label}</div>
            <div className="font-poppins text-[10px] text-udi-gray/60 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Recently Added */}
        <div className="bg-white border border-udi-border p-8 rounded-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-montserrat font-bold text-xs tracking-[3px] uppercase text-udi-navy">Últimos Programas Cargados</h3>
            <Link href="/admin/programas" className="font-poppins text-[10px] text-udi-gray hover:text-udi-navy uppercase tracking-[1px] transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {recientes.map((d) => (
              <div key={d.id} className="flex items-center gap-5 py-4 border-b border-udi-light last:border-0">
                {/* Arte thumbnail */}
                <div className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 bg-udi-light border border-udi-border">
                  {d.arte ? (
                    <img src={d.arte} alt={d.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🖼️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-poppins text-sm font-bold text-udi-text truncate">{d.titulo}</div>
                  <div className="font-poppins text-[11px] text-udi-gray">{d.areas?.nombre} · {d.modalidad}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-montserrat font-black text-sm text-udi-navy">Bs. {d.precio.toLocaleString()}</div>
                  <span className={`font-poppins text-[9px] font-bold uppercase tracking-[1px] px-2 py-0.5 rounded-[2px] ${d.activo ? "bg-udi-navy/10 text-udi-navy" : "bg-udi-gray/10 text-udi-gray"}`}>
                    {d.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Quick View */}
        <div className="bg-white border border-udi-border p-8 rounded-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-montserrat font-bold text-xs tracking-[3px] uppercase text-udi-navy">Áreas Académicas</h3>
            <Link href="/admin/areas" className="font-poppins text-[10px] text-udi-gray hover:text-udi-navy uppercase tracking-[1px] transition-colors">
              Gestionar →
            </Link>
          </div>
          <div className="space-y-2">
            {areas.slice(0, 8).map((a) => {
              const count = diplomados.filter(d => d.area_id === a.id).length;
              return (
                <div key={a.id} className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                  <span className="font-poppins text-xs font-medium text-udi-text flex-1">{a.nombre}</span>
                  <span className="font-montserrat font-black text-xs text-udi-gray">{count}</span>
                </div>
              );
            })}
            {areas.length > 8 && (
              <p className="font-poppins text-[10px] text-udi-gray text-center pt-2">+ {areas.length - 8} más</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
