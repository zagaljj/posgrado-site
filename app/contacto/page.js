import ContactoClient from "@/components/ContactoClient";

export const metadata = {
  title: "Contacto — UDI Posgrado",
  description: "Contactate con nosotros para recibir asesoramiento personalizado. Estamos ubicados en Santa Cruz, Av. Bánzer y 6to. Anillo.",
  openGraph: {
    title: "Contacto — UDI Posgrado",
    description: "¿Tenés dudas? Hablá con un asesor hoy mismo.",
  }
};

export default function ContactoPage() {
  return <ContactoClient />;
}
