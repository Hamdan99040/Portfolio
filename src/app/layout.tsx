import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Muhammad Hamdan | Full-Stack Developer & SQA Engineer",
  description:
    "Professional portfolio of Muhammad Hamdan — MERN Stack Developer, SQA Engineer, and future AI professional. BS Computer Science from University of Okara. IELTS Band 7.5. Open to international roles in Germany, Australia, and beyond.",
  keywords: [
    "Muhammad Hamdan",
    "Hamdan",
    "MERN Stack Developer",
    "SQA Engineer",
    "Software Quality Assurance",
    "Automation Testing",
    "Cypress QA",
    "Next.js Developer",
    "React Developer",
    "University of Okara",
    "Full Stack Developer Pakistan",
    "International Software Engineer",
  ],
  authors: [{ name: "Muhammad Hamdan" }],
  robots: "index, follow",
  openGraph: {
    title: "Muhammad Hamdan | Full-Stack Developer & SQA Engineer",
    description:
      "MERN Stack Developer & SQA Engineer. BS CS, IELTS 7.5. Building scalable web apps and quality-assured software.",
    type: "website",
  },
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
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Theme hydration — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', t);
                  if (t === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300 flex flex-col transition-colors duration-300">
        {/* Far-background ambient glow — very subtle */}
        <div className="glow-overlay" aria-hidden="true" />
        <div className="relative z-10 flex-grow">{children}</div>
      </body>
    </html>
  );
}
