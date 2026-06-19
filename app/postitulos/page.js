import CatalogoClient from "@/components/CatalogoClient";
import { DIPLOMADOS_DATA } from "@/data/diplomados";

export const metadata = {
  title: "Catálogo de Postítulos — UDI Posgrado",
  description: "Explorá nuestra oferta académica de postítulos en Santa Cruz. Formación de excelencia para tu desarrollo profesional.",
};

export default function PostitulosPage() {
  return (
    <CatalogoClient 
      diplomados={DIPLOMADOS_DATA} 
      title="Catálogo de"
      subtitle="Postítulos"
      description="Filtrá por área de interés o modalidad para encontrar el postítulo que mejor se adapte a tu carrera profesional."
      tipoFilter="Postítulo"
    />
  );
}
