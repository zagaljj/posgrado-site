import CatalogoClient from "@/components/CatalogoClient";
import { DIPLOMADOS_DATA } from "@/data/diplomados";

export const metadata = {
  title: "Cursos y Talleres — UDI Posgrado",
  description: "Explorá nuestra oferta académica de cursos y talleres en Santa Cruz. Formación continua y actualización profesional.",
};

export default function CursosPage() {
  return (
    <CatalogoClient 
      diplomados={DIPLOMADOS_DATA} 
      title="Cursos y"
      subtitle="Talleres"
      description="Filtrá por área de interés o modalidad para encontrar el curso o taller que mejor se adapte a tus necesidades de actualización."
      tipoFilter="Curso"
    />
  );
}
