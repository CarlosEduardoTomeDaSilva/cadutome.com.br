import {
  CaretLeftIcon,
  CaretRightIcon,
  GraduationCapIcon,
  RocketLaunchIcon,
  StorefrontIcon,
  type Icon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { timeline, type TimelineCategory } from '../data/profile'
import { chip, heading, iconButton, lead, sectionY, wrap } from '../lib/ui'
import { Reveal } from './Reveal'

type Filter = 'Todos' | TimelineCategory

const filters: Filter[] = ['Todos', 'Produto', 'Negócios', 'Formação']

const categoryIcon: Record<TimelineCategory, Icon> = {
  Produto: RocketLaunchIcon,
  Negócios: StorefrontIcon,
  Formação: GraduationCapIcon,
}

const statusLabel = { agora: 'Acontecendo agora', previsto: 'Previsto' } as const

export function Timeline() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState<Filter>('Todos')
  const [activeTitle, setActiveTitle] = useState(timeline[0].title)
  const rail = useRef<HTMLDivElement>(null)
  const buttons = useRef(new Map<string, HTMLButtonElement>())

  const items = useMemo(
    () => (filter === 'Todos' ? timeline : timeline.filter((m) => m.category === filter)),
    [filter],
  )
  const index = Math.max(
    0,
    items.findIndex((m) => m.title === activeTitle),
  )
  const active = items[index]

  const select = (i: number, focus = false) => {
    const milestone = items[i]
    if (!milestone) return
    setActiveTitle(milestone.title)
    const button = buttons.current.get(milestone.title)
    if (button && rail.current) {
      // Rola só o trilho, sem mexer na rolagem da página
      const railBox = rail.current.getBoundingClientRect()
      const box = button.getBoundingClientRect()
      const left = rail.current.scrollLeft + box.left - railBox.left - railBox.width / 2 + box.width / 2
      rail.current.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
      if (focus) button.focus({ preventScroll: true })
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(Math.min(items.length - 1, Math.max(0, keys[event.key])), true)
  }

  const changeFilter = (next: Filter) => {
    setFilter(next)
    rail.current?.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' })
    const first = next === 'Todos' ? timeline[0] : timeline.find((m) => m.category === next)
    if (first) setActiveTitle(first.title)
  }

  const ActiveIcon = categoryIcon[active.category]

  return (
    <section id="trajetoria" className={sectionY}>
      <div className={wrap}>
        <Reveal>
          <h2 className={heading}>Trajetória</h2>
          <p className={lead}>De 2022 até a formatura. Filtre por área e escolha um marco para ver os detalhes.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar marcos por área">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => changeFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === f ? 'border-ink bg-ink text-bg' : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div
            ref={rail}
            className="relative -mx-4 mt-10 overflow-x-auto px-4 pb-4 [--fade:1rem] [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%-var(--fade)),transparent)] [scrollbar-width:thin] sm:-mx-6 sm:px-6 sm:[--fade:1.5rem] lg:-mx-8 lg:px-8 lg:[--fade:2rem]"
          >
            <ol className="relative flex w-max gap-2" aria-label="Marcos da trajetória" onKeyDown={onKeyDown}>
              <span aria-hidden className="absolute left-7 right-[8.25rem] top-[27px] h-0.5 bg-line" />
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((m, i) => {
                  const Glyph = categoryIcon[m.category]
                  const isActive = i === index
                  return (
                    <motion.li
                      key={m.title}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="w-40 shrink-0"
                    >
                      <button
                        ref={(el) => {
                          if (el) buttons.current.set(m.title, el)
                          else buttons.current.delete(m.title)
                        }}
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => select(i)}
                        className="group flex w-full flex-col items-start gap-3 rounded-2xl p-2 text-left"
                      >
                        <span
                          className={`relative flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                            isActive
                              ? 'border-accent bg-accent text-on-accent'
                              : m.status === 'previsto'
                                ? 'border-dashed border-muted/60 bg-bg text-muted'
                                : 'border-ink/25 bg-bg text-muted group-hover:border-ink/60 group-hover:text-ink'
                          }`}
                        >
                          {m.status === 'agora' && (
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-full border-2 border-accent motion-safe:animate-ping"
                            />
                          )}
                          <Glyph size={18} weight={isActive ? 'fill' : 'regular'} />
                        </span>
                        <span className="text-sm text-muted">{m.date}</span>
                        <span className={`font-semibold leading-snug ${isActive ? 'text-ink' : 'text-ink/75'}`}>
                          {m.title}
                        </span>
                      </button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ol>
          </div>

          <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-4">
                  <p className="font-score text-6xl leading-none text-accent sm:text-7xl">{active.date}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className={`${chip} gap-1.5`}>
                      <ActiveIcon size={16} aria-hidden />
                      {active.category}
                    </span>
                    {active.status && (
                      <span className={`${chip} border-accent/40 text-accent`}>{statusLabel[active.status]}</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-3xl leading-tight">{active.title}</h3>
                  <p className="mt-4 max-w-[55ch] text-lg leading-relaxed text-muted">{active.text}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => select(index - 1)}
                disabled={index === 0}
                className={`${iconButton} disabled:opacity-35`}
                aria-label="Marco anterior"
              >
                <CaretLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => select(index + 1)}
                disabled={index === items.length - 1}
                className={`${iconButton} disabled:opacity-35`}
                aria-label="Próximo marco"
              >
                <CaretRightIcon />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
