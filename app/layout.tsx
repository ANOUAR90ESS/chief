import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vetorre - Discover the Best AI Tools",
  description: "Explore thousands of AI tools across 180+ categories. Find the perfect AI solution for your needs.",
  keywords: ["AI tools", "artificial intelligence", "AI directory", "machine learning tools", "AI solutions"],
  authors: [{ name: "Vetorre" }],
  creator: "Vetorre",
  publisher: "Vetorre",
  robots: "index, follow",
  openGraph: {
    title: "Vetorre - Discover the Best AI Tools",
    description: "Explore thousands of AI tools across 180+ categories. Find the perfect AI solution for your needs.",
    url: "https://vetorre.com",
    siteName: "Vetorre",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vetorre - Discover the Best AI Tools",
    description: "Explore thousands of AI tools across 180+ categories.",
    creator: "@vetorre",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
