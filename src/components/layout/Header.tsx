import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useHealth } from '@/hooks/useHealth'
import { cn } from '@/lib/utils'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { data, isLoading, isError } = useHealth()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex items-center gap-1.5 text-xs',
            isLoading && 'text-muted-foreground',
            isError && 'text-destructive'
          )}
          title={isError ? 'API unreachable' : data?.database ? 'Connected' : 'API status'}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isLoading && 'bg-yellow-500 animate-pulse',
              isError && 'bg-red-500',
              data && !isError && 'bg-green-500'
            )}
          />
          {isLoading ? 'Checking...' : isError ? 'Offline' : 'Online'}
        </span>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
