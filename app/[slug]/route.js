import { renderLandingPage } from '../../lib/landing-renderer';

const RESERVED = new Set([
  'admin',
  'api',
  'catalogo',
  'contacto',
  'cursos',
  'diplomados',
  'postitulos',
  '_next',
  'favicon.ico',
  'assets',
  'uploads'
]);

export async function GET(req, { params }) {
  const { slug } = await params;

  if (RESERVED.has(slug)) {
    return new Response('Not Found', { status: 404 });
  }

  const html = renderLandingPage(slug);
  if (!html) {
    return new Response(`Diplomado "${slug}" no encontrado`, { status: 404 });
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
