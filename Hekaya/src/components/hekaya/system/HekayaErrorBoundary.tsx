import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import type { HekayaLocale } from '../../../types/hekaya'
import ConfigErrorState from './ConfigErrorState'

type HekayaErrorBoundaryProps = PropsWithChildren<{
  locale: HekayaLocale
  onReset?: () => void
}>

interface HekayaErrorBoundaryState {
  hasError: boolean
}

export class HekayaErrorBoundary extends Component<
  HekayaErrorBoundaryProps,
  HekayaErrorBoundaryState
> {
  state: HekayaErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      // Keep runtime failures visible in development.
      console.error('Hekaya runtime error:', error, info)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ConfigErrorState
          locale={this.props.locale}
          kind="runtime"
          onReload={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

export default HekayaErrorBoundary
