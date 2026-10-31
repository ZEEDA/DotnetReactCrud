import { Component } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

function ErrorFallback({ error, onReset }) {
  return (
    <div
      role="alert"
      className="liquid-glass relative mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-orange-400 text-white shadow-md shadow-rose-500/30">
        <TriangleAlert className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
        <p className="mt-1 text-sm text-gray-600">
          This section failed to load. You can try again.
        </p>
      </div>
      {error?.message && (
        <pre className="w-full overflow-x-auto rounded-xl bg-gray-900/5 px-4 py-3 text-left text-xs text-rose-700">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-transform active:scale-95"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}

// Error boundaries must be class components; catches render errors in its children
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
