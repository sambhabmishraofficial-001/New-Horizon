import type { Metadata } from "next";
import "./globals.css";
import { ShellGate } from "@/components/shell/ShellGate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newhorizon.dev";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "New Horizon — The first AI-native Virtual Research Institute",
  description:
    "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
  openGraph: {
    title: "New Horizon — The first AI-native Virtual Research Institute",
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
    title: "New Horizon — The first AI-native Virtual Research Institute",
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
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem('theme', 'light');
                document.documentElement.removeAttribute('data-theme');
                document.documentElement.style.colorScheme = 'light';
              } catch (_) {}
            `,
          }}
        />
        <ShellGate>{children}</ShellGate>
      </body>
    </html>
  );
}
