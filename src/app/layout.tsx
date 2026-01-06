import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProviders from "@/shared/ClientProviders";

// custom local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// global metadata for the site
export const metadata: Metadata = {
  title: {
    default: "Technext Technology",
    template: "%s | Technext Technology",
  },
  description: "Technext Technology",
  metadataBase: new URL("https://technext.com"),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Optional extra meta tags */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
