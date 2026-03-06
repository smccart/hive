import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6">
          <p className="text-lg text-neutral-400 mb-4">Something went wrong.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-sm font-medium text-brand hover:text-white transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
