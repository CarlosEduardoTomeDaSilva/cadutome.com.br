import { IconContext } from '@phosphor-icons/react'
import { MotionConfig } from 'motion/react'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Stats } from './components/Stats'
import { Timeline } from './components/Timeline'

export default function App() {
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
          <Timeline />
          <Education />
          <Contact />
        </main>
      </IconContext.Provider>
    </MotionConfig>
  )
}
