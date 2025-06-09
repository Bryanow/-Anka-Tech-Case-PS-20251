// frontend/src/app/layout.tsx
import '@/styles/globals.css';
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from './providers';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AnkaTech Case",
  description: "Client and Financial Asset Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex items-center justify-between p-4 border-b">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/clients" passHref>
                    <Button variant="ghost">Clients</Button>
                  </Link>
                </li>
                <li>
                  <Link href="/assets" passHref>
                    <Button variant="ghost">Assets</Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="p-4">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}