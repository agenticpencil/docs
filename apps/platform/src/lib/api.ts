const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.agenticpencil.com'

export interface ApiKeyData {
  id: string
  key_prefix: string
  name: string
  created_at: string
  last_used: string | null
}

export interface UsageStats {
  credits_used: number
  credits_remaining: number
  credits_total: number
  current_plan: string
  usage_this_month: number
  api_calls_today: number
  api_calls_this_month: number
}

export interface UsageLog {
  id: string
  endpoint: string
  credits_consumed: number
  created_at: string
  request_size: number
  response_size: number
  status: string
}

export interface BillingInfo {
  current_plan: string
  plan_price: number
  billing_cycle: string
  next_billing_date: string
  payment_method: string
}

export interface ApiResult {
  id: string
  endpoint: string
  result_type: string
  created_at: string
  result_data: any
  credits_used: number
}

export class ApiClient {
  private apiKey: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('api_key')
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('api_key', apiKey)
    }
  }

  removeApiKey() {
    this.apiKey = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('api_key')
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUsageStats(): Promise<UsageStats> {
    return this.makeRequest<UsageStats>('/v1/usage')
  }

  async getUsageLogs(limit = 50): Promise<UsageLog[]> {
    return this.makeRequest<UsageLog[]>(`/v1/usage/logs?limit=${limit}`)
  }

  async getApiKeys(): Promise<ApiKeyData[]> {
    return this.makeRequest<ApiKeyData[]>('/v1/keys')
  }

  async createApiKey(name: string): Promise<{ key: string; key_data: ApiKeyData }> {
    return this.makeRequest<{ key: string; key_data: ApiKeyData }>('/v1/keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  async revokeApiKey(keyId: string): Promise<void> {
    await this.makeRequest(`/v1/keys/${keyId}`, {
      method: 'DELETE',
    })
  }

  async getBillingInfo(): Promise<BillingInfo> {
    return this.makeRequest<BillingInfo>('/v1/billing')
  }

  async createCheckoutSession(planId: string): Promise<{ checkout_url: string }> {
    return this.makeRequest<{ checkout_url: string }>('/v1/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId }),
    })
  }

  async getResults(limit = 50): Promise<ApiResult[]> {
    return this.makeRequest<ApiResult[]>(`/v1/results?limit=${limit}`)
  }
}

export const apiClient = new ApiClient()