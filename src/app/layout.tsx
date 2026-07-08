import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xiaosave - RedNote (Xiaohongshu) Video Downloader",
  description: "Download RedNote (Xiaohongshu) videos without watermarks instantly for free. Save high quality MP4 videos and extract MP3 audio directly to your device.",
  keywords: ["RedNote", "Xiaohongshu", "video downloader", "no watermark", "remove watermark", "save RedNote video", "RedNote to MP3", "小红书"],
  openGraph: {
    title: "Xiaosave - Free RedNote Video Downloader",
    description: "Download RedNote videos without watermarks in 480p, HD, or extract MP3 audio instantly.",
    url: "https://xiaosave.xyz",
    siteName: "Xiaosave",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://xiaosave.xyz",
  },
  verification: {
    google: "No6cgBCJIjOJs5N6DUrTNQcf0zoltFTOHZ_5C7QZ4Ic",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
