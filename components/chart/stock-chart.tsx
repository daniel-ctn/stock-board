'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useStockChart, useStockQuote } from '@/hooks/use-stock-data'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartTypeSelector } from '@/components/chart/chart-type.selector'
import { ChartTooltip } from '@/components/chart/chart.tooltip'
import { ChartPeriod, ChartType } from '@/types/stock'
import { formatPrice } from '@/lib/chart-utils'

import { ChartPeriodSelector } from './chart-period-selector'

interface StockChartProps {
  symbol: string
}

export function StockChart({ symbol }: StockChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>('1M')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [showVolume, setShowVolume] = useState(false)

  const {
    stock,
    isLoading: stockLoading,
    error: stockError,
    refresh: refreshStock,
  } = useStockQuote(symbol)
  const {
    chartData,
    isLoading: chartLoading,
    error: chartError,
    refresh: refreshChart,
  } = useStockChart(symbol, period)

  const isLoading = stockLoading || chartLoading
  const error = stockError || chartError

  const handleRefresh = () => {
    refreshStock()
    refreshChart()
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<ChartTooltip chartType="line" />} />
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: 'hsl(var(--primary))' }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<ChartTooltip chartType="area" />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        )

      case 'candlestick':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<ChartTooltip chartType="candlestick" />} />
            <Bar
              dataKey="high"
              fill="transparent"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
            />
            <Bar dataKey="close" fill="#22c55e" />
          </BarChart>
        )

      case 'volume':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<ChartTooltip chartType="volume" />} />
            <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.7} />
          </BarChart>
        )

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<ChartTooltip chartType="line" />} />
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: 'hsl(var(--primary))' }}
            />
          </LineChart>
        )
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load stock data'}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading && !stock) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stock) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            No Data Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load stock data for {symbol}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-lg font-semibold">
            {stock.symbol} - {formatPrice(stock.price)}
          </CardTitle>
          <Badge variant={stock.change >= 0 ? 'default' : 'destructive'}>
            {stock.change >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {stock.change >= 0 ? '+' : ''}
            {stock.change.toFixed(2)}({stock.changePercent.toFixed(2)}%)
          </Badge>
          {isLoading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                Updating...
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <ChartPeriodSelector
            selectedPeriod={period}
            onPeriodChange={setPeriod}
          />
          <div className="flex items-center space-x-2">
            <ChartTypeSelector
              selectedType={chartType}
              onTypeChange={setChartType}
            />
            <Button
              variant={showVolume ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
            >
              Volume
            </Button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {showVolume && chartType !== 'volume' && (
          <div className="h-20 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="formattedDate" hide />
                <YAxis hide />
                <Bar dataKey="volume" fill="hsl(var(--muted))" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
