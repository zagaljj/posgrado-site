import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'gestor_session';
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET || 'udi-gestor-2025';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /gestor-landings, not the login page itself
  if (pathname.startsWith('/gestor-landings') && !pathname.startsWith('/gestor-landings/login')) {
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
  matcher: ['/gestor-landings', '/gestor-landings/:path*'],
};
