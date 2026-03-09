const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_KEY = import.meta.env.VITE_API_KEY || ''

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY
  }
  return headers
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `HTTP ${res.status}`)
  }
  const json = await res.json()
  return json as T
}

// Health
export async function getHealth(): Promise<{ status: string; database?: string }> {
  return fetchApi('/health')
}

// Providers
export async function getProviders(params?: {
  limit?: number
  offset?: number
}): Promise<{ items: import('@/types/api').Provider[]; total: number; limit: number; offset: number }> {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  return fetchApi(`/api/providers?${q}`)
}

// Regions
export async function getRegions(params?: {
  provider?: string
  limit?: number
  offset?: number
}): Promise<{ items: import('@/types/api').Region[]; total: number; limit: number; offset: number }> {
  const q = new URLSearchParams()
  if (params?.provider) q.set('provider', params.provider)
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  return fetchApi(`/api/regions?${q}`)
}

// Instance Types
export async function getInstanceTypes(params?: {
  provider?: string
  min_vcpu?: number
  min_ram_gb?: number
  arch?: string
  limit?: number
  offset?: number
}): Promise<{ items: import('@/types/api').InstanceType[]; total: number; limit: number; offset: number }> {
  const q = new URLSearchParams()
  if (params?.provider) q.set('provider', params.provider)
  if (params?.min_vcpu) q.set('min_vcpu', String(params.min_vcpu))
  if (params?.min_ram_gb) q.set('min_ram_gb', String(params.min_ram_gb))
  if (params?.arch) q.set('arch', params.arch)
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  return fetchApi(`/api/instance-types?${q}`)
}

// Prices
export async function getPrices(params?: {
  provider?: string
  region?: string
  min_vcpu?: number
  min_ram_gb?: number
  arch?: string
  limit?: number
  offset?: number
}): Promise<{ items: import('@/types/api').Price[]; total: number; limit: number; offset: number }> {
  const q = new URLSearchParams()
  if (params?.provider) q.set('provider', params.provider)
  if (params?.region) q.set('region', params.region)
  if (params?.min_vcpu != null) q.set('min_vcpu', String(params.min_vcpu))
  if (params?.min_ram_gb != null) q.set('min_ram_gb', String(params.min_ram_gb))
  if (params?.arch) q.set('arch', params.arch)
  if (params?.limit != null) q.set('limit', String(params.limit))
  if (params?.offset != null) q.set('offset', String(params.offset))
  return fetchApi(`/api/prices?${q}`)
}

// Recommendations
export async function getRecommendations(
  body: import('@/types/api').RecommendationRequest
): Promise<import('@/types/api').RecommendationResponse> {
  return fetchApi('/api/recommendations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Price Analytics - Changes
export async function getPriceChanges(params?: {
  purchase_model?: string
  since_hours?: number
}): Promise<import('@/types/api').PriceChangesResponse> {
  const q = new URLSearchParams()
  if (params?.purchase_model) q.set('purchase_model', params.purchase_model)
  if (params?.since_hours != null) q.set('since_hours', String(params.since_hours))
  return fetchApi(`/api/price-analytics/changes?${q}`)
}

// Price Analytics - Trends
export async function getPriceTrends(params?: {
  purchase_model?: string
  days?: number
}): Promise<import('@/types/api').PriceTrendsResponse> {
  const q = new URLSearchParams()
  if (params?.purchase_model) q.set('purchase_model', params.purchase_model)
  if (params?.days != null) q.set('days', String(params.days))
  return fetchApi(`/api/price-analytics/trends?${q}`)
}
