import { cookies } from 'next/headers';

// NOTE: mirrors the constants inlined in middleware.js. Edge middleware cannot
// import next/headers, so the secret/cookie name are duplicated intentionally.
// If you change either value here, change it in middleware.js too.
const SESSION_COOKIE = 'gestor_session';
// In production, an unset GESTOR_SESSION_SECRET must NOT fall back to the
// known default — that would let anyone bypass auth by setting the
// gestor_session cookie to the well-known literal. Leaving it undefined
// here makes the `session.value === SESSION_SECRET` check below fail
// closed for every real cookie value.
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET
  || (process.env.NODE_ENV === 'production' ? undefined : 'udi-gestor-2025');

export async function hasGestorSession() {
  const session = (await cookies()).get(SESSION_COOKIE);
  return Boolean(session) && session.value === SESSION_SECRET;
}

/** Returns a 401 Response when unauthenticated, or null when the caller may proceed. */
export async function requireGestorSession() {
  if (await hasGestorSession()) return null;
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
