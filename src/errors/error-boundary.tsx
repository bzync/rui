"use client"
import { Component, type ErrorInfo, type ReactNode } from "react"

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
  onReset?: () => void
}

interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props
      if (typeof fallback === "function") return (fallback as (e: Error, r: () => void) => ReactNode)(this.state.error!, this.reset)
      if (fallback) return fallback
      return (
        <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-700 dark:text-red-300">
          <p className="font-medium">Something went wrong.</p>
          <p className="mt-1 text-xs opacity-80">{this.state.error?.message}</p>
          <button type="button" onClick={this.reset} className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
