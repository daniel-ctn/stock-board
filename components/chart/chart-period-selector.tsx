'use client'

import { Button } from '@/components/ui/button'
import { ChartPeriod } from '@/types/stock'

interface ChartPeriodSelectorProps {
  selectedPeriod: ChartPeriod
  onPeriodChange: (period: ChartPeriod) => void
}

const periods: { value: ChartPeriod; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '2Y', label: '2Y' },
  { value: '5Y', label: '5Y' },
]

export function ChartPeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: ChartPeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className="text-xs"
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}
