import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const monoSans = Mona_Sans({
  variable: "--font-mono-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Prep",
  description: "Prepare for your next AI interview with confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monoSans.className} antialiased pattern`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
