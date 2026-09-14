import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'gestor_session';
// See lib/gestor-session.js — fail closed in production when unset.
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET
  || (process.env.NODE_ENV === 'production' ? undefined : 'udi-gestor-2025');

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /gestor-landings (except its own login page) and /admin.
  // Mirrors the session check in lib/gestor-session.js — kept duplicated
  // here because edge middleware cannot import next/headers.
  const isProtectedPath =
    (pathname.startsWith('/gestor-landings') && !pathname.startsWith('/gestor-landings/login')) ||
    pathname.startsWith('/admin');

  if (isProtectedPath) {
    const session = request.cookies.get(SESSION_COOKIE);

    if (!session || session.value !== SESSION_SECRET) {
      const loginUrl = new URL('/gestor-landings/login', request.url);
      // Preserve ?slug= param so the editor opens directly after login
      const slug = request.nextUrl.searchParams.get('slug');
      if (slug) loginUrl.searchParams.set('slug', slug);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestor-landings', '/gestor-landings/:path*', '/admin', '/admin/:path*'],
};
