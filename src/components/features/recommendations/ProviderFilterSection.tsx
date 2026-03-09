import { Fragment } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getProviders } from '@/lib/api'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'
import { getProviderTypeLabel } from '@/lib/utils'

interface ProviderFilterSectionProps {
  form: UseFormReturn<RecommendationFormValues>
}

export function ProviderFilterSection({ form }: ProviderFilterSectionProps) {
  const { data } = useQuery({
    queryKey: ['providers', { limit: 100 }],
    queryFn: () => getProviders({ limit: 100 }),
  })

  const providers = data?.items ?? []
  const allowed = form.watch('allowed_providers') ?? []
  const excluded = form.watch('excluded_providers') ?? []
  const preferred = form.watch('preferred_providers') ?? []

  const byType = providers.reduce<Record<string, typeof providers>>((acc, p) => {
    const t = p.type || 'regional'
    if (!acc[t]) acc[t] = []
    acc[t].push(p)
    return acc
  }, {})

  const toggleAllowed = (slug: string) => {
    const current = allowed ?? []
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    form.setValue('allowed_providers', next.length ? next : null)
  }

  const toggleExcluded = (slug: string) => {
    const current = excluded ?? []
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    form.setValue('excluded_providers', next)
  }

  const togglePreferred = (slug: string) => {
    const current = preferred ?? []
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    form.setValue('preferred_providers', next)
  }

  return (
    <div className="space-y-3">
      <Label>Providers</Label>
      <div className="max-h-64 overflow-y-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm border-b">
            <tr>
              <th className="text-left py-2 px-3 font-medium">Provider</th>
              <th className="text-center py-2 px-2 w-20" title="Restrict results to these providers">
                Allow
              </th>
              <th className="text-center py-2 px-2 w-20" title="Blacklist these providers">
                Exclude
              </th>
              <th className="text-center py-2 px-2 w-20" title="Score bonus for these providers">
                Prefer
              </th>
            </tr>
          </thead>
          <tbody>
            {(['hyperscaler', 'eu', 'regional'] as const).map((type) => {
              const list = byType[type] || []
              if (list.length === 0) return null
              return (
                <Fragment key={type}>
                  <tr className="bg-muted/30">
                    <td colSpan={4} className="py-1 px-3 text-xs font-medium text-muted-foreground">
                      {getProviderTypeLabel(type)}
                    </td>
                  </tr>
                  {list.map((p) => (
                    <tr key={p.id} className="border-t border-border/50 hover:bg-muted/20">
                      <td className="py-1.5 px-3">
                        <Label htmlFor={`allow-${p.slug}`} className="cursor-pointer font-mono">
                          {p.slug}
                        </Label>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <Checkbox
                          checked={allowed?.includes(p.slug) ?? false}
                          onCheckedChange={() => toggleAllowed(p.slug)}
                          id={`allow-${p.slug}`}
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <Checkbox
                          checked={excluded?.includes(p.slug) ?? false}
                          onCheckedChange={() => toggleExcluded(p.slug)}
                          id={`excl-${p.slug}`}
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <Checkbox
                          checked={preferred?.includes(p.slug) ?? false}
                          onCheckedChange={() => togglePreferred(p.slug)}
                          id={`pref-${p.slug}`}
                        />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
