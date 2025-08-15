export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    previousClose: number;
    open: number;
    high: number;
    low: number;
}

export interface WatchlistItem {
    id: string;
    symbol: string;
    addedAt: Date;
}

export interface Portfolio {
    id: string;
    symbol: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercent: number;
}

export interface StockChart {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}