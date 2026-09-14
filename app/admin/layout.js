"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Diplomados", href: "/admin/programas", icon: "📚" },
    { label: "Áreas", href: "/admin/areas", icon: "🗂️" },
    { label: "Gestor Landings", href: "/gestor-landings", icon: "🚀" },
  ];

  return (
    <div className="min-h-screen bg-udi-light flex flex-col pt-[72px]">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-udi-border flex flex-col fixed left-0 top-[72px] bottom-0 z-50">
          <div className="px-8 pt-8 pb-4 border-b border-udi-border">
            <img src="/logo-black.png" alt="UDI" className="h-10 w-auto" />
            <p className="font-poppins text-[9px] uppercase tracking-[2px] text-udi-gray mt-3">Gestión Académica</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menu.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all group ${
                    active ? "bg-udi-navy text-white shadow-lg" : "text-udi-text hover:bg-udi-navy/5"
                  }`}
                >
                  <span className={`text-base ${active ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}>
                    {item.icon}
                  </span>
                  <span className="font-poppins text-[13px] font-semibold tracking-[0.5px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-udi-border space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 border border-udi-border text-udi-gray font-montserrat font-bold text-[10px] tracking-[2px] uppercase hover:bg-udi-light transition-all rounded-sm"
            >
              🌐 Ver Sitio Público
            </Link>
            <Link
              href="/gestor-landings"
              className="w-full flex items-center justify-center gap-2 py-3 bg-udi-navy text-white font-montserrat font-bold text-[10px] tracking-[2px] uppercase hover:shadow-md transition-all rounded-sm"
            >
              🚀 Gestor de Landings
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 ml-[280px] p-12 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
