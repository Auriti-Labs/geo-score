import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { validateEnv } from "@/lib/env";
import "./globals.css";

validateEnv();

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geoscore.dev";

export const metadata: Metadata = {
  title: {
    default: "GEO Score — Misura la visibilità AI del tuo sito",
    template: "%s | GEO Score",
  },
  description:
    "Scopri quanto il tuo sito è visibile per ChatGPT, Perplexity, Claude e Gemini. Analisi gratuita con punteggio 0-100 e raccomandazioni.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "GEO Score",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD WebApplication — contenuto statico, sicuro per rendering diretto
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GEO Score",
  url: SITE_URL,
  description:
    "Misura la visibilità AI del tuo sito web. Punteggio 0-100 su 5 categorie con raccomandazioni actionable.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  author: {
    "@type": "Organization",
    name: "Auriti Labs",
    url: "https://github.com/Auriti-Labs",
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://github.com/Auriti-Labs",
    ],
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
