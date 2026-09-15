const MAX_BYTES = 2 * 1024 * 1024; // 2MB — images are stored inline as base64 in the diplomado's JSON row

export async function handleImageUpload(req, fieldName) {
  let formData;
  try {
    formData = await req.formData();
  } catch (err) {
    return Response.json({ success: false, error: 'No se pudo leer el archivo enviado.' }, { status: 400 });
  }

  const file = formData.get(fieldName);
  if (!file || typeof file !== 'object' || !file.arrayBuffer) {
    return Response.json({ success: false, error: 'No se recibió ningún archivo.' }, { status: 400 });
  }

  if (!file.type || !file.type.startsWith('image/')) {
    return Response.json({ success: false, error: 'El archivo debe ser una imagen.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { success: false, error: `La imagen supera el límite de ${MAX_BYTES / (1024 * 1024)}MB. Comprimila antes de subirla.` },
      { status: 413 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUrl = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
    return Response.json({ success: true, filename: dataUrl, path: dataUrl });
  } catch (err) {
    return Response.json({ success: false, error: 'No se pudo procesar la imagen.' }, { status: 500 });
  }
}
