import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireTrack Pro",
  description: "Smart hiring and applicant tracking platform",
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