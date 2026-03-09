import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(eur)
}

export function formatPriceShort(eur: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(eur)
}

export function formatPercent(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function scoreToColor(score: number): string {
  if (score >= 0.8) return 'bg-green-500'
  if (score >= 0.5) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function getProviderTypeLabel(type: string): string {
  if (type === 'hyperscaler') return 'Hyperscaler'
  if (type === 'eu') return 'EU'
  return 'Regional'
}

const PROVIDER_SLUG_TO_TYPE: Record<string, string> = {
  aws: 'hyperscaler',
  gcp: 'hyperscaler',
  azure: 'hyperscaler',
  hetzner: 'eu',
  scaleway: 'eu',
  ovh: 'eu',
  digitalocean: 'regional',
  seeweb: 'eu',
  aruba: 'eu',
  upcloud: 'eu',
  exoscale: 'eu',
  ionos: 'eu',
  gridscale: 'eu',
  stackit: 'eu',
  elastx: 'eu',
  cyso_cloud: 'eu',
  open_telekom_cloud: 'eu',
}

export function getProviderTypeFromSlug(slug: string): string {
  return getProviderTypeLabel(PROVIDER_SLUG_TO_TYPE[slug] || 'regional')
}

const PRESET_KEY = 'cloudbroker-recommendation-presets'
const HISTORY_KEY = 'cloudbroker-recommendation-history'
const MAX_HISTORY = 10

export interface SavedPreset {
  id: string
  name: string
  config: Record<string, unknown>
  createdAt: number
}

export interface HistoryEntry {
  id: string
  config: Record<string, unknown>
  timestamp: number
}

export function getPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(PRESET_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePreset(name: string, config: Record<string, unknown>): SavedPreset {
  const presets = getPresets()
  const preset: SavedPreset = {
    id: crypto.randomUUID(),
    name,
    config,
    createdAt: Date.now(),
  }
  presets.push(preset)
  localStorage.setItem(PRESET_KEY, JSON.stringify(presets))
  return preset
}

export function deletePreset(id: string): void {
  const presets = getPresets().filter((p) => p.id !== id)
  localStorage.setItem(PRESET_KEY, JSON.stringify(presets))
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToHistory(config: Record<string, unknown>): void {
  const history = getHistory()
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    config,
    timestamp: Date.now(),
  }
  const updated = [entry, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}
