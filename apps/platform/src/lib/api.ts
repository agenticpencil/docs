import { supabase } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.agenticpencil.com'

// ── Types ──────────────────────────────────────────────

export interface ApiKeyRow {
  id: string
  user_id: string
  key_prefix: string
  is_active: boolean
  created_at: string
}

export interface UsageData {
  credits_used: number
  credits_limit: number
  plan: string
}

export interface UsageLogRow {
  id: string
  api_key_id: string
  user_id: string
  endpoint: string
  credits_used: number
  status_code: number
  created_at: string
}

export interface ProfileRow {
  id: string
  email: string
  plan_id: string
  credits_used: number
  credits_reset_at: string
  stripe_customer_id: string | null
}

// ── API helpers (real endpoints) ──────────────────────

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }
  return res.json()
}

// ── Real API calls ───────────────────────────────────

export async function getUsage(): Promise<UsageData> {
  const res = await apiFetch<{ success: boolean; data: UsageData }>('/v1/usage')
  return res.data
}

export async function createCheckoutSession(planId: string): Promise<{ checkout_url: string }> {
  // Call our Next.js API route which has the Stripe secret key
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || 'Checkout failed')
  }
  const data = await res.json()
  return { checkout_url: data.checkout_url }
}

export async function registerApiKey(email: string): Promise<{ api_key: string }> {
  try {
    const res = await apiFetch<{ success: boolean; data: { api_key: string } }>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return { api_key: res.data.api_key }
  } catch (err: any) {
    // If account already exists, create a new key directly via Supabase
    if (err.message?.includes('ALREADY_EXISTS')) {
      return createNewApiKey()
    }
    throw err
  }
}

async function createNewApiKey(): Promise<{ api_key: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!profile) throw new Error('Profile not found')

  // Generate new API key
  const key = `ap_${crypto.randomUUID().replace(/-/g, '')}`
  const keyPrefix = key.substring(0, 12) + '...'

  // Hash the key for storage
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  const { error } = await supabase
    .from('api_keys')
    .insert({
      user_id: profile.id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      is_active: true,
    })

  if (error) throw new Error(`Failed to create key: ${error.message}`)

  return { api_key: key }
}

// ── Supabase direct queries (RLS-protected) ──────────

export async function getProfile(): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()
  if (error) {
    console.error('getProfile error:', error)
    return null
  }
  return data
}

export async function getApiKeys(): Promise<ApiKeyRow[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getApiKeys error:', error)
    return []
  }
  return data ?? []
}

export async function deactivateApiKey(keyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
  if (error) {
    console.error('deactivateApiKey error:', error)
    return false
  }
  return true
}

export async function getUsageLogs(limit = 50): Promise<UsageLogRow[]> {
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getUsageLogs error:', error)
    return []
  }
  return data ?? []
}
