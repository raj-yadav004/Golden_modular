import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Golden Modular | Luxury Interiors",
  description: "Premium modular kitchens, wardrobes and complete interior solutions designed with precision and elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} font-sans antialiased bg-warm-white text-charcoal`}>
        {children}
      </body>
    </html>
  );
}
