import './global.css'; 
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "../components/ui/theme-provider"; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner"; // Adicione o Toaster se não tiver

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Define o tema padrão como 'dark'
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex items-center justify-between p-4 border-b">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/clients" passHref>
                    <Button variant="ghost">Clientes</Button>
                  </Link>
                </li>
                <li>
                  <Link href="/assets" passHref>
                    <Button variant="ghost">Ativos Disponíveis</Button>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Outros elementos do cabeçalho, se houver */}
          </header>
          <main className="p-4">
            {children}
          </main>
          <Toaster /> {/* Inclua o Toaster aqui se você usa sonner para notificações */}
        </ThemeProvider>
      </body>
    </html>
  );
}