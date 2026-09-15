import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminProgramasClient from './AdminProgramasClient';

export const dynamic = 'force-dynamic';

// Defense-in-depth on top of the middleware.js matcher (/admin/:path*).
// Mirrors app/gestor-landings/page.js's cookie gate.
const SESSION_COOKIE = 'gestor_session';
// See lib/gestor-session.js — fail closed in production when unset.
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET
  || (process.env.NODE_ENV === 'production' ? undefined : 'udi-gestor-2025');

export default async function AdminProgramasPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session || session.value !== SESSION_SECRET) {
    redirect('/gestor-landings/login');
  }

  return <AdminProgramasClient />;
}
