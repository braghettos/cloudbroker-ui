import { NavLink } from 'react-router-dom'
import {
  Search,
  BarChart3,
  Server,
  Cpu,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/recommendations', label: 'Recommendations', icon: Search },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/providers', label: 'Providers', icon: Server },
  { to: '/instances', label: 'Instances', icon: Cpu },
  { to: '/prices', label: 'Prices', icon: DollarSign },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 flex-col border-r bg-muted/30">
      <div className="p-4 border-b">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <img src="/cloudbroker-logo.svg" alt="" className="h-6 w-6" aria-hidden />
          CloudBroker
        </NavLink>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
