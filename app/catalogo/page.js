import CatalogoClient from "@/components/CatalogoClient";
import { getAllDiplomados } from "@/lib/supabase-landings";

export const revalidate = 60;

export default async function CatalogoPage() {
  const all = await getAllDiplomados();
  const programas = all.map(d => ({
    id: d.slug,
    slug: d.slug,
    titulo: d.title || d.slug,
    descripcion: d.subtitle || d.objetivoGeneral || '',
    tipo: "Diplomado",
    modalidad: d.modalidad || "Virtual — Clases en vivo",
    precio: d.precio || 1500,
    inicio: d.fechaInicio || '',
    arte_url: d.heroImage?.startsWith('http') || d.heroImage?.startsWith('data:') ? d.heroImage : (d.heroImage ? `/uploads/heroes/${d.heroImage}` : '/logo-black.png'),
    areas: { nombre: d.area || "Tecnología e Innovación", color: "#002744" },
    activo: true
  }));

  return <CatalogoClient diplomados={programas} />;
}
