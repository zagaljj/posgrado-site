"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Shield from "@/components/Shield";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const [auth, setAuth] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
    
    if (error) {
      setError(`Error: ${error.message}`);
    } else {
      setAuth(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuth(false);
    router.push("/admin");
  };

  if (auth === null) return null;

  if (!auth) {
    return (
      <div className="min-h-screen bg-udi-navy flex items-center justify-center px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Shield size={800} color="#fff" />
        </div>

        <div className="bg-white p-12 max-w-[500px] w-full rounded-sm shadow-2xl relative z-10">
          <div className="flex justify-center mb-10">
            <img src="/logo-black.png" alt="UDI Educación Continua" className="h-16 w-auto" />
          </div>
          <h2 className="font-montserrat font-black text-xl text-udi-navy text-center uppercase tracking-[2px] mb-2">
            Panel de Control
          </h2>
          <p className="font-poppins text-[10px] text-udi-gray text-center uppercase tracking-[1px] mb-10">
            Gestión de Oferta Académica · Acceso Restringido
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Email de administrador</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy transition-colors"
                placeholder="admin@udi.edu.bo"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-montserrat font-bold text-[9px] tracking-[2px] uppercase text-udi-gray">Contraseña</label>
              <input
                type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                className="border border-udi-border px-4 py-3 font-poppins text-sm outline-none focus:border-udi-navy transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-[#c0392b] font-poppins text-[11px] text-center bg-red-50 p-2 border border-red-100 rounded-sm">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-udi-navy text-white py-4 font-montserrat font-black text-[11px] tracking-[3px] uppercase hover:shadow-lg transition-all"
            >
              Entrar al Sistema
            </button>
          </form>

          <Link href="/" className="block text-center mt-10 font-poppins text-[10px] text-udi-gray uppercase tracking-[1px] hover:text-udi-navy transition-colors">
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    );
  }

  const menu = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Diplomados", href: "/admin/programas", icon: "📚" },
    { label: "Áreas", href: "/admin/areas", icon: "🗂️" },
  ];

  return (
    <div className="min-h-screen bg-udi-light flex flex-col pt-[72px]">
      <div className="flex flex-1">
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
            <Link href="/" className="w-full flex items-center justify-center gap-2 py-3 border border-udi-border text-udi-gray font-montserrat font-bold text-[10px] tracking-[2px] uppercase hover:bg-udi-light transition-all rounded-sm">
              🌐 Ver Sitio Público
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 border border-[#c0392b44] text-[#c0392b] font-montserrat font-bold text-[10px] tracking-[2px] uppercase hover:bg-[#c0392b] hover:text-white transition-all rounded-sm"
            >
              Cerrar Sesión 🚪
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-[280px] p-12 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
