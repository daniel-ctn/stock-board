import BaseAPIClient, { APIError } from './api-client';
import { Stock, ChartDataPoint } from '@/types/stock';

interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface FinnhubProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface FinnhubCandle {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volume
}

interface FinnhubSearchResult {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
}

class FinnhubAPI extends BaseAPIClient {
  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error('Finnhub API key is required');
    }
    super('https://finnhub.io/api/v1', apiKey);
  }

  async getQuote(symbol: string): Promise<FinnhubQuote> {
    return this.makeRequest<FinnhubQuote>('/quote', { symbol: symbol.toUpperCase() });
  }

  async getProfile(symbol: string): Promise<FinnhubProfile> {
    return this.makeRequest<FinnhubProfile>('/stock/profile2', { symbol: symbol.toUpperCase() });
  }

  async getCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<FinnhubCandle> {
    return this.makeRequest<FinnhubCandle>('/stock/candle', {
      symbol: symbol.toUpperCase(),
      resolution,
      from,
      to,
    });
  }

  async searchSymbols(query: string): Promise<FinnhubSearchResult> {
    return this.makeRequest<FinnhubSearchResult>('/search', { q: query.toUpperCase() });
  }

  async getMarketNews(category: string = 'general'): Promise<any[]> {
    return this.makeRequest<any[]>('/news', { category });
  }

  async getCompanyNews(symbol: string, from: string, to: string): Promise<any[]> {
    return this.makeRequest<any[]>('/company-news', {
      symbol: symbol.toUpperCase(),
      from,
      to,
    });
  }

  // Transform Finnhub data to our Stock interface
  async getStockData(symbol: string): Promise<Stock> {
    try {
      const [quote, profile] = await Promise.all([
        this.getQuote(symbol),
        this.getProfile(symbol).catch(() => null), // Profile might not exist for all symbols
      ]);

      return {
        symbol: symbol.toUpperCase(),
        name: profile?.name || symbol.toUpperCase(),
        price: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        volume: 0, // Finnhub doesn't provide volume in quote
        marketCap: profile?.marketCapitalization,
        previousClose: quote.pc,
        open: quote.o,
        high: quote.h,
        low: quote.l,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to fetch data for ${symbol}`);
    }
  }

  // Transform Finnhub candle data to our ChartDataPoint interface
  async getChartData(symbol: string, resolution: string, from: number, to: number): Promise<ChartDataPoint[]> {
    try {
      const candleData = await this.getCandles(symbol, resolution, from, to);

      if (candleData.s !== 'ok' || !candleData.t || candleData.t.length === 0) {
        throw new APIError(`No data available for ${symbol}`);
      }

      return candleData.t.map((timestamp, index) => ({
        timestamp: new Date(timestamp * 1000).toISOString(),
        date: new Date(timestamp * 1000),
        open: candleData.o[index],
        high: candleData.h[index],
        low: candleData.l[index],
        close: candleData.c[index],
        volume: candleData.v[index],
      }));
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to fetch chart data for ${symbol}`);
    }
  }
}

export const finnhubAPI = new FinnhubAPI();