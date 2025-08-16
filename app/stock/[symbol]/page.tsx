import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Plus, TrendingUp, TrendingDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockChart } from '@/components/chart/stock-chart'
import { useStockQuote, useCompanyProfile, useCompanyNews } from '@/hooks/use-stock-data'
import { formatPrice, formatVolume } from '@/lib/chart-utils'

export default function StockDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string

  // Use SWR hooks for all data fetching
  const { stock, isLoading: stockLoading, error: stockError } = useStockQuote(symbol)
  const { profile: companyProfile, isLoading: profileLoading } = useCompanyProfile(symbol)
  const { news: companyNews, isLoading: newsLoading } = useCompanyNews(symbol)

  // Calculate fundamental data from real API data
  const fundamentalData = [
    { 
      label: 'Market Cap', 
      value: companyProfile?.marketCapitalization 
        ? `$${(companyProfile.marketCapitalization / 1000).toFixed(1)}B`
        : 'N/A'
    },
    { label: 'Previous Close', value: stock ? formatPrice(stock.previousClose) : 'N/A' },
    { label: 'Open', value: stock ? formatPrice(stock.open) : 'N/A' },
    { label: 'Day Range', value: stock ? `${formatPrice(stock.low)} - ${formatPrice(stock.high)}` : 'N/A' },
    { label: 'Volume', value: stock ? formatVolume(stock.volume || 0) : 'N/A' },
    { label: 'Shares Outstanding', value: companyProfile?.shareOutstanding ? `${(companyProfile.shareOutstanding / 1000000).toFixed(1)}M` : 'N/A' },
  ]

  // Show loading state if any data is still loading
  const isLoading = stockLoading || profileLoading || newsLoading

  // Handle error states
  if (stockError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Stock Data</h3>
              <p className="text-muted-foreground mb-4">
                Unable to fetch data for {symbol.toUpperCase()}. Please check if the symbol is correct and try again.
              </p>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            {isLoading ? (
              <>
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-1" />
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{stock?.name || symbol.toUpperCase()}</h1>
                <p className="text-muted-foreground">{stock?.symbol || symbol.toUpperCase()}</p>
              </>
            )}
          </div>
          {stock && !isLoading && (
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold">{formatPrice(stock.price)}</div>
              <div className={`flex items-center text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {formatPrice(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Add to Watchlist
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add to Portfolio
          </Button>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <StockChart symbol={symbol} />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Key Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fundamentalData.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                ) : companyProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Industry:</span>
                        <p className="font-medium">{companyProfile.finnhubIndustry || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Country:</span>
                        <p className="font-medium">{companyProfile.country || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Exchange:</span>
                        <p className="font-medium">{companyProfile.exchange || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IPO Date:</span>
                        <p className="font-medium">{companyProfile.ipo || 'N/A'}</p>
                      </div>
                    </div>
                    {companyProfile.weburl && (
                      <div>
                        <span className="text-muted-foreground">Website:</span>
                        <a 
                          href={companyProfile.weburl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          {companyProfile.weburl}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Company information not available for {symbol.toUpperCase()}.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : companyNews.length > 0 ? (
                <div className="space-y-4">
                  {companyNews.map((article, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {article.headline}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        {article.summary?.slice(0, 200)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(article.datetime * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent news available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents as needed */}
      </Tabs>
    </div>
  )
}
