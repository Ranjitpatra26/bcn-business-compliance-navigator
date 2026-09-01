import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "BCN - Compliance that helps you shape the future",
  description: "Your key to strategic success through compliance.",
};

import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { BusinessProvider } from "@/components/providers/BusinessProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased bg-muted/20 selection:bg-bcn-red selection:text-white`}>
        <QueryProvider>
          <AuthProvider>
            <BusinessProvider>
              {children}
              <Toaster />
            </BusinessProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
