import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/providers/TransitionContext";
import { AuthProvider } from "@/components/providers/AuthContext";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IARK - Ikatan Alumni Rumah Kepemimpinan",
  description: "Wadah kolaborasi alumni Rumah Kepemimpinan yang menumbuhkan semangat kepemimpinan sejati dan berdampak nyata untuk Indonesia yang lebih baik.",
  icons: {
    icon: '/logos/iark-logo.png',
    apple: '/logos/iark-logo.png',
  },
  openGraph: {
    title: "IARK - Ikatan Alumni Rumah Kepemimpinan",
    description: "Wadah kolaborasi alumni Rumah Kepemimpinan yang menumbuhkan semangat kepemimpinan sejati dan berdampak",
    url: 'https://ia-rk.com',
    siteName: 'IARK',
    images: [
      {
        url: '/logos/iark-logo.png',
        width: 1200,
        height: 630,
        alt: 'IARK Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IARK - Ikatan Alumni Rumah Kepemimpinan",
    description: "Wadah kolaborasi alumni Rumah Kepemimpinan yang menumbuhkan semangat kepemimpinan sejati dan berdampak",
    images: ['/logos/iark-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
