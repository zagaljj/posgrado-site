"use client";

import { useState } from "react";
import Link from "next/link";

const DiplomaCard = ({ d }) => {
  const [hov, setHov] = useState(false);

  const areaColors = {
    "Tecnología": "#003087",
    "Negocios y Servicios": "#1a4a5a",
    "Ingeniería": "#2c3e50",
    "Diseño y Creatividad": "#7b2d8b",
    "Formación de Educadores": "#3d5a80",
  };
  
  const ac = areaColors[d.area] || "#002744";

  return (
    <Link
      href={`/diplomados/${d.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group block border-b border-udi-border py-7 grid grid-cols-[3px_1fr_auto] gap-0 md:gap-7 items-center transition-colors hover:bg-udi-light"
    >
      {/* Color accent line */}
      <div
        className="w-[3px] h-full rounded-[2px] transition-colors self-stretch"
        style={{ background: hov ? ac : "var(--udi-border)" }}
      />

      <div className="pl-4 md:pl-2">
        <div className="flex flex-wrap gap-3 items-center mb-2">
          <span
            className="font-poppins text-[10px] font-semibold tracking-[2px] uppercase px-2.5 py-[3px] rounded-[2px]"
            style={{ color: ac, background: `${ac}18` }}
          >
            {d.area}
          </span>
          <span className="font-poppins text-[11px] text-udi-gray tracking-[1px]">
            {d.modalidad} · {d.duracion}
          </span>
          {d.estadoAcademico === "Completo" && (
            <span className="font-poppins text-[10px] tracking-[1px] text-[#c0392b] uppercase">
              Completo
            </span>
          )}
          {d.estadoAcademico === "Próximamente" && (
            <span className="font-poppins text-[10px] tracking-[1px] text-udi-gray uppercase">
              Próximamente
            </span>
          )}
        </div>
        <h3
          className={`font-montserrat font-bold text-base leading-[1.3] transition-colors ${
            hov ? "text-udi-navy" : "text-udi-text"
          }`}
        >
          {d.titulo}
        </h3>
        <div className="font-poppins text-xs text-udi-gray mt-1.5">
          {d.inicio} · {d.horas}h académicas
        </div>
      </div>

      <div className="text-right min-w-[140px] pr-4 md:pr-2 hidden sm:block">
        <div className="font-montserrat font-extrabold text-[22px] text-udi-navy leading-none">
          {d.estadoAcademico === "Próximamente" ? "---" : `Bs. ${d.precio.toLocaleString()}`}
        </div>
        <div className={`font-poppins text-[11px] mt-1 ${d.estadoAcademico === "Disponible" ? "text-[#27ae60]" : "text-udi-gray"}`}>
          {d.estadoAcademico === "Disponible" ? "Cupos disponibles" : d.estadoAcademico}
        </div>
        <div className="font-poppins text-[11px] font-semibold text-udi-navy mt-2 tracking-[1px]">
          Ver programa →
        </div>
      </div>
    </Link>
  );
};

export default DiplomaCard;
