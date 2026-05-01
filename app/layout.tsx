import type { Metadata } from "next";
import "./globals.css";
import { ShellGate } from "@/components/shell/ShellGate";

export const metadata: Metadata = {
  metadataBase: new URL("https://newhorizon.dev"),
  title: "New Horizon — The first AI-native Virtual Research Institute",
  description:
    "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
  openGraph: {
    title: "New Horizon — The first AI-native Virtual Research Institute",
    description:
      "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
    url: "https://newhorizon.dev",
    siteName: "New Horizon",
    images: [{ url: "/og", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Horizon — The first AI-native Virtual Research Institute",
    description:
      "AI-native Virtual Research Institute. Twins read the literature, propose experiments, run them, audit invariants, and draft the manuscript.",
    images: ["/og"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
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
