import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KEDAI - Bina Kedai Online Tanpa Kod",
  description: "Platform e-commerce #1 di Malaysia. Cipta kedai online profesional dalam masa 5 minit. Terima pesanan melalui WhatsApp dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  );
}
