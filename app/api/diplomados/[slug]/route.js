import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'landings');

export async function GET(req, { params }) {
  const { slug } = await params;
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return Response.json(data);
    } catch (e) {}
  }
  return Response.json({ error: 'Diplomado not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  try {
    const filePath = path.join(DATA_DIR, `${slug}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {}

  return Response.json({ success: true });
}
