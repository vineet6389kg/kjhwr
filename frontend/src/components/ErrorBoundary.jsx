import { Component } from 'react'

// React only catches render errors in class components.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="grid place-items-center rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="font-medium">Something went wrong displaying this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover"
        >
          Reload
        </button>
      </div>
    )
  }
}