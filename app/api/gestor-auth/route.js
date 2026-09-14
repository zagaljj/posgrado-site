import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_EMAIL    = process.env.GESTOR_EMAIL    || 'admin@udi.edu.bo';
const VALID_PASSWORD = process.env.GESTOR_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET || 'udi-gestor-2025';
const SESSION_COOKIE = 'gestor_session';

export async function POST(req) {
  try {
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
