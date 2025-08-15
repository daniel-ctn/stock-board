'use client'

import Link from 'next/link'
import { BarChart3, Briefcase, Heart, Search, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span className="font-bold text-xl">StockBoard</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-1 hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Briefcase className="h-4 w-4" />
            <span>Portfolio</span>
          </Link>
          <Link
            href="/watchlist"
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span>Watchlist</span>
          </Link>
          <Link
            href="/screener"
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Search className="h-4 w-4" />
            <span>Screener</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
