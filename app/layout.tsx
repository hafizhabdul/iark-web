import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/providers/TransitionContext";
import { AuthProvider } from "@/components/providers/AuthContext";

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
        <AuthProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
