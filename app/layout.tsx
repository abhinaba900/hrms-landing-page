import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { isMobile, isTablet } from "react-device-detect";
import { headers } from "next/headers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // 1. Basic Metadata
  title:
    "Smart Inventory Management Software for Manufacturers | Third Eye Creative",
  description:
    "Improve manufacturing efficiency with Third Eye Creative’s inventory software. Real-time tracking, analytics, alerts, and seamless workflows for faster production decisions.",

  // 2. Open Graph (Facebook, LinkedIn, WhatsApp, Teams)
  openGraph: {
    title: "Smart Inventory Management Software for Manufacturers",
    description:
      "Improve manufacturing efficiency with Third Eye Creative’s inventory software.",
    url: "https://smartfactory.thirdeyegfx.com", // Your actual domain
    siteName: "Third Eye Creative",
    images: [
      {
        url: "/assets/Website.webp", // Path to your image in public folder
        width: 1200,
        height: 630,
        alt: "Third Eye Creative Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 3. Twitter Card (Twitter/X)
  twitter: {
    card: "summary_large_image",
    title: "Smart Inventory Management Software",
    description: "Improve manufacturing efficiency with Third Eye Creative.",
    images: ["/assets/Website.webp"], // Same image path
  },

  // 4. Base URL (Required for relative image paths to work in production)
  metadataBase: new URL("https://smartfactory.thirdeyegfx.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const deviceClass = isTablet
    ? "is-tablet"
    : isMobile
    ? "is-mobile"
    : "is-desktop";
  console.log(deviceClass);

  return (
    <html lang="en">
      {/* add the mobile viewport */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light only" />
      </head>
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${deviceClass}`}
      >
        {children}
      </body>
    </html>
  );
}
