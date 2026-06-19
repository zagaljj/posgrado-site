"use client";

import { useState, useMemo, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";
import DiplomaCard from "@/components/DiplomaCard";

export default function CatalogoClient({ diplomados: initialData, title = "Catálogo de", subtitle = "Diplomados", description = "Filtrá por área de interés o modalidad para encontrar el programa que mejor se adapte a tu carrera profesional.", tipoFilter = "Diplomado" }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Todas");
  const [modalidad, setModalidad] = useState("Todas");

  useEffect(() => {
    const saved = localStorage.getItem("DIPLOMADOS");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const baseFiltered = useMemo(() => data.filter(d => (d.tipo || "Diplomado") === tipoFilter), [data, tipoFilter]);

  const areas = ["Todas", ...new Set(baseFiltered.map((d) => d.area))];
  const modalidades = ["Todas", ...new Set(baseFiltered.map((d) => d.modalidad))];

  const filtered = useMemo(() => {
    return baseFiltered.filter((d) => {
      const matchSearch = d.titulo.toLowerCase().includes(search.toLowerCase());
      const matchArea = area === "Todas" || d.area === area;
      const matchMod = modalidad === "Todas" || d.modalidad === modalidad;
      return matchSearch && matchArea && matchMod;
    });
  }, [search, area, modalidad, baseFiltered]);

  return (
    <div className="bg-udi-light min-h-screen pt-[120px] pb-24 px-10">
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel n={1} label="Explorar programas" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <h1 className="font-montserrat font-black text-[clamp(32px,4vw,56px)] text-udi-navy tracking-[-2px] leading-none m-0 uppercase">
              {title}<br />
              <span className="text-udi-gray font-light italic">{subtitle}</span>
            </h1>
            <p className="font-poppins text-sm text-udi-gray mt-6 max-w-[480px] leading-relaxed">
              {description}
            </p>
          </div>

          <div className="bg-white p-6 border border-udi-border flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-2">
              <label className="font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-gray">Buscar</label>
              <input
                type="text"
                placeholder="Ej: Derecho..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="font-poppins text-sm px-4 py-2 border border-udi-border focus:border-udi-navy outline-none transition-colors w-full md:w-[240px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-gray">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="font-poppins text-sm px-4 py-2 border border-udi-border focus:border-udi-navy outline-none transition-colors bg-white cursor-pointer"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-gray">Modalidad</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="font-poppins text-sm px-4 py-2 border border-udi-border focus:border-udi-navy outline-none transition-colors bg-white cursor-pointer"
              >
                {modalidades.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 bg-white border border-udi-border rounded-sm overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((d) => (
              <DiplomaCard key={d.id} d={d} />
            ))
          ) : (
            <div className="py-20 text-center font-poppins text-udi-gray">
              No se encontraron programas con los filtros seleccionados.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="font-poppins text-xs text-udi-gray tracking-[1px]">
            Mostrando {filtered.length} de {baseFiltered.length} programas disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
