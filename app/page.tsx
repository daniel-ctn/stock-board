'use client'

import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

import { useMultipleStocks } from '@/hooks/use-stock-data'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockCard } from '@/components/share/stock-card'
import { StockSearch } from '@/components/share/stock-search'

const DEFAULT_SYMBOLS = [
  'AAPL',
  'GOOGL',
  'MSFT',
  'TSLA',
  'AMZN',
  'META',
  'NVDA',
  'NFLX',
]

export default function Dashboard() {
  const [watchedSymbols, setWatchedSymbols] =
    useState<string[]>(DEFAULT_SYMBOLS)

  const { stocks, isLoading } = useMultipleStocks(watchedSymbols)

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchedSymbols.includes(symbol.toUpperCase())) {
      setWatchedSymbols((prev) => [...prev, symbol.toUpperCase()])
    }
  }

  const handleSearchSelect = (symbol: string) => {
    handleAddToWatchlist(symbol)
  }

  // Separate successful stocks from errors
  const successfulStocks = stocks.filter((item) => !('error' in item))
  const failedStocks = stocks.filter((item) => 'error' in item)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time stock market data powered by Finnhub
          </p>
        </div>
        <div className="w-full sm:w-80">
          <StockSearch onSelect={handleSearchSelect} />
        </div>
      </div>

      {/* Error Display */}
      {failedStocks.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load data for:{' '}
            {failedStocks.map((item) => item.symbol).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Market Overview - You can add real market indices here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">
              Real-time data coming soon
            </p>
          </CardContent>
        </Card>
        {/* Add more market indices */}
      </div>

      {/* Loading State */}
      {isLoading && successfulStocks.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading market data...</span>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="watchlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-4">
          {successfulStocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {successfulStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onAddToWatchlist={handleAddToWatchlist}
                  onAddToPortfolio={() =>
                    console.log('Add to portfolio:', stock.symbol)
                  }
                />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No stocks in your watchlist
              </p>
            </div>
          ) : null}
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  )
}
