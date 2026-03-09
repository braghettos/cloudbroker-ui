import type { RecommendationItem } from '@/types/api'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatPriceShort } from '@/lib/utils'

interface CompareDrawerProps {
  items: RecommendationItem[]
  open: boolean
  onClose: () => void
}

export function CompareDrawer({ items, open, onClose }: CompareDrawerProps) {
  if (items.length < 2) return null

  const keys = ['instance_type_name', 'provider_slug', 'region_slug', 'vcpu', 'ram_gb', 'arch', 'score', 'price_eur_per_hour'] as const

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="bottom" className="h-[70vh] overflow-auto">
        <SheetHeader>
          <SheetTitle>Compare ({items.length} selected)</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Metric</th>
                {items.map((item) => (
                  <th key={`${item.instance_type_id}-${item.region_id}`} className="text-left py-2 px-2">
                    {item.instance_type_name} @ {item.region_slug}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key} className="border-b">
                  <td className="py-2 pr-4 font-medium">{key.replace(/_/g, ' ')}</td>
                  {items.map((item) => (
                    <td key={`${item.instance_type_id}-${item.region_id}-${key}`} className="py-2 px-2">
                      {key === 'price_eur_per_hour'
                        ? formatPriceShort(item.explain.price_eur_per_hour)
                        : key === 'score'
                        ? (item.score * 100).toFixed(1) + '%'
                        : String(item[key as keyof RecommendationItem] ?? item.explain[key as keyof typeof item.explain] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  )
}
