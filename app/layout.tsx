import './globals.css'

import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Navbar } from '@/components/layout/navbar'
import { ThemeProvider } from '@/components/layout/theme-privider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stock Board - Real-time Market Data',
  description: 'Track stocks, manage portfolios, and analyze market data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
