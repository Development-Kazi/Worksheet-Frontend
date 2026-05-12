import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layouts/AppShell";
import Footer from "@/components/layouts/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dynoba Worksheets",
    template: "%s | Dynoba Worksheets",
  },
  description:
    "Printable worksheets for kids across categories and topics with easy downloads and structured learning content.",
  openGraph: {
    type: "website",
    siteName: "Dynoba Worksheets",
    title: "Dynoba Worksheets",
    description:
      "Printable worksheets for kids across categories and topics with easy downloads and structured learning content.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dynoba Worksheets",
    description:
      "Printable worksheets for kids across categories and topics with easy downloads and structured learning content.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppShell>{children}</AppShell>
        <Footer />
      </body>
    </html>
  );
}
