import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevStream - Developer Command Center",
  description: "All-in-one personalized dashboard for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
