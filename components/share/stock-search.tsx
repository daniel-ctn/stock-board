'use client'

import { useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'

import { useStockSearch } from '@/hooks/use-stock-data'
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

interface StockSearchProps {
  onSelect: (symbol: string) => void
}

export function StockSearch({ onSelect }: StockSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)

  const { results, isLoading, error } = useStockSearch(debouncedQuery)

  const handleSelect = (symbol: string) => {
    onSelect(symbol)
    setOpen(false)
    setQuery('')
  }

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
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : error ? (
              <div className="py-6 text-center text-sm text-red-500">
                Search failed. Please try again.
              </div>
            ) : query.length < 2 ? (
              <div className="py-6 text-center text-sm">
                Type at least 2 characters to search
              </div>
            ) : (
              <div className="py-6 text-center text-sm">No stocks found</div>
            )}
          </CommandEmpty>
          <CommandGroup>
            {results.map((stock) => (
              <CommandItem
                key={stock.symbol}
                onSelect={() => handleSelect(stock.symbol)}
                className="cursor-pointer"
              >
                <div>
                  <p className="font-medium">{stock.displaySymbol}</p>
                  <p className="text-sm text-muted-foreground truncate">
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
