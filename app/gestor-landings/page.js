import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GestorLandingClient from './GestorLandingClient';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'gestor_session';
// See lib/gestor-session.js — fail closed in production when unset.
const SESSION_SECRET = process.env.GESTOR_SESSION_SECRET
  || (process.env.NODE_ENV === 'production' ? undefined : 'udi-gestor-2025');

export default async function GestorLandingsPage(props) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session || session.value !== SESSION_SECRET) {
    const slug = searchParams?.slug;
    const redirectUrl = slug ? `/gestor-landings/login?slug=${encodeURIComponent(slug)}` : '/gestor-landings/login';
    redirect(redirectUrl);
  }

  return <GestorLandingClient />;
}
