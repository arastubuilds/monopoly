import type { Metadata } from "next";
import { Fraunces, Inter, Fredoka } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Capital City - High Personality Landing Page",
  description: "Own the City. Build Your Legacy. A reimagined classic bursting with life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${fredoka.variable} antialiased selection:bg-monopoly-green/30`}
      >
        {children}
      </body>
    </html>
  );
}
