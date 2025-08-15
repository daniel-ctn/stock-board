import { format, parseISO, subDays, subMonths, subYears } from 'date-fns'

import { ChartDataPoint, ChartPeriod } from '@/types/stock'

export const formatChartDate = (
  dateStr: string,
  period: ChartPeriod,
): string => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr

  switch (period) {
    case '1D':
      return format(date, 'HH:mm')
    case '1W':
    case '1M':
      return format(date, 'MMM dd')
    case '3M':
    case '6M':
      return format(date, 'MMM dd')
    case '1Y':
    case '2Y':
    case '5Y':
      return format(date, 'MMM yyyy')
    default:
      return format(date, 'MMM dd')
  }
}

export const getDateRange = (period: ChartPeriod): { from: Date; to: Date } => {
  const to = new Date()
  let from: Date

  switch (period) {
    case '1D':
      from = subDays(to, 1)
      break
    case '1W':
      from = subDays(to, 7)
      break
    case '1M':
      from = subMonths(to, 1)
      break
    case '3M':
      from = subMonths(to, 3)
      break
    case '6M':
      from = subMonths(to, 6)
      break
    case '1Y':
      from = subYears(to, 1)
      break
    case '2Y':
      from = subYears(to, 2)
      break
    case '5Y':
      from = subYears(to, 5)
      break
    default:
      from = subMonths(to, 1)
  }

  return { from, to }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  return volume.toString()
}
