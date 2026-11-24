import Landing from './sections/Landing.tsx'
import Projects from './sections/Projects.tsx'
import Timeline from './sections/Timeline.tsx'
import Ai from './sections/Ai.tsx'
import Github from './sections/Github.tsx'
import PaletteSwitch from './sections/PaletteSwitch.tsx'

export default function App() {
  return (
    <main>
      <Landing />
      <Projects />
      <Ai />
      <Github />
      <Timeline />
      <PaletteSwitch />
    </main>
  )
}
