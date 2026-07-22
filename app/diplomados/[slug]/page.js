import DiplomaDetailClient from "@/components/DiplomaDetailClient";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data: d } = await supabase
    .from('programas')
    .select('*, areas(nombre, color)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!d) return { title: "Programa no encontrado" };

  return {
    title: `${d.titulo} — UDI Posgrado`,
    description: d.descripcion?.substring(0, 160) || "",
    openGraph: {
      title: `${d.titulo} | UDI`,
      description: d.descripcion?.substring(0, 160) || "",
      type: "article",
    }
  };
}

export default async function DiplomaPage({ params }) {
  const resolvedParams = await params;
  const { data: d } = await supabase
    .from('programas')
    .select('*, areas(nombre, color)')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!d) return (
    <div className="min-h-screen pt-32 text-center font-poppins text-udi-navy">
      Programa no encontrado.
    </div>
  );

  return <DiplomaDetailClient d={d} />;
}
