import { IconContext } from '@phosphor-icons/react'
import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Activity } from './components/Activity'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Stats } from './components/Stats'
import { Timeline } from './components/Timeline'
import type { Milestone } from './data/profile'

export default function App() {
  // Marco escolhido na linha do tempo, destacado no mapa de commits
  const [milestone, setMilestone] = useState<Milestone | null>(null)

  return (
    <MotionConfig reducedMotion="user">
      <IconContext.Provider value={{ size: 20, weight: 'regular' }}>
        <a
          href="#conteudo"
          className="sr-only z-60 rounded-full bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <Nav />
        <main id="conteudo">
          <Hero />
          <Stats />
          <Projects />
          <Timeline onSelect={setMilestone} />
          <Activity highlight={milestone} onClearHighlight={() => setMilestone(null)} />
          <Education />
          <Contact />
        </main>
      </IconContext.Provider>
    </MotionConfig>
  )
}
