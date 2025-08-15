import axios, { AxiosInstance, AxiosResponse } from 'axios'

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

class BaseAPIClient {
  protected client: AxiosInstance
  protected rateLimitDelay: number = 1000 // 1 second between requests

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add API key to all requests
    this.client.interceptors.request.use((config) => {
      config.params = { ...config.params, token: apiKey }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status
          const message = error.response.data?.error || error.message

          if (status === 429) {
            throw new APIError(
              'Rate limit exceeded. Please try again later.',
              status,
              'RATE_LIMIT',
            )
          } else if (status === 401) {
            throw new APIError('Invalid API key', status, 'UNAUTHORIZED')
          } else if (status >= 500) {
            throw new APIError(
              'Server error. Please try again later.',
              status,
              'SERVER_ERROR',
            )
          } else {
            throw new APIError(message, status, 'API_ERROR')
          }
        } else if (error.request) {
          // Network error
          throw new APIError(
            'Network error. Please check your connection.',
            undefined,
            'NETWORK_ERROR',
          )
        } else {
          throw new APIError('Request failed', undefined, 'REQUEST_ERROR')
        }
      },
    )
  }

  protected async makeRequest<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { params })
      return response.data
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError('Unexpected error occurred')
    }
  }
}

export default BaseAPIClient
