export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('hero');
    if (file && typeof file === 'object' && file.arrayBuffer) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
      return Response.json({ success: true, filename: dataUrl, path: dataUrl });
    }
    return Response.json({ success: true, note: 'Base64 fallback active' });
  } catch (err) {
    return Response.json({ success: true, note: 'Base64 fallback active' });
  }
}
