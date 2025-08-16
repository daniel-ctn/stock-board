export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  previousClose: number
  open: number
  high: number
  low: number
}

export interface WatchlistItem {
  id: string
  symbol: string
  addedAt: Date
}

export interface Portfolio {
  id: string
  symbol: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
}

export interface StockChart {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartDataPoint {
  timestamp: string
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicator {
  sma20?: number
  sma50?: number
  sma200?: number
  rsi?: number
  macd?: number
  bb_upper?: number
  bb_lower?: number
}

export type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y'
export type ChartType = 'line' | 'area' | 'candlestick' | 'volume'

export interface ChartConfig {
  period: ChartPeriod
  type: ChartType
  showVolume: boolean
  showIndicators: boolean
  indicators: string[]
}
