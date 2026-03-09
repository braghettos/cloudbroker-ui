// Provider
export type ProviderType = 'hyperscaler' | 'eu' | 'regional'

export interface Provider {
  id: number
  name: string
  slug: string
  website: string | null
  type: ProviderType
}

// Region
export interface Region {
  id: number
  provider_id: number
  name: string
  slug: string
  country: string | null
  is_eu: boolean
}

// Instance Type
export interface InstanceType {
  id: number
  provider_id: number
  name: string
  family: string | null
  generation: string | null
  vcpu: number
  ram_gb: number
  arch: string | null
}

// Price
export type PurchaseModel = 'on_demand' | 'spot' | 'reserved'

export interface Price {
  id: number
  instance_type_id: number
  region_id: number
  purchase_model: PurchaseModel
  currency: string
  price_per_hour: number
  timestamp: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

// Recommendations
export interface RecommendationExplain {
  resource_fit: number
  normalized_price: number
  price_weight: number
  fit_weight: number
  performance_score: number | null
  reliability_score: number | null
  price_eur_per_hour: number
  region_is_eu: boolean
  tco_eur_per_hour: number | null
  egress_cost_eur_per_hour: number | null
  storage_cost_eur_per_hour: number | null
  public_ip_cost_eur_per_hour: number | null
  os_license_cost_eur_per_hour: number | null
  cross_az_cost_eur_per_hour: number | null
}

export interface RecommendationItem {
  instance_type_id: number
  instance_type_name: string
  provider_slug: string
  region_id: number
  region_slug: string
  vcpu: number
  ram_gb: number
  arch: string | null
  score: number
  explain: RecommendationExplain
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[]
}

export interface RecommendationRequest {
  min_vcpu: number
  min_ram_gb: number
  arch: string
  max_price_eur_per_hour: number
  region_constraint?: 'EU' | 'ANY'
  purchase_model?: string
  limit?: number
  price_weight?: number
  fit_weight?: number
  preferred_providers?: string[]
  allowed_providers?: string[] | null
  excluded_providers?: string[]
  excluded_instance_types?: string[]
  cost_weight?: number
  performance_weight?: number
  reliability_weight?: number
  data_source_provider?: string
  data_source_region?: string
  estimated_egress_gb_per_hour?: number
  max_tco_eur_per_hour?: number
  min_storage_gb?: number
  storage_type?: string
  include_public_ip?: boolean
  os_type?: string
  estimated_cross_az_gb_per_hour?: number
  min_gpu_count?: number
  gpu_type?: string
}

// Price Analytics
export interface PriceChange {
  instance_type_id: number
  instance_type_name: string
  region_id: number
  region_slug: string
  purchase_model: string
  old_price_eur_per_hour: number | null
  new_price_eur_per_hour: number | null
  price_change_eur_per_hour: number
  price_change_percent: number
  timestamp: string
}

export interface PriceChangesResponse {
  count: number
  purchase_model: string | null
  since_hours: number
  changes: PriceChange[]
}

export interface PriceTrend {
  instance_type_id: number
  region_id: number
  purchase_model: string
  trend_direction: 'increasing' | 'decreasing' | 'stable'
  price_change_percent: number
  price_change_eur_per_hour: number
  first_price: number | null
  latest_price: number | null
  first_timestamp: string
  latest_timestamp: string
  data_points: number
}

export interface PriceTrendsResponse {
  count: number
  purchase_model: string | null
  days: number
  trends: PriceTrend[]
}

// Health
export interface HealthResponse {
  status: string
  database?: string
}
