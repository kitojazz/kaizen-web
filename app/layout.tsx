import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaizen.com.uy"),
  title: "Kaizen | Ingeniería de alimentos, calidad y gestión técnica",
  description:
    "Ingeniería de alimentos, calidad, inocuidad, dirección técnica, registros y habilitaciones. Acompañamos a su empresa desde el producto y el proceso hasta su llegada al mercado.",
  keywords: [
    "Kaizen",
    "ingeniería de alimentos",
    "inocuidad alimentaria",
    "dirección técnica",
    "registro de productos",
    "habilitación de locales",
    "rotulado",
    "RUNAEV",
    "LATU",
    "MGAP",
    "Montevideo",
    "Uruguay",
  ],
  openGraph: {
    title: "Kaizen | Ingeniería de alimentos, calidad y gestión técnica",
    description:
      "Del producto al mercado, con criterio técnico. Ingeniería, calidad, inocuidad, registros y habilitaciones para la industria alimentaria.",
    locale: "es_UY",
    type: "website",
  },
  icons: {
    icon: "/images/kaizen-symbol.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f8fd",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
