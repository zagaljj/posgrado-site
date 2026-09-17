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

    // The interactive lead-capture form doesn't make sense in a static PDF
    // (nobody can submit it) — keep only the real contact details next to
    // it and let that column take the full width.
    //
    // page.pdf({width, height}) also re-derives the CSS viewport from the
    // PDF page box, so the hero's `vh`-based min-height resolves against
    // the whole document height instead of the real viewport, blowing the
    // hero up over the sections below it. Pin it to a fixed px value
    // (computed from the real viewport) so it's immune to that.
    await page.evaluate(() => {
      document.querySelector('.contacto__form-wrapper')?.remove();
      document.querySelector('.contacto__info-wrapper')?.style.setProperty('grid-column', '1 / -1');

      const hero = document.querySelector('.hero');
      if (hero) {
        const style = document.createElement('style');
        style.textContent = `.hero { min-height: ${window.innerHeight}px !important; }`;
        document.head.appendChild(style);
      }
    });

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
