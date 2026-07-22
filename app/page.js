import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import DiplomaCard from "@/components/DiplomaCard";
import { supabase } from "@/lib/supabase";

// Next.js revalidation (opcional, para que los datos nuevos tarden maximo 60s en aparecer en prod)
export const revalidate = 60;

export default async function Home() {
  // Fetch destacados directly from DB on the server
  const { data: destacados } = await supabase
    .from('programas')
    .select('*, areas(nombre, color)')
    .eq('destacado', true)
    .eq('activo', true)
    .limit(6);

  const stats = [
    { n: "+100", label: "Programas activos" },
    { n: "+500", label: "Profesionales graduados" },
    { n: "5", label: "Áreas académicas" },
    { n: "100%", label: "Docentes especializados" },
  ];

  const areas = [
    { n: "Tecnología", i: "💻" },
    { n: "Negocios y Servicios", i: "📊" },
    { n: "Ingeniería", i: "⚙️" },
    { n: "Diseño y Creatividad", i: "🎨" },
    { n: "Formación de Educadores", i: "🎓" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="bg-udi-navy min-h-screen relative overflow-hidden flex flex-col">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30" 
            style={{ backgroundImage: "url('/hero-bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-udi-navy via-udi-navy/80 to-udi-navy z-[1]" />

          {/* Watermark Isotipo (Escudo Recortado) */}
          <div className="absolute -right-[80px] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block z-[2] opacity-[0.03]">
            <div className="w-[450px] h-[450px] overflow-hidden flex items-center justify-start">
              <img src="/logo-white.png" alt="" className="h-full w-auto object-cover scale-[2.2] translate-x-[-15%]" />
            </div>
          </div>
          
          {/* Diagonal geometric strips */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-white/[0.025] [clip-path:polygon(0_60%,100%_20%,100%_100%,0_100%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-white/[0.015] [clip-path:polygon(0_40%,100%_0,100%_100%,0_100%)] pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-10 flex-1 flex flex-col justify-center pt-[120px] pb-20 relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-10 bg-white/30" />
              <span className="font-poppins font-light text-[11px] tracking-[4px] uppercase text-white/50">
                Universidad Para el Desarrollo y la Innovación · Santa Cruz, Bolivia
              </span>
            </div>

            {/* Massive headline */}
            <div className="max-w-[900px]">
              <h1 className="font-montserrat font-black text-[clamp(52px,6.5vw,96px)] color-white leading-none m-0 tracking-[-2px] text-white">
                Educación de<br />
                <span className="italic font-extrabold text-white/45 tracking-[-1px]">posgrado</span><br />
                <span className="tracking-[-2px]">para líderes.</span>
              </h1>
            </div>

            {/* Divider with description */}
            <div className="grid grid-cols-[1px_1fr] gap-10 mt-14 max-w-[680px]">
              <div className="bg-white/20" />
              <div>
                <p className="font-poppins font-light text-base text-white/65 leading-[1.8] mb-8">
                  Más de 100 programas en diversas áreas del conocimiento, diseñados por especialistas para potenciar el desarrollo profesional de quienes buscan la excelencia.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/catalogo"
                    className="bg-white text-udi-navy font-poppins font-semibold text-xs tracking-[2px] uppercase px-8 py-3.5 rounded-[2px] transition-opacity hover:opacity-90"
                  >
                    Ver programas
                  </Link>
                  <Link
                    href="/contacto"
                    className="bg-transparent text-white border border-white/30 font-poppins font-normal text-xs tracking-[2px] uppercase px-8 py-3.5 rounded-[2px] hover:bg-white/5 transition-colors"
                  >
                    Contactar
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/10">
            <div className="max-w-[1280px] mx-auto px-10 py-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div
                  key={s.n}
                  className={`pl-6 ${i > 0 ? "md:border-l border-white/10" : ""}`}
                >
                  <div className="font-montserrat font-black text-[32px] text-white tracking-[-1.5px]">
                    {s.n}
                  </div>
                  <div className="font-poppins font-light text-xs text-white/45 tracking-[0.5px] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ÁREAS ────────────────────────────────────────────── */}
        <section className="bg-white py-24 px-10">
          <div className="max-w-[1280px] mx-auto">
            <SectionLabel n={1} label="Áreas de especialización" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0">
              {areas.map((a, i) => (
                <Link
                  key={a.n}
                  href="/catalogo"
                  className={`group py-8 px-3 flex flex-col items-center gap-3 transition-colors hover:bg-udi-light ${
                    i < 4 ? "lg:border-r border-udi-border" : ""
                  }`}
                >
                  <span className="text-xl opacity-40 group-hover:opacity-100 transition-opacity">
                    {a.i}
                  </span>
                  <span className="font-poppins text-[11px] font-medium tracking-[1px] uppercase text-udi-text text-center leading-[1.3]">
                    {a.n}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIPLOMADOS DESTACADOS ─────────────────────────────── */}
        <section className="bg-udi-light py-24 px-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <SectionLabel n={2} label="Programas seleccionados" />
                <h2 className="font-montserrat font-black text-[clamp(28px,3vw,44px)] text-udi-text tracking-[-1px] leading-none m-0">
                  Programas<br />
                  <span className="text-udi-gray font-light italic">destacados</span>
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="font-poppins font-medium text-xs tracking-[2px] uppercase text-udi-navy border-b border-udi-navy pb-0.5 hover:opacity-70 transition-opacity"
              >
                Ver todos →
              </Link>
            </div>
            <div className="bg-white rounded-sm overflow-hidden border border-udi-border">
              {destacados && destacados.length > 0 ? (
                destacados.map((d) => (
                  <DiplomaCard key={d.id} d={d} />
                ))
              ) : (
                <div className="p-10 text-center font-poppins text-sm text-udi-gray">No hay programas destacados disponibles.</div>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="bg-udi-navy py-24 px-10 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 pointer-events-none hidden lg:block opacity-[0.05]">
            <div className="w-[300px] h-[300px] overflow-hidden flex items-center justify-start">
              <img src="/logo-white.png" alt="" className="h-full w-auto object-cover scale-[2.5] translate-x-[-20%]" />
            </div>
          </div>
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <SectionLabel n={3} label="Siguiente paso" light />
              <h2 className="font-montserrat font-black text-[clamp(28px,3.5vw,52px)] text-white tracking-[-1px] leading-[1.05] m-0">
                ¿Listo para dar<br />
                <span className="text-white/45 italic font-extrabold">el siguiente</span><br />
                paso?
              </h2>
            </div>
            <div>
              <p className="font-poppins font-light text-[15px] text-white/60 leading-[1.8] mb-9">
                Nuestros programas están disponibles en modalidades presencial, semipresencial y virtual. Un asesor te guiará en la selección del programa ideal para tu perfil y objetivos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="bg-white text-udi-navy font-poppins font-semibold text-xs tracking-[2px] uppercase px-8 py-3.5 rounded-[2px] transition-opacity hover:opacity-90"
                >
                  Explorar programas
                </Link>
                <Link
                  href="/contacto"
                  className="bg-transparent text-white border border-white/25 font-poppins font-normal text-xs tracking-[2px] uppercase px-8 py-3.5 rounded-[2px] hover:bg-white/5 transition-colors"
                >
                  Hablar con un asesor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
