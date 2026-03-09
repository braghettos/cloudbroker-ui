import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecommendationForm } from '@/components/features/recommendations/RecommendationForm'
import { RecommendationResults } from '@/components/features/recommendations/RecommendationResults'
import type { RecommendationItem, RecommendationRequest } from '@/types/api'
import { addToHistory } from '@/lib/utils'

const recommendationSchema = z.object({
  min_vcpu: z.number().min(1),
  min_ram_gb: z.number().positive(),
  arch: z.enum(['x86_64', 'arm64', 'amd64', 'aarch64']),
  max_price_eur_per_hour: z.number().min(0),
  region_constraint: z.enum(['EU', 'ANY']).optional(),
  purchase_model: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  price_weight: z.number().min(0).max(1).optional(),
  fit_weight: z.number().min(0).max(1).optional(),
  cost_weight: z.number().min(0).max(1).optional(),
  performance_weight: z.number().min(0).max(1).optional(),
  reliability_weight: z.number().min(0).max(1).optional(),
  allowed_providers: z.array(z.string()).nullable().optional(),
  excluded_providers: z.array(z.string()).optional(),
  preferred_providers: z.array(z.string()).optional(),
  data_source_provider: z.string().optional(),
  data_source_region: z.string().optional(),
  estimated_egress_gb_per_hour: z.number().min(0).optional(),
  min_storage_gb: z.number().min(0).optional(),
  storage_type: z.string().optional(),
  include_public_ip: z.boolean().optional(),
  os_type: z.string().optional(),
  max_tco_eur_per_hour: z.number().min(0).optional(),
})

export type RecommendationFormValues = z.infer<typeof recommendationSchema>

const defaultValues: RecommendationFormValues = {
  min_vcpu: 2,
  min_ram_gb: 4,
  arch: 'x86_64',
  max_price_eur_per_hour: 0.5,
  region_constraint: 'ANY',
  purchase_model: 'on_demand',
  limit: 10,
  price_weight: 0.5,
  fit_weight: 0.5,
  allowed_providers: null,
  excluded_providers: [],
  preferred_providers: [],
}

export function RecommendationsPage() {
  const [results, setResults] = useState<RecommendationItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues,
  })

  const onSubmit = async (values: RecommendationFormValues) => {
    addToHistory(values as unknown as Record<string, unknown>)
    setIsLoading(true)
    setError(null)
    try {
      const body: RecommendationRequest = {
        min_vcpu: values.min_vcpu,
        min_ram_gb: values.min_ram_gb,
        arch: values.arch === 'amd64' ? 'x86_64' : values.arch === 'aarch64' ? 'arm64' : values.arch,
        max_price_eur_per_hour: values.max_price_eur_per_hour,
        region_constraint: values.region_constraint,
        purchase_model: values.purchase_model || 'on_demand',
        limit: values.limit ?? 10,
        price_weight: values.price_weight,
        fit_weight: values.fit_weight,
        cost_weight: values.cost_weight,
        performance_weight: values.performance_weight,
        reliability_weight: values.reliability_weight,
        allowed_providers: values.allowed_providers?.length ? values.allowed_providers : undefined,
        excluded_providers: values.excluded_providers?.length ? values.excluded_providers : undefined,
        preferred_providers: values.preferred_providers?.length ? values.preferred_providers : undefined,
        data_source_provider: values.data_source_provider || undefined,
        data_source_region: values.data_source_region || undefined,
        estimated_egress_gb_per_hour: values.estimated_egress_gb_per_hour ?? undefined,
        min_storage_gb: values.min_storage_gb ?? undefined,
        storage_type: values.storage_type || undefined,
        include_public_ip: values.include_public_ip ?? undefined,
        os_type: values.os_type || undefined,
        max_tco_eur_per_hour: values.max_tco_eur_per_hour ?? undefined,
      }
      const res = await import('@/lib/api').then((m) => m.getRecommendations(body))
      setResults(res.recommendations)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recommendations</h1>
        <p className="text-muted-foreground">
          Find the best cloud instances for your workload.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}
          <RecommendationResults results={results} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
