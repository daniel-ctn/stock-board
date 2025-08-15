import { formatPrice, formatVolume } from '@/lib/chart-utils'

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  chartType: 'line' | 'area' | 'candlestick' | 'volume'
}

export function ChartTooltip({
  active,
  payload,
  label,
  chartType,
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]?.payload
  if (!data) return null

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium mb-2">{label}</p>

      {chartType === 'candlestick' && (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Open:</span>
            <span className="font-medium">{formatPrice(data.open)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">High:</span>
            <span className="font-medium text-green-600">
              {formatPrice(data.high)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Low:</span>
            <span className="font-medium text-red-600">
              {formatPrice(data.low)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Close:</span>
            <span className="font-medium">{formatPrice(data.close)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>
        </div>
      )}

      {chartType === 'volume' && (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{formatPrice(data.close)}</span>
          </div>
        </div>
      )}

      {(chartType === 'line' || chartType === 'area') && (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{formatPrice(data.close)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{formatVolume(data.volume)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
