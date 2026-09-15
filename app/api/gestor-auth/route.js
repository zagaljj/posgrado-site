import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In production, GESTOR_EMAIL/PASSWORD/SESSION_SECRET MUST come from real
// env vars (Vercel dashboard). The hardcoded fallbacks below only exist for
// local development convenience — they are well-known and unsafe to run
// with in production. See docs/credential-rotation-task3.md.
const IS_PRODUCTION  = process.env.NODE_ENV === 'production';
const VALID_EMAIL    = process.env.GESTOR_EMAIL    || (IS_PRODUCTION ? undefined : 'admin@udi.edu.bo');
const VALID_PASSWORD = process.env.GESTOR_PASSWORD || (IS_PRODUCTION ? undefined : 'admin123');
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET || (IS_PRODUCTION ? undefined : 'udi-gestor-2025');
const SESSION_COOKIE = 'gestor_session';

export async function POST(req) {
  try {
    if (IS_PRODUCTION && (!VALID_EMAIL || !VALID_PASSWORD || !SESSION_SECRET)) {
      console.error('gestor-auth misconfigured: GESTOR_EMAIL/GESTOR_PASSWORD/GESTOR_SESSION_SECRET must be set in production.');
      return NextResponse.json(
        { success: false, error: 'Servidor mal configurado. Contactá al administrador.' },
        { status: 500 }
      );
    }

    const { email, password } = await req.json();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Email o contraseña incorrectos' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
