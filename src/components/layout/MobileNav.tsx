import { NavLink } from 'react-router-dom'
import { Search, BarChart3, Server, Cpu, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/recommendations', label: 'Recommend', icon: Search },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/providers', label: 'Providers', icon: Server },
  { to: '/instances', label: 'Instances', icon: Cpu },
  { to: '/prices', label: 'Prices', icon: DollarSign },
]

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background py-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-2 py-1 text-xs',
              isActive ? 'text-primary font-medium' : 'text-muted-foreground'
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
