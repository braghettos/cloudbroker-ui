import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import type { RecommendationFormValues } from '@/pages/RecommendationsPage'
import { BasicSection } from './BasicSection'
import { ProviderFilterSection } from './ProviderFilterSection'
import { ScoringSection } from './ScoringSection'
import { TcoSection } from './TcoSection'
import { PresetsSection } from './PresetsSection'

interface RecommendationFormProps {
  form: UseFormReturn<RecommendationFormValues>
  onSubmit: (values: RecommendationFormValues) => void
  isLoading: boolean
}

export function RecommendationForm({ form, onSubmit, isLoading }: RecommendationFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <PresetsSection form={form} />
      <BasicSection form={form} />
      <ProviderFilterSection form={form} />
      <ScoringSection form={form} />
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
          TCO (advanced)
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <TcoSection form={form} />
        </CollapsibleContent>
      </Collapsible>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Get Recommendations'}
      </Button>
    </form>
  )
}
