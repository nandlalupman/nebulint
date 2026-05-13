import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEBULINT | Intelligent Infrastructure",
  description:
    "Enterprise AI infrastructure, robotics platforms, computer vision systems, and real-time operational technology.",
  openGraph: {
    title: "NEBULINT | Intelligent Infrastructure",
    description:
      "Engineering advanced AI, robotics, autonomous systems, and mission-critical monitoring platforms.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
