import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "UDI Posgrado — Universidad Para el Desarrollo y la Innovación",
  description: "Formamos profesionales de excelencia a través de programas de posgrado y educación continua en Santa Cruz, Bolivia. Más de 100 programas activos.",
  keywords: ["posgrado bolivia", "diplomados santa cruz", "educación continua", "udi posgrado", "universidad para el desarrollo y la innovación", "maestrías", "cursos"],
  authors: [{ name: "UDI Posgrado" }],
  openGraph: {
    title: "UDI Posgrado — Educación Continua",
    description: "Impulsá tu carrera con nuestros diplomados y programas de especialización en Bolivia.",
    url: "https://posgrado.udi.edu.bo",
    siteName: "UDI Posgrado",
    images: [
      {
        url: "/logo-black.png", 
        width: 800,
        height: 600,
        alt: "UDI Posgrado Logo",
      },
    ],
    locale: "es_BO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UDI Posgrado — Educación Continua",
    description: "Formamos profesionales de excelencia a través de programas de posgrado y educación continua en Santa Cruz, Bolivia.",
    images: ["/logo-black.png"],
  },
};

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppBtn from "@/components/WhatsAppBtn";

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-poppins text-udi-text bg-white">
        <Nav />
        {children}
        <Footer />
        <WhatsAppBtn />
      </body>
    </html>
  );
}
