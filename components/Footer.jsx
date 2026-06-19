import Link from "next/link";
import Logo from "./Logo";
import Shield from "./Shield";

const Footer = () => {
  const sections = [
    {
      title: "Programas",
      items: [
        { label: "Todos los diplomados", href: "/catalogo" },
        { label: "Áreas académicas", href: "/catalogo" },
        { label: "Modalidades", href: "/catalogo" },
      ],
    },
    {
      title: "Institución",
      items: [
        { label: "Misión y visión", href: "/" },
        { label: "Docentes", href: "/" },
        { label: "Contacto", href: "/contacto" },
      ],
    },
    {
      title: "Información",
      items: [
        { label: "¿Cómo inscribirse?", href: "/catalogo" },
        { label: "Preguntas frecuentes", href: "/contacto" },
        { label: "Portal estudiante", href: "/" },
      ],
    },
  ];

  const social = [
    { 
      label: "Facebook", 
      href: "https://facebook.com",
      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    },
    { 
      label: "Instagram", 
      href: "https://instagram.com",
      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    },
    { 
      label: "LinkedIn", 
      href: "https://linkedin.com",
      icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    },
  ];

  return (
    <footer className="bg-udi-navy2 text-white">
      <div className="max-w-[1280px] mx-auto px-10 pt-16">
        <div className="border-t border-white/12 pt-13 grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] gap-12 pb-13">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <img 
                src="/logo-white.png" 
                alt="UDI Educación Continua" 
                className="h-14 w-auto"
              />
            </div>
            <p className="font-poppins text-[13px] text-white/45 leading-[1.8] max-w-[280px]">
              Formamos y actualizamos a profesionales a través de programas de educación continua y posgrado de excelencia académica.
            </p>
            <div className="flex gap-0.5 mt-7">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center font-montserrat text-[10px] font-bold tracking-widest text-white/50 border-r border-white/10 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {sections.map((col) => (
            <div key={col.title}>
              <div className="font-poppins font-semibold text-[10px] tracking-[3px] uppercase text-white/30 mb-5">
                {col.title}
              </div>
              {col.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-1.5 font-poppins text-[13px] text-white/55 text-left hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/7 py-[18px] px-10">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-poppins text-[11px] text-white/25 tracking-[0.5px]">
            © 2025 UDI Posgrado. Todos los derechos reservados.
          </span>
          <span className="font-poppins text-[11px] text-white/25 tracking-[0.5px]">
            Av. Bánzer y 6to. Anillo · Santa Cruz, Bolivia
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
