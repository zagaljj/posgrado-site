"use client";

import { useState, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";
import Shield from "@/components/Shield";
import { supabase } from "@/lib/supabase";

const DiplomaDetailClient = ({ d: initialData }) => {
  const [d, setD] = useState(initialData);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "" });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.from('inscripciones').insert({
      programa_id: d.id,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      estado: 'nuevo'
    });

    if (error) {
      console.error("Error al inscribirse:", error);
      alert("Hubo un problema al enviar tu solicitud. Intenta nuevamente.");
    } else {
      setEnviado(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section 
          className="bg-udi-navy pt-[160px] pb-24 px-10 relative overflow-hidden flex flex-col justify-center min-h-[500px]"
          style={d.arte_url ? { 
            backgroundImage: `url(${d.arte_url})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          } : {}}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-udi-navy/40 via-udi-navy/70 to-udi-navy z-[1]" />
          
          <div className="max-w-[800px] mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="font-poppins text-xs font-bold tracking-[3px] uppercase text-white/50">{d.areas?.nombre}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="font-poppins text-xs font-light tracking-[3px] uppercase text-white/50">{d.modalidad}</span>
            </div>
            <h1 className="font-montserrat font-black text-[clamp(36px,5vw,64px)] text-white tracking-[-2px] leading-[1.1] mb-10">{d.titulo}</h1>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-left border-l border-white/20 pl-6">
                <div className="font-montserrat font-black text-2xl text-white">Bs. {d.precio.toLocaleString()}</div>
                <div className="font-poppins text-[10px] uppercase tracking-[2px] text-white/40 mt-1">Inversión</div>
              </div>
              <div className="text-left border-l border-white/20 pl-6">
                <div className="font-montserrat font-black text-2xl text-white">{d.duracion}</div>
                <div className="font-poppins text-[10px] uppercase tracking-[2px] text-white/40 mt-1">Duración</div>
              </div>
              <div className="text-left border-l border-white/20 pl-6">
                <div className="flex gap-4 mt-1">
                  <a href={`https://facebook.com/sharer/sharer.php?u=https://posgrado.udi.edu.bo/diplomados/${d.slug}`} target="_blank" rel="noreferrer" className="text-white hover:text-white/60 transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=https://posgrado.udi.edu.bo/diplomados/${d.slug}&text=${d.titulo}`} target="_blank" rel="noreferrer" className="text-white hover:text-white/60 transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                  </a>
                  <a href={`https://api.whatsapp.com/send?text=Mirá este programa: https://posgrado.udi.edu.bo/diplomados/${d.slug}`} target="_blank" rel="noreferrer" className="text-white hover:text-white/60 transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                  </a>
                </div>
                <div className="font-poppins text-[10px] uppercase tracking-[2px] text-white/40 mt-2">Compartir</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 px-10">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
            <div>
              <SectionLabel n={1} label="Información del programa" />
              <p className="font-poppins text-lg text-udi-text leading-relaxed mb-16 opacity-80">{d.descripcion}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h3 className="font-montserrat font-black text-xs tracking-[3px] uppercase text-udi-navy mb-8">Objetivos</h3>
                  <ul className="space-y-4">
                    {d.objetivos.map((obj, i) => (
                      <li key={i} className="flex gap-4 font-poppins text-sm text-udi-gray leading-relaxed">
                        <span className="text-udi-navy font-bold">0{i+1}.</span>{obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-montserrat font-black text-xs tracking-[3px] uppercase text-udi-navy mb-8">Docentes del programa</h3>
                  <div className="space-y-4">
                    {d.docentes.map((doc, i) => (
                      <div key={i} className="flex items-center gap-4 bg-udi-light p-4 rounded-sm border border-udi-border">
                        <div className="w-10 h-10 rounded-full bg-udi-navy/10 flex items-center justify-center font-montserrat font-black text-udi-navy text-xs">{doc.charAt(0)}</div>
                        <span className="font-poppins text-sm font-semibold text-udi-text">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">

              <div className="sticky top-[100px] bg-udi-navy p-10 rounded-sm shadow-2xl">
                {enviado ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✅</div>
                    <h3 className="font-montserrat font-black text-xl text-white mb-4">¡Registro Exitoso!</h3>
                    <p className="font-poppins text-sm text-white/60 leading-relaxed mb-8">Un asesor se pondrá en contacto pronto.</p>
                    <button onClick={() => setEnviado(false)} className="text-white border-b border-white/30 text-xs tracking-[2px] uppercase pb-1">Volver a aplicar</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-montserrat font-black text-xl text-white mb-2">Inscribite hoy</h3>
                    <p className="font-poppins font-light text-xs text-white/40 mb-10 tracking-[1px] uppercase">Asegurá tu lugar</p>
                    
                    {d.brochure_url && (
                      <a 
                        href={d.brochure_url} 
                        download={`Brochure-${d.titulo}.pdf`}
                        className="flex items-center justify-center gap-3 w-full bg-white/10 border border-white/20 text-white py-4 font-montserrat font-bold text-[11px] tracking-[2px] uppercase mb-6 hover:bg-white/20 transition-all"
                      >
                        <span className="text-xl">📄</span>
                        Descargar Brochure
                      </a>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-white/30">Nombre</label>
                        <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="bg-white/5 border border-white/15 px-4 py-3 text-white font-poppins text-sm outline-none focus:border-white/40" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-white/30">Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border border-white/15 px-4 py-3 text-white font-poppins text-sm outline-none focus:border-white/40" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-white/30">WhatsApp</label>
                        <input required type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="bg-white/5 border border-white/15 px-4 py-3 text-white font-poppins text-sm outline-none focus:border-white/40" />
                      </div>
                      <button type="submit" className="w-full bg-white text-udi-navy py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase mt-4 hover:shadow-xl transition-all">Enviar solicitud</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DiplomaDetailClient;
