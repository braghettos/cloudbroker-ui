import { InstanceTable } from '@/components/features/instances/InstanceTable'

export function InstancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Instance Types</h1>
        <p className="text-muted-foreground">
          Explore instance types across providers.
        </p>
      </div>
      <InstanceTable />
    </div>
  )
}
