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

    // Match the landing's own desktop container width (max-w-[1280px])
    // so the layout renders the same as it does for a real visitor.
    await page.setViewport({ width: 1280, height: 1024 });
    // Navigate to the real landing URL instead of setContent(html) so
    // relative asset paths (CSS, fonts, icons under /assets, /uploads)
    // resolve against a real origin. setContent has no page origin, so
    // every relative reference silently fails and the PDF renders unstyled.
    await page.goto(`${origin}/${slug}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    // The landing is a single continuous scroll page, not print-paginated
    // content: sections use fixed/parallax backgrounds and tall hero blocks
    // that break apart (or bleed into each other) at arbitrary A4 page
    // cuts. Render it as one tall PDF page sized to the actual content
    // height instead, like a full-page capture, so nothing gets sliced.
    const contentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const pdfBuffer = await page.pdf({
      width: '1280px',
      height: `${contentHeight}px`,
      printBackground: true,
      pageRanges: '1',
    });

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
