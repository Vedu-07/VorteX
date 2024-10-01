import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../components/providers/theme-provider";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import {Toaster} from "sonner";

const inter = Inter({ subsets: ["latin"] });
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

export const metadata: Metadata = {
  title: "VorteX",
  description: "Your Personalized Workspace",
  icons:{
    icon: [
      {
        media:"(prefers-color-scheme: light)",
        url: "/logo-dark.png",
        href: "/logo-dark.png",
      },
      {
        media:"(prefers-color-scheme: dark)",
        url: "/logo-white.png",
        href: "/logo-white.png",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="icon" href="/jsm-logo.png" sizes="any" />
    </head>
    <body className={inter.className}>
      <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="bottom-center" />
        {children}
      </ThemeProvider>
      </ConvexClientProvider>
    </body>
  </html>
  );
}
