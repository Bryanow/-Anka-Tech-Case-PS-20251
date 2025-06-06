// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anka Tech Case - Investimentos",
  description: "Aplicação para gerenciar clientes e ativos financeiros.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* Envolva os children com o Providers */}
          {children}
        </Providers>
      </body>
    </html>
  )
}