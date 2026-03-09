import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRegions } from '@/lib/api'
import type { Provider } from '@/types/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { getProviderTypeLabel } from '@/lib/utils'

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const { data: regionsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['regions', provider.slug],
    queryFn: () => getRegions({ provider: provider.slug, limit: 100 }),
    enabled: expanded,
    retry: 1,
  })

  const regions = regionsData?.items ?? []

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{provider.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{provider.slug}</Badge>
              <Badge variant="outline">{getProviderTypeLabel(provider.type)}</Badge>
            </div>
          </div>
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? 'Hide' : 'Show'} regions
        </button>
        {expanded && regions.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm max-h-40 overflow-y-auto">
            {regions.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <span>{r.slug}</span>
                {r.country && <span className="text-muted-foreground">({r.country})</span>}
                {r.is_eu && <Badge variant="outline" className="text-xs">EU</Badge>}
              </li>
            ))}
          </ul>
        )}
        {expanded && regions.length === 0 && isLoading && (
          <p className="text-sm text-muted-foreground mt-2">Loading regions...</p>
        )}
        {expanded && regions.length === 0 && isError && (
          <div className="mt-2 flex items-center gap-2">
            <p className="text-sm text-destructive">Failed to load regions</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        {expanded && regions.length === 0 && !isLoading && !isError && regionsData && (
          <p className="text-sm text-muted-foreground mt-2">No regions</p>
        )}
      </CardContent>
    </Card>
  )
}
