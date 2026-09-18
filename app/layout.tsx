import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { DatadogAppRouter } from "@datadog/browser-rum-nextjs";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import MobileFooter from "@/components/MobileFooter";
import Footer from "@/components/Footer";
import RojgaarAIPopup from "@/components/RojgaarAIPopup";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const siteUrl = "https://www.rojgaarnepal.com";
const description =
  "Find jobs in Nepal, discover skilled local talent, and learn practical career skills on RojgaarNepal.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jobs in Nepal & Local Talent | RojgaarNepal",
    template: "%s | RojgaarNepal",
  },
  description,
  applicationName: "RojgaarNepal",
  authors: [{ name: "RojgaarNepal" }],
  creator: "RojgaarNepal",
  publisher: "RojgaarNepal",
  category: "Jobs and careers",
  keywords: [
    "jobs in Nepal",
    "Nepal jobs",
    "job portal Nepal",
    "Kathmandu jobs",
    "remote jobs Nepal",
    "hire talent Nepal",
    "freelance jobs Nepal",
    "career courses Nepal",
    "Rojgaar Nepal",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: siteUrl,
    siteName: "RojgaarNepal",
    title: "Jobs in Nepal & Local Talent | RojgaarNepal",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RojgaarNepal job and talent platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs in Nepal & Local Talent | RojgaarNepal",
    description,
    images: ["/og-image.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1721" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "RojgaarNepal",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: "contact@arpitkafle.com.np",
      areaServed: { "@type": "Country", name: "Nepal" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "RojgaarNepal",
      description,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-NP",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/jobs?search={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NP" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${bricolage.variable} font-sans antialiased`}>
        <a href="#main-content" className="sr-only z-[200] rounded-lg bg-background px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to main content
        </a>
        <DatadogAppRouter />
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main id="main-content" className="min-h-[70vh] scroll-mt-20 pt-16">{children}</main>
            <Footer />
            <MobileFooter />
            <RojgaarAIPopup />
          </div>
        </Providers>
      </body>
    </html>
  );
}
