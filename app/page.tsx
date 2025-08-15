'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockCard } from '@/components/share/stock-card'
import { StockSearch } from '@/components/share/stock-search'
import { Stock } from '@/types/stock'

// Mock data - replace with real API calls
const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 2.34,
    changePercent: 1.3,
    volume: 45234567,
    previousClose: 180.18,
    open: 181.25,
    high: 184.12,
    low: 180.89,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.85,
    volume: 23456789,
    previousClose: 143.79,
    open: 143.25,
    high: 144.12,
    low: 141.89,
  },
  // Add more mock stocks...
]

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks)
  const [selectedStock, setSelectedStock] = useState<string>('')

  const handleAddToWatchlist = (symbol: string) => {
    console.log('Adding to watchlist:', symbol)
    // Implement watchlist logic
  }

  const handleAddToPortfolio = (symbol: string) => {
    console.log('Adding to portfolio:', symbol)
    // Implement portfolio logic
  }

  const handleSearchSelect = (symbol: string) => {
    setSelectedStock(symbol)
    // Fetch and display selected stock
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time stock market data and analytics
          </p>
        </div>
        <div className="w-full sm:w-80">
          <StockSearch onSelect={handleSearchSelect} />
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,567.89</div>
            <p className="text-xs text-green-600">+1.23% (+12.34)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NASDAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,234.56</div>
            <p className="text-xs text-red-600">-0.45% (-23.45)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DOW JONES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34,567.89</div>
            <p className="text-xs text-green-600">+0.78% (+23.45)</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="trending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
          <TabsTrigger value="volume">Most Active</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onAddToWatchlist={handleAddToWatchlist}
                onAddToPortfolio={handleAddToPortfolio}
              />
            ))}
          </div>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  )
}
