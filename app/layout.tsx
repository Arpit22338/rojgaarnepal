import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import { BackgroundWrapper } from "@/components/ui/background-components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RojgaarNepal",
  description: "Connecting Nepali Youth with Opportunities",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BackgroundWrapper>
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              {children}
            </main>
            <footer className="bg-white/80 border-t py-6 mt-auto backdrop-blur-sm">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>&copy; {new Date().getFullYear()} RojgaarNepal. All rights reserved.</p>
                <p className="text-sm mt-2">Developed by <span className="font-semibold text-blue-600">Arpit Kafle</span></p>
              </div>
            </footer>
          </BackgroundWrapper>
        </Providers>
      </body>
    </html>
  );
}
