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

  const origin = new URL(req.url).origin;

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
    // Navigate to the real landing URL instead of setContent(html) so
    // relative asset paths (CSS, fonts, icons under /assets, /uploads)
    // resolve against a real origin. setContent has no page origin, so
    // every relative reference silently fails and the PDF renders unstyled.
    await page.goto(`${origin}/${slug}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
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
