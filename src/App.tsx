import { lamsaConfig } from './content/lamsa.config'
import { LamsaExperience } from './templates/lamsa/LamsaExperience'

export default function App() {
  return <LamsaExperience config={lamsaConfig} />
}
