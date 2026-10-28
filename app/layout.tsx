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
  title: "Kaizen | Ingeniería de alimentos, calidad y regulatorios",
  description:
    "Ingeniería de alimentos, calidad, inocuidad y asuntos regulatorios. Acompañamos a su empresa desde el producto y el proceso hasta su habilitación, registro y comercialización.",
  keywords: [
    "Kaizen",
    "ingeniería de alimentos",
    "inocuidad alimentaria",
    "asuntos regulatorios",
    "rotulado",
    "RUNAEV",
    "Montevideo",
    "Uruguay",
  ],
  openGraph: {
    title: "Kaizen | Ingeniería de alimentos, calidad y regulatorios",
    description:
      "Del producto al mercado, con criterio técnico. Ingeniería, calidad, inocuidad y regulatorios para la industria alimentaria.",
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
