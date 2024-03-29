import type, { Metadata } from "next";
import { headers } from "next/headers";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Anuphan as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"

import { cn } from "../lib/utils"

import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Food Review",
  description: "this is food review site",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  const absolutePath = fullUrl;
  return (
    <html lang="en" suppressHydrationWarning>
      <head >
        <link
          rel="canonical"
          href={absolutePath}
          key="canonical"
        />
      </head>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="container mx-auto min-h-screen-58">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
