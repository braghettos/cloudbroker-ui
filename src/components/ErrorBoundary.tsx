import { Component, Fragment, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  retryKey: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryKey: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-8">
          <p className="text-destructive font-medium">Something went wrong.</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {this.state.error?.message}
          </p>
          <Button
            onClick={() =>
              this.setState((s) => ({
                hasError: false,
                error: undefined,
                retryKey: (s.retryKey ?? 0) + 1,
              }))
            }
            variant="outline"
          >
            Try again
          </Button>
        </div>
      )
    }
    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
  }
}
