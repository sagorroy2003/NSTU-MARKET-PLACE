import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NSTU Marketplace",
  description: "Frontend scaffold for student marketplace",
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
