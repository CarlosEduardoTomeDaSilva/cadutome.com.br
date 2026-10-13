import { PlusIcon, TrophyIcon } from '@phosphor-icons/react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { projects, type Project } from '../data/profile'
import { toneClass, type Tone } from '../lib/tones'
import { heading, lead, sectionY, wrap } from '../lib/ui'
import { ProjectModal } from './ProjectModal'
import { Reveal } from './Reveal'

/* Posição no bento e tom de fundo de cada card (o modal herda o mesmo tom) */
const layout: Record<string, { cell: string; tone: Tone }> = {
  rankup: { cell: 'md:col-span-4 md:row-span-2', tone: 'deep' },
  'oasis-app': { cell: 'md:col-span-2', tone: 'accent' },
  estalo: { cell: 'md:col-span-2', tone: 'surface' },
  'oasis-beach': { cell: 'md:col-span-3', tone: 'trophy' },
  bremen: { cell: 'md:col-span-3', tone: 'surface' },
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section id="projetos" className={sectionY}>
      <div className={wrap}>
        <Reveal>
          <h2 className={heading}>Projetos que construí</h2>
          <p className={lead}>Abra um projeto para ver o contexto, o que eu fiz e os resultados.</p>
        </Reveal>

        <LayoutGroup>
          <div className="mt-12 grid grid-cols-1 gap-4 md:auto-rows-[minmax(230px,auto)] md:grid-cols-6">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.06} className={`flex ${layout[project.id].cell}`}>
                <ProjectCard project={project} tone={layout[project.id].tone} onOpen={() => setSelected(project)} />
              </Reveal>
            ))}
          </div>

          <AnimatePresence>
            {selected && <ProjectModal project={selected} tone={layout[selected.id].tone} onClose={close} />}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  )
}

function ProjectCard({ project, tone, onOpen }: { project: Project; tone: Tone; onOpen: () => void }) {
  const t = toneClass[tone]
  const featured = project.id === 'rankup'

  return (
    <motion.button
      type="button"
      layoutId={`projeto-${project.id}`}
      onClick={onOpen}
      aria-haspopup="dialog"
      style={{ borderRadius: 24 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`group relative flex w-full flex-col justify-between gap-8 overflow-hidden p-6 text-left sm:p-8 ${t.box}`}
    >
      {tone === 'trophy' && (
        <TrophyIcon
          aria-hidden
          size={200}
          weight="thin"
          className="pointer-events-none absolute -bottom-8 -right-6 text-accent/15"
        />
      )}
      <div className="relative flex w-full items-start justify-between gap-4">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${t.chip}`}>{project.kind}</span>
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-300 group-hover:rotate-90"
        >
          <PlusIcon size={18} weight="bold" />
        </span>
      </div>

      <div className="relative">
        <h3 className={`font-display leading-none ${featured ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}>{project.name}</h3>
        <p className={`mt-3 text-sm ${t.muted}`}>
          {project.role}, {project.period}
        </p>
        <p className={`mt-4 max-w-[46ch] leading-relaxed ${featured ? 'text-lg' : ''}`}>{project.summary}</p>

        {featured && project.results && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {project.results.map((r) => (
              <li key={r} className="border-t border-deep-line pt-3 text-sm leading-snug text-deep-muted">
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className="sr-only">Ver detalhes de {project.name}</span>
    </motion.button>
  )
}
