import { requireGestorSession } from '../../../../lib/gestor-session';
import { handleImageUpload } from '../../../../lib/upload-image';

export async function POST(req) {
  const denied = await requireGestorSession();
  if (denied) return denied;

  return handleImageUpload(req, 'photo');
}
