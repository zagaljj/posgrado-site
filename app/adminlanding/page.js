'use client';

export default function AdminLandingPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 999999, background: '#fff' }}>
      <iframe
        src="/adminlanding/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Landing Generator Admin"
      />
    </div>
  );
}
