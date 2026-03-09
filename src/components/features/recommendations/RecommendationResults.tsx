import { useState } from 'react'
import type { RecommendationItem } from '@/types/api'
import { RecommendationCard } from './RecommendationCard'
import { CompareDrawer } from './CompareDrawer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Download } from 'lucide-react'

interface RecommendationResultsProps {
  results: RecommendationItem[] | null
  isLoading: boolean
}

export function RecommendationResults({ results, isLoading }: RecommendationResultsProps) {
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set())

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const compareItems = results?.filter((r) => compareIds.has(r.instance_type_id)) ?? []

  const exportJson = () => {
    if (!results) return
    const blob = new Blob([JSON.stringify({ recommendations: results }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recommendations.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCsv = () => {
    if (!results) return
    const headers = ['instance_type_name', 'provider_slug', 'region_slug', 'vcpu', 'ram_gb', 'arch', 'score', 'price_eur_per_hour']
    const rows = results.map((r) =>
      [r.instance_type_name, r.provider_slug, r.region_slug, r.vcpu, r.ram_gb, r.arch ?? '', r.score.toFixed(4), r.explain.price_eur_per_hour.toFixed(6)].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recommendations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        <p>No recommendations yet. Adjust your criteria and search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} recommendation{results.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download className="h-4 w-4 mr-1" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((item) => (
          <RecommendationCard
            key={`${item.instance_type_id}-${item.region_id}`}
            item={item}
            onCompareToggle={() => toggleCompare(item.instance_type_id)}
            isComparing={compareIds.has(item.instance_type_id)}
          />
        ))}
      </div>

      <CompareDrawer
        items={compareItems}
        open={compareItems.length >= 2}
        onClose={() => setCompareIds(new Set())}
      />
    </div>
  )
}
