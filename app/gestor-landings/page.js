'use client';

export default function GestorLandingsPage() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999, background: '#09090b' }}>
      <iframe
        src="/adminlanding/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Gestor de Landings"
      />
    </div>
  );
}
