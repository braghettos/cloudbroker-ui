import type { RecommendationExplain } from '@/types/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatPriceShort } from '@/lib/utils'

interface ScoreExplainerProps {
  explain: RecommendationExplain
}

export function ScoreExplainer({ explain }: ScoreExplainerProps) {
  const data = [
    { name: 'Resource fit', value: explain.resource_fit, color: '#22c55e' },
    { name: 'Price score', value: explain.normalized_price, color: '#3b82f6' },
    ...(explain.performance_score != null
      ? [{ name: 'Performance', value: explain.performance_score, color: '#8b5cf6' }]
      : []),
    ...(explain.reliability_score != null
      ? [{ name: 'Reliability', value: explain.reliability_score, color: '#f59e0b' }]
      : []),
  ].filter((d) => d.value != null && d.value > 0) as { name: string; value: number; color: string }[]

  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Price: {formatPriceShort(explain.price_eur_per_hour)}/hr</p>
        {explain.tco_eur_per_hour != null && (
          <p>TCO: {formatPriceShort(explain.tco_eur_per_hour)}/hr</p>
        )}
      </div>
      {data.length > 0 && (
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 1]} hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [(v * 100).toFixed(0) + '%', '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
