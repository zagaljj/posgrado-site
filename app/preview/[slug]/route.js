import { renderLandingPage } from '../../../lib/landing-renderer';

export async function GET(req, { params }) {
  const { slug } = await params;

  const html = await renderLandingPage(slug);
  if (!html) {
    return new Response(`Diplomado "${slug}" no encontrado`, { status: 404 });
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
