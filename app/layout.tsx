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
  title: "PeopleMS",
  description:
    "PeopleMS – HRMS & Payroll Software for Growing Businesses in India",
  authors: [{ name: "ThirdEye" }],
  icons: {
    icon: "/pmsFavicon.png",
  },

  // 2. Open Graph (Facebook, LinkedIn, WhatsApp, Teams)
  openGraph: {
    title: "PeopleMS – HRMS & Payroll Software for Growing Businesses in India",
    description:
      "PeopleMS is a modern HRMS and payroll software designed for growing businesses. Manage attendance, payroll, compliance, performance & employee data in one powerful people management system.",
    url: "https://smartfactory.thirdeyegfx.com", // Your actual domain
    siteName: "PeopleMS",
    images: [
      {
        url: "/pmsOgImagePreview.webp",
        width: 1200,
        height: 630,
        alt: "PeopleMS Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 3. Twitter Card (Twitter/X)
  twitter: {
    card: "summary_large_image",
    site: "@ThirdEye",
    title: "PeopleMS – HRMS & Payroll Software for Growing Businesses in India",
    description:
      "PeopleMS is a modern HRMS and payroll software designed for growing businesses.",
    images: ["/pmsOgImagePreview.webp"],
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
