"use client"

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, TrendingUp, AreaChart, ChartCandlestick, BarChart3 } from 'lucide-react';
import { ChartType } from '@/types/stock';

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
}

const chartTypes: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'line', label: 'Line Chart', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'area', label: 'Area Chart', icon: <AreaChart className="h-4 w-4" /> },
  { value: 'candlestick', label: 'Candlestick', icon: <ChartCandlestick className="h-4 w-4" /> },
  { value: 'volume', label: 'Volume', icon: <BarChart3 className="h-4 w-4" /> },
];

export function ChartTypeSelector({ selectedType, onTypeChange }: ChartTypeSelectorProps) {
  const currentType = chartTypes.find(type => type.value === selectedType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currentType?.icon}
          <span className="ml-2">{currentType?.label}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chartTypes.map((type) => (
          <DropdownMenuItem
            key={type.value}
            onClick={() => onTypeChange(type.value)}
          >
            {type.icon}
            <span className="ml-2">{type.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}