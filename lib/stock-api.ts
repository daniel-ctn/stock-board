const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
const BASE_URL = 'https://finnhub.io/api/v1'

export class StockAPI {
  private static async fetchData(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}&token=${API_KEY}`)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return response.json()
  }

  static async getQuote(symbol: string) {
    return this.fetchData(`/quote?symbol=${symbol}`)
  }

  static async getProfile(symbol: string) {
    return this.fetchData(`/stock/profile2?symbol=${symbol}`)
  }

  static async searchSymbols(query: string) {
    return this.fetchData(`/search?q=${query}`)
  }

  static async getCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number,
  ) {
    return this.fetchData(
      `/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
    )
  }

  static async getMarketNews(category = 'general') {
    return this.fetchData(`/news?category=${category}`)
  }
}
