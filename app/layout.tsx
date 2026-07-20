import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sykron CRM | Gestão, Processos e Tecnologia",
  description: "CRM comercial da Sykron para soluções em processos, sistemas e automações",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
