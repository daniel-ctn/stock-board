class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 60, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }

    const keyRequests = this.requests.get(key)!

    // Remove old requests outside the window
    const validRequests = keyRequests.filter((time) => time > windowStart)
    this.requests.set(key, validRequests)

    return validRequests.length < this.maxRequests
  }

  recordRequest(key: string): void {
    const now = Date.now()
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }
    this.requests.get(key)!.push(now)
  }
}

export const rateLimiter = new RateLimiter(50, 60000) // 50 requests per minute