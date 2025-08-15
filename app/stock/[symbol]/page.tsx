'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StockChart } from '@/components/chart/stock-chart'
import { ChartDataPoint, Stock } from '@/types/stock'

// Mock stock data
const mockStock: Stock = {
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
}

export default function StockDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [stock, setStock] = useState<Stock>(mockStock)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchStockData = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStock({ ...mockStock, symbol: symbol.toUpperCase() })
        setChartData([]) // Will use mock data in StockChart component
      } catch (error) {
        console.error('Error fetching stock data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [symbol])

  const fundamentalData = [
    { label: 'Market Cap', value: '$2.89T' },
    { label: 'P/E Ratio', value: '28.45' },
    { label: '52W High', value: '$199.62' },
    { label: '52W Low', value: '$124.17' },
    { label: 'Dividend Yield', value: '0.52%' },
    { label: 'Beta', value: '1.24' },
  ]

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
            <h1 className="text-2xl font-bold">{stock.name}</h1>
            <p className="text-muted-foreground">{stock.symbol}</p>
          </div>
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
          <StockChart stock={stock} data={chartData} loading={loading} />
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
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Apple Inc. designs, manufactures, and markets smartphones,
                personal computers, tablets, wearables, and accessories
                worldwide. The company serves consumers, and small and mid-sized
                businesses; and the education, enterprise, and government
                markets.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents as needed */}
      </Tabs>
    </div>
  )
}
