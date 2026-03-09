import { Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { ProvidersPage } from '@/pages/ProvidersPage'
import { InstancesPage } from '@/pages/InstancesPage'
import { PricesPage } from '@/pages/PricesPage'

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/recommendations" replace />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/instances" element={<InstancesPage />} />
            <Route path="/prices" element={<PricesPage />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </ErrorBoundary>
  )
}
