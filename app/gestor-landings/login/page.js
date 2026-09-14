'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/gestor-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.success) {
        const slug = searchParams.get('slug');
        const dest = slug ? `/gestor-landings?slug=${slug}` : '/gestor-landings';
        router.push(dest);
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[12px] bg-white/5 border border-white/10 mb-6 text-2xl font-bold text-white/70 font-mono">
            LG
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight mb-1">Landing Generator</h1>
          <p className="text-white/40 text-sm">UDI Posgrado · Acceso Restringido</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-[1.5px] font-semibold">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@udi.edu.bo"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-white/20 focus:border-indigo-500 focus:bg-white/8 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs uppercase tracking-[1.5px] font-semibold">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-white/20 focus:border-indigo-500 focus:bg-white/8 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Verificando...' : 'Ingresar al gestor →'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/40 transition-colors">← Volver al sitio público</a>
        </p>
      </div>
    </div>
  );
}

export default function GestorLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
