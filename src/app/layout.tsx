import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zain Ul Abadin | Full-Stack MERN Developer & SQA Engineer",
  description: "Professional portfolio of Zain Ul Abadin, a specialist in React, Next.js, Node.js, and Software Quality Assurance (Cypress, API Automation) targeting international career growth.",
  keywords: [
    "Zain Ul Abadin",
    "MERN Stack Developer",
    "SQA Engineer",
    "Automation Testing",
    "Cypress QA",
    "Next.js Developer",
    "University of Okara",
    "Software Tester Pakistan"
  ],
  authors: [{ name: "Zain Ul Abadin" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-[#060814] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
        <div className="glow-overlay" />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
