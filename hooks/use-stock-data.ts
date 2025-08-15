import useSWR from 'swr'

import { ChartPeriod } from '@/types/stock'
import { getDateRange } from '@/lib/chart-utils'
import { finnhubAPI } from '@/lib/finnhub-api'

export function useStockQuote(symbol: string) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `stock-quote-${symbol}` : null,
    () => finnhubAPI.getStockData(symbol),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
    },
  )

  return {
    stock: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useStockChart(symbol: string, period: ChartPeriod) {
  const { from, to } = getDateRange(period)

  // Convert period to Finnhub resolution
  const getResolution = (period: ChartPeriod): string => {
    switch (period) {
      case '1D':
        return '5' // 5 minutes
      case '1W':
        return '15' // 15 minutes
      case '1M':
        return '60' // 1 hour
      case '3M':
        return 'D' // Daily
      case '6M':
        return 'D' // Daily
      case '1Y':
        return 'D' // Daily
      case '2Y':
        return 'W' // Weekly
      case '5Y':
        return 'M' // Monthly
      default:
        return 'D'
    }
  }

  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `stock-chart-${symbol}-${period}` : null,
    () =>
      finnhubAPI.getChartData(
        symbol,
        getResolution(period),
        Math.floor(from.getTime() / 1000),
        Math.floor(to.getTime() / 1000),
      ),
    {
      refreshInterval: period === '1D' ? 60000 : 300000, // 1min for 1D, 5min for others
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  )

  return {
    chartData: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useStockSearch(query: string) {
  const { data, error, isLoading } = useSWR(
    query && query.length >= 2 ? `stock-search-${query}` : null,
    () => finnhubAPI.searchSymbols(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache search results for 1 minute
    },
  )

  return {
    results: data?.result || [],
    isLoading,
    error,
  }
}

export function useMultipleStocks(symbols: string[]) {
  const { data, error, isLoading, mutate } = useSWR(
    symbols.length > 0 ? `multiple-stocks-${symbols.join(',')}` : null,
    async () => {
      const promises = symbols.map((symbol) =>
        finnhubAPI.getStockData(symbol).catch((error) => ({
          symbol,
          error: error.message,
        })),
      )
      return Promise.all(promises)
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    },
  )

  return {
    stocks: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}
