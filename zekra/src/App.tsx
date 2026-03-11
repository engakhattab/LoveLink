import { zekraConfig } from './content/zekra.config'
import { ZekraExperience } from './templates/zekra/ZekraExperience'

export default function App() {
  return <ZekraExperience config={zekraConfig} />
}
