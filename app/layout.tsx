import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import MobileFooter from "../components/MobileFooter";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";
import ParticlesBackground from "../components/ParticlesBackground";
import RojgaarAIPopup from "../components/RojgaarAIPopup";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rojgaarnepal.com"),
  title: {
    default: "Rojgaar Nepal - #1 Job Portal & Freelancing Site in Nepal | Find Jobs, Hire Talent",
    template: "%s | Rojgaar Nepal - Jobs in Nepal"
  },
  description: "Rojgaar Nepal is Nepal's leading job portal and freelancing platform. Find jobs in Nepal, hire skilled freelancers, learn Python, CV building courses, and use AI career tools. 100% free job posting for employers.",
  keywords: [
    "job in nepal",
    "jobs in nepal",
    "nepal jobs",
    "freelancing in nepal",
    "freelancing site in nepal",
    "freelance jobs nepal",
    "hire freelancers nepal",
    "rojgar nepal",
    "rojgaarnepal",
    "python course nepal",
    "free python course",
    "cv building course",
    "resume builder nepal",
    "job portal nepal",
    "online jobs nepal",
    "remote jobs nepal",
    "kathmandu jobs",
    "IT jobs nepal",
    "software developer jobs nepal",
    "career in nepal",
    "hire experts nepal",
    "talent hiring nepal"
  ],
  authors: [{ name: "Rojgaar Nepal Team" }],
  creator: "Rojgaar Nepal",
  publisher: "RojgaarNepal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rojgaarnepal.com",
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://rojgaarnepal.com",
    siteName: "Rojgaar Nepal",
    title: "Rojgaar Nepal - Find Jobs, Hire Talent, Learn Skills",
    description: "Nepal's #1 platform for jobs, freelancing, and professional skill courses. Free job posting, AI resume builder, and verified talent pool.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rojgaar Nepal - Jobs and Freelancing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rojgaar Nepal - Jobs, Freelancing & Courses in Nepal",
    description: "Find your dream job or hire top talent in Nepal. Free courses, AI tools, and verified opportunities.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code", // Add your Google Search Console verification
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  category: "Jobs & Careers",
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rojgaarnepal.com/#website",
      "url": "https://rojgaarnepal.com",
      "name": "Rojgaar Nepal",
      "description": "Nepal's #1 Job Portal and Freelancing Platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://rojgaarnepal.com/jobs?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://rojgaarnepal.com/#organization",
      "name": "Rojgaar Nepal",
      "url": "https://rojgaarnepal.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rojgaarnepal.com/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@rojgaarnepal.com",
        "availableLanguage": ["English", "Nepali"]
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://rojgaarnepal.com/#webpage",
      "url": "https://rojgaarnepal.com",
      "name": "Rojgaar Nepal - Find Jobs, Hire Talent, Learn Skills",
      "isPartOf": { "@id": "https://rojgaarnepal.com/#website" },
      "about": { "@id": "https://rojgaarnepal.com/#organization" },
      "description": "Find jobs in Nepal, hire freelancers, and learn professional skills with free courses."
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <ParticlesBackground />
          <CursorGlow />
          <div className="min-h-screen flex flex-col bg-background relative z-20">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 pt-20 pb-24 md:pb-8">
              {children}
            </main>

            {/* Static Footer - Desktop only */}
            <Footer />

            {/* Mobile Footer Navigation */}
            <MobileFooter />

            {/* RojgaarAI Floating Chat - Desktop */}
            <RojgaarAIPopup />
          </div>
        </Providers>
      </body>
    </html>
  );
}

