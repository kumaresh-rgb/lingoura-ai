import type { Metadata } from "next";
import { Manrope, Lexend, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Lingoura AI — AI-Powered English Fluency Platform",
  description: "A modern AI-powered English fluency platform focused on speaking, listening, reading, and writing.",
  icons: {
    icon: [
      { url: "/logo-icon.png?v=3", type: "image/png" },
      { url: "/logo-icon.png?v=3", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/logo-icon.png?v=3",
    apple: "/logo-icon.png?v=3",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${lexend.variable} ${baskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
