import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProviders } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ProviderCard } from '@/components/features/providers/ProviderCard'
import { Skeleton } from '@/components/ui/skeleton'

export function ProvidersPage() {
  const [search, setSearch] = useState('')
  const [euOnly, setEuOnly] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['providers', { limit: 100 }],
    queryFn: () => getProviders({ limit: 100 }),
  })

  const providers = data?.items ?? []
  const filtered = providers.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Providers</h1>
        <p className="text-muted-foreground">
          Browse cloud providers and their regions.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="eu-only"
            checked={euOnly}
            onCheckedChange={(c) => setEuOnly(!!c)}
          />
          <Label htmlFor="eu-only" className="text-sm font-normal cursor-pointer">
            EU providers only
          </Label>
        </div>
      </div>

      {error && (
        <p className="text-destructive">Failed to load providers.</p>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered
            .filter((p) => !euOnly || p.type === 'eu')
            .map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
        </div>
      )}
    </div>
  )
}
