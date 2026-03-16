import { hekayaConfig } from './content/hekaya.config'
import { HekayaExperience } from './templates/hekaya/HekayaExperience'

export default function App() {
  return <HekayaExperience config={hekayaConfig} />
}
