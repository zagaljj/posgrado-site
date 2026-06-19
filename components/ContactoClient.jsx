"use client";

import { useState } from "react";
import SectionLabel from "@/components/SectionLabel";
import Shield from "@/components/Shield";

const ContactoClient = () => {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setEnviado(true), 800);
  };

  const contactInfo = [
    { label: "Dirección", value: "Av. Bánzer y 6to. Anillo, Santa Cruz, Bolivia", icon: "📍" },
    { label: "WhatsApp", value: "+591 7XXXXXXXX", icon: "💬" },
    { label: "Horario de atención presencial", value: "Lun - Vie: 08:30 - 20:30 | Sáb: 09:00 - 13:00", icon: "⏰" },
    { 
      label: "Redes Sociales", 
      value: (
        <div className="flex gap-4">
          <a href="https://instagram.com/udi.posgrado" target="_blank" rel="noreferrer" className="text-udi-gray hover:text-udi-navy transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://facebook.com/udi.posgrado" target="_blank" rel="noreferrer" className="text-udi-gray hover:text-udi-navy transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
        </div>
      ), 
      icon: "📱" 
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <main>
        <section className="bg-udi-navy pt-[160px] pb-24 px-10 relative overflow-hidden">
          <div className="absolute left-0 top-0 opacity-[0.03] pointer-events-none">
            <Shield size={600} color="#fff" />
          </div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <SectionLabel n={1} label="¿Cómo podemos ayudarte?" light />
            <h1 className="font-montserrat font-black text-[clamp(44px,6vw,84px)] text-white tracking-[-2px] leading-none m-0 uppercase">
              Estamos en<br />
              <span className="text-white/45 italic font-extrabold">contacto</span>
            </h1>
          </div>
        </section>

        <section className="py-24 px-10">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
              <SectionLabel n={2} label="Información institucional" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
                {contactInfo.map((info) => (
                  <div key={info.label} className="border-l border-udi-border pl-6">
                    <div className="font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-gray mb-3 flex items-center gap-2">
                      <span className="opacity-50">{info.icon}</span> {info.label}
                    </div>
                    <div className="font-poppins text-sm text-udi-text leading-relaxed font-medium">
                      {info.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="aspect-video w-full bg-udi-light border border-udi-border flex flex-col items-center justify-center gap-4 relative overflow-hidden group grayscale hover:grayscale-0 transition-all cursor-crosshair">
                <div className="absolute inset-0 bg-udi-navy/5 pattern-grid opacity-20" />
                <Shield size={64} color="var(--udi-navy)" opacity={0.15} />
                <span className="font-montserrat font-black text-[10px] tracking-[4px] uppercase text-udi-navy/40 relative z-10">
                  Mapa Interactivo UDI
                </span>
                <div className="absolute bottom-6 right-6 bg-white shadow-lg border border-udi-border px-4 py-2 font-poppins text-[10px] uppercase tracking-[1px] text-udi-navy font-bold">
                  Abrir en Google Maps ↗
                </div>
              </div>
            </div>

            <div>
              <SectionLabel n={3} label="Formulario de consulta" />
              <div className="bg-udi-light p-10 border border-udi-border rounded-sm">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-udi-navy/10 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl">✉️</div>
                    <h3 className="font-montserrat font-black text-2xl text-udi-navy mb-4">Mensaje enviado</h3>
                    <p className="font-poppins text-sm text-udi-gray leading-relaxed mb-10 max-w-[320px] mx-auto">
                      Gracias por tu consulta. Un responsable de área te responderá a la brevedad.
                    </p>
                    <button 
                      onClick={() => setEnviado(false)}
                      className="font-poppins font-bold text-xs tracking-[2px] uppercase text-udi-navy border-b border-udi-navy pb-1"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Nombre</label>
                        <input required type="text" className="bg-white border border-udi-border px-5 py-4 font-poppins text-sm outline-none focus:border-udi-navy transition-colors" placeholder="Tu nombre" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Email</label>
                        <input required type="email" className="bg-white border border-udi-border px-5 py-4 font-poppins text-sm outline-none focus:border-udi-navy transition-colors" placeholder="ejemplo@correo.com" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Asunto</label>
                      <select className="bg-white border border-udi-border px-5 py-4 font-poppins text-sm outline-none focus:border-udi-navy transition-colors cursor-pointer">
                        <option>Información sobre Diplomados</option>
                        <option>Dudas sobre inscripciones</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Mensaje</label>
                      <textarea required className="bg-white border border-udi-border px-5 py-4 font-poppins text-sm outline-none focus:border-udi-navy transition-colors min-h-[160px] resize-none" placeholder="Escribí tu consulta aquí..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-udi-navy text-white py-5 font-montserrat font-black text-[12px] tracking-[3px] uppercase hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      Enviar consulta
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactoClient;
