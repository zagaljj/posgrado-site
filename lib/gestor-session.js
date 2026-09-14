import { cookies } from 'next/headers';

// NOTE: mirrors the constants inlined in middleware.js. Edge middleware cannot
// import next/headers, so the secret/cookie name are duplicated intentionally.
// If you change either value here, change it in middleware.js too.
const SESSION_COOKIE = 'gestor_session';
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET || 'udi-gestor-2025';

export async function hasGestorSession() {
  const session = (await cookies()).get(SESSION_COOKIE);
  return Boolean(session) && session.value === SESSION_SECRET;
}

/** Returns a 401 Response when unauthenticated, or null when the caller may proceed. */
export async function requireGestorSession() {
  if (await hasGestorSession()) return null;
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
