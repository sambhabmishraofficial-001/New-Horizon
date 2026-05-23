import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ShellGate } from "@/components/shell/ShellGate";

/** Primary UI sans - Geist (x.ai / Vercel design system) */
const geistSans = GeistSans;

/** Mono for labels, code, and UI eyebrows */
const geistMono = GeistMono;

/** Serif reserved for long-form document content inside the workspace */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-source-serif",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newhorizon.dev";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "New Horizon - Building infrastructure for Human-AI co-science",
  description:
    "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
  openGraph: {
    title: "New Horizon - Building infrastructure for Human-AI co-science",
    description:
      "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
    url: siteUrl,
    siteName: "New Horizon",
    images: [{ url: `${siteUrl}/images/scientific-cell-mosaic.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Horizon - Building infrastructure for Human-AI co-science",
    description:
      "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
    images: [`${siteUrl}/images/scientific-cell-mosaic.png`],
  },
  icons: {
    icon: [{ url: `${basePath}/favicon.svg`, type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable}`}
    >
      <body className={`${geistSans.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t !== 'dark' && t !== 'light') t = 'light';
                if (t === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.removeAttribute('data-theme');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
        <ShellGate>{children}</ShellGate>
      </body>
    </html>
  );
}
