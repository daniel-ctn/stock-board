'use client'

import Link from 'next/link'
import { Heart, Plus, TrendingDown, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Stock } from '@/types/stock'

interface StockCardProps {
  stock: Stock
  onAddToWatchlist?: (symbol: string) => void
  onAddToPortfolio?: (symbol: string) => void
}

export function StockCard({
  stock,
  onAddToWatchlist,
  onAddToPortfolio,
}: StockCardProps) {
  const isPositive = stock.change >= 0

  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <h3 className="font-semibold text-lg">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {stock.name}
            </p>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToWatchlist?.(stock.symbol)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToPortfolio?.(stock.symbol)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
              <Badge
                variant={isPositive ? 'default' : 'destructive'}
                className="mt-1"
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {isPositive ? '+' : ''}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Vol: {stock.volume.toLocaleString()}</p>
              <p>Prev: ${stock.previousClose.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
