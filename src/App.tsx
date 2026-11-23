import Landing from './sections/Landing.tsx'
import Projects from './sections/Projects.tsx'
import Timeline from './sections/Timeline.tsx'
import Github from './sections/Github.tsx'
import PaletteSwitch from './sections/PaletteSwitch.tsx'

export default function App() {
  return (
    <main>
      <Landing />
      <Projects />
      <Github />
      <Timeline />
      <PaletteSwitch />
    </main>
  )
}
