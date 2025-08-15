'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface SearchResult {
  symbol: string
  description: string
}

interface StockSearchProps {
  onSelect: (symbol: string) => void
}

export function StockSearch({ onSelect }: StockSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        // Mock search - replace with actual API call
        const mockResults: SearchResult[] = [
          { symbol: 'AAPL', description: 'Apple Inc.' },
          { symbol: 'GOOGL', description: 'Alphabet Inc.' },
          { symbol: 'MSFT', description: 'Microsoft Corporation' },
          { symbol: 'TSLA', description: 'Tesla, Inc.' },
        ].filter(
          (stock) =>
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.description.toLowerCase().includes(query.toLowerCase()),
        )

        setResults(mockResults)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchStocks, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Search className="mr-2 h-4 w-4" />
          Search stocks...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput
            placeholder="Search stocks..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandEmpty>
            {loading ? 'Searching...' : 'No stocks found.'}
          </CommandEmpty>
          <CommandGroup>
            {results.map((stock) => (
              <CommandItem
                key={stock.symbol}
                onSelect={() => {
                  onSelect(stock.symbol)
                  setOpen(false)
                  setQuery('')
                }}
              >
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    {stock.description}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
