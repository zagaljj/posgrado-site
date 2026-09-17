import { PDFDocument } from 'pdf-lib';
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
    // Match the landing's own desktop container width (max-w-[1280px])
    // so the layout renders the same as it does for a real visitor.
    await page.setViewport({ width: 1280, height: 1024 });
    // Navigate to the real landing URL instead of setContent(html) so
    // relative asset paths (CSS, fonts, icons under /assets, /uploads)
    // resolve against a real origin. setContent has no page origin, so
    // every relative reference silently fails and the PDF renders unstyled.
    await page.goto(`${origin}/${slug}`, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');

    // page.pdf({width, height}) re-derives the CSS viewport from the PDF
    // page box, so `vh`-based rules (the hero uses `min-height: 90vh`)
    // resolve against the whole document height instead of the real
    // viewport, blowing the hero section up over the sections below it.
    // A full-page screenshot renders with the real 1280x1024 viewport
    // (matching what a visitor sees) and has no such print-layout quirks,
    // so capture that and wrap it in a single-page PDF instead of using
    // Puppeteer's own PDF pagination.
    const screenshot = await page.screenshot({ type: 'jpeg', quality: 92, fullPage: true });

    const pdfDoc = await PDFDocument.create();
    const jpgImage = await pdfDoc.embedJpg(screenshot);
    const pdfPage = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
    pdfPage.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
    const pdfBuffer = await pdfDoc.save();

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
