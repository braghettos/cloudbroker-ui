import { useState } from 'react'
import type { RecommendationItem } from '@/types/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScoreExplainer } from './ScoreExplainer'
import { formatPriceShort, scoreToColor, getProviderTypeFromSlug } from '@/lib/utils'

interface RecommendationCardProps {
  item: RecommendationItem
  onCompareToggle: () => void
  isComparing: boolean
}

export function RecommendationCard({ item, onCompareToggle, isComparing }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const monthlyCost = item.explain.price_eur_per_hour * 720

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{item.instance_type_name}</span>
              <Badge variant="secondary">{item.provider_slug}</Badge>
              <Badge variant="outline">{getProviderTypeFromSlug(item.provider_slug)}</Badge>
              {item.explain.region_is_eu && (
                <Badge variant="outline">EU</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {item.region_slug} · {item.vcpu} vCPU · {item.ram_gb} GB RAM
              {item.arch && ` · ${item.arch}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {formatPriceShort(item.explain.price_eur_per_hour)}/hr
            </span>
            <span className="text-xs text-muted-foreground">
              ~{formatPriceShort(monthlyCost)}/mo
            </span>
            <Checkbox
              checked={isComparing}
              onCheckedChange={onCompareToggle}
              aria-label="Compare"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', scoreToColor(item.score))}
              style={{ width: `${Math.min(100, item.score * 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium">{(item.score * 100).toFixed(0)}%</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {expanded ? 'Hide' : 'Show'} score breakdown
        </button>
        {expanded && <ScoreExplainer explain={item.explain} />}
      </CardContent>
    </Card>
  )
}

import { cn } from '@/lib/utils'
