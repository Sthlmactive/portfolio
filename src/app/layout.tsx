import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import FloatingIsland from "@/components/FloatingIsland";
import { Analytics } from "@vercel/analytics/next";

// Runs before first paint: skip the loader (and reveal the hero immediately)
// when it has already played this session, or when reduced motion is preferred.
// Prevents any flash of the loader on those loads.
const noFlashScript = `(function(){try{var skip=sessionStorage.getItem('oskar_loader')||window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(skip){var d=document.documentElement;d.classList.add('hero-revealed','loader-done');}}catch(e){}})();`;

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oskar Tang — Portfolio",
  description: "Personal portfolio of Oskar Tang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <noscript>
          <style>{`.loader{display:none!important}.letter,.fade-rise{animation-play-state:running!important}`}</style>
        </noscript>
        <Loader />
        <SmoothScroll />
        <Header />
        {children}
        <FloatingIsland />
        <Analytics />
      </body>
    </html>
  );
}
