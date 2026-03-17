import { hekayaConfig } from './content/hekaya.config'
import ConfigErrorState from './components/hekaya/system/ConfigErrorState'
import HekayaErrorBoundary from './components/hekaya/system/HekayaErrorBoundary'
import { HekayaExperience } from './templates/hekaya/HekayaExperience'
import { validateHekayaConfig } from './types/hekaya'

export default function App() {
  const validation = validateHekayaConfig(hekayaConfig)

  if (import.meta.env.DEV && validation.warnings.length > 0) {
    console.warn('Hekaya config warnings:', validation.warnings)
  }

  if (!validation.isValid) {
    return (
      <ConfigErrorState locale={hekayaConfig.locale} errors={validation.errors} />
    )
  }

  return (
    <HekayaErrorBoundary locale={hekayaConfig.locale}>
      <HekayaExperience config={hekayaConfig} />
    </HekayaErrorBoundary>
  )
}
