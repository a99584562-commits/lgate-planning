import { useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'
import Gate, { isUnlocked } from './components/Gate.jsx'
import Shell, { roleSteps } from './components/Shell.jsx'
import StepHybrids from './components/StepHybrids.jsx'
import StepRegions from './components/StepRegions.jsx'
import StepTP from './components/StepTP.jsx'
import StepFarms from './components/StepFarms.jsx'
import StepDeals from './components/StepDeals.jsx'

const SCREENS = {
  hybrids: StepHybrids,
  regions: StepRegions,
  tp: StepTP,
  farms: StepFarms,
  deals: StepDeals,
}

function Screen() {
  const { state } = useStore()
  const allowed = roleSteps(state.role)
  const id = allowed.includes(state.step) ? state.step : allowed[0]
  const Cmp = SCREENS[id]
  return <Cmp />
}

export default function App() {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />
  return (
    <StoreProvider>
      <Shell>
        <Screen />
      </Shell>
    </StoreProvider>
  )
}
