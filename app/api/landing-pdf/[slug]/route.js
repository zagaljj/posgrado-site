import { renderLandingPage } from '../../../../lib/landing-renderer';
import { requireGestorSession } from '../../../../lib/gestor-session';

export const maxDuration = 60;

export async function GET(req, { params }) {
  const denied = await requireGestorSession();
  if (denied) return denied;

  const { slug } = await params;

  const html = await renderLandingPage(slug);
  if (!html) {
    return new Response(`Diplomado "${slug}" no encontrado`, { status: 404 });
  }

  let browser;
  try {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = await import('puppeteer-core');

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error(`Error generando PDF para "${slug}":`, err);
    return Response.json(
      { error: err?.message || 'No se pudo generar el PDF.' },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
