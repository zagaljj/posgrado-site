import CatalogoClient from "@/components/CatalogoClient";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function CatalogoPage() {
  const { data: programas } = await supabase
    .from('programas')
    .select('*, areas(nombre, color)')
    .order('created_at', { ascending: false });

  return <CatalogoClient diplomados={programas || []} />;
}
