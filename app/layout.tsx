import type { Metadata } from "next";
import "./globals.css";
import "./hero-tweaks.css";

export const metadata: Metadata = {
  title: "Lyall Property Care LLC | Hudson Valley Tree Specialist",
  description: "Fully insured tree removal, precision pruning, storm response, stump grinding, and land clearing across Woodstock and the Hudson Valley.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
