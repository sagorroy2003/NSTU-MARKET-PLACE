import type { Metadata } from "next";

import { Navbar } from "../components/navbar";
import { AuthProvider } from "../context/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSTU Marketplace",
  description: "Student marketplace MVP frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
