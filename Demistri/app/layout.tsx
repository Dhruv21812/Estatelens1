import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstateLens AI — The Brutally Honest Brand Auditor",
  description: "Elite AI-powered branding audit for real estate developers. Get trust scores, conversion metrics, and growth strategies in seconds.",
  keywords: ["real estate", "ai audit", "branding", "marketing", "developer", "luxury real estate"],
  openGraph: {
    title: "EstateLens AI — The Brutally Honest Brand Auditor",
    description: "Elite AI-powered branding audit for real estate developers.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EstateLens AI",
    description: "Elite AI-powered branding audit for real estate developers.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
