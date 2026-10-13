import { TrophyIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { scoreboards } from '../data/profile'
import { heading, lead, sectionY, wrap } from '../lib/ui'
import { CountUp } from './CountUp'
import { Reveal } from './Reveal'

export function Stats() {
  const [index, setIndex] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const board = scoreboards[index]

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + step + scoreboards.length) % scoreboards.length
    setIndex(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="numeros" className={sectionY}>
      <div className={wrap}>
        <Reveal>
          <h2 className={heading}>O que já está rodando</h2>
          <p className={lead}>Números reais dos dois projetos em que mais aprendi sobre produto e operação.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div role="tablist" aria-label="Escolha o projeto" className="inline-flex gap-1 rounded-full border border-line p-1">
            {scoreboards.map((b, i) => (
              <button
                key={b.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`tab-${b.id}`}
                aria-selected={i === index}
                aria-controls={`painel-${b.id}`}
                tabIndex={i === index ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={onKeyDown}
                className={`relative isolate rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  i === index ? 'text-on-accent' : 'text-muted hover:text-ink'
                }`}
              >
                {i === index && (
                  <motion.span
                    layoutId="stats-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {b.name}
              </button>
            ))}
          </div>

          <div className="relative isolate mt-6 overflow-hidden rounded-3xl bg-deep text-deep-ink">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={board.id}
                id={`painel-${board.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${board.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-10 p-6 sm:p-10 md:grid-cols-12 md:gap-8 lg:p-14"
              >
                <div className="md:col-span-5">
                  <p className="text-sm text-deep-muted">{board.context}</p>
                  <p className="font-score mt-4 text-[7rem] leading-[0.85] text-accent-bright sm:text-[9rem]">
                    <CountUp value={board.hero.value} prefix={board.hero.prefix} />
                  </p>
                  <p className="mt-4 text-2xl font-semibold leading-snug">{board.hero.label}</p>
                  <p className="mt-2 text-deep-muted">{board.hero.detail}</p>
                </div>

                <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-deep-line sm:grid-cols-2 md:col-span-7">
                  {board.stats.map((s) => (
                    <div key={s.label} className="flex flex-col justify-between gap-6 bg-deep p-6">
                      <dt className="order-2 text-deep-muted">{s.label}</dt>
                      <dd className="font-score order-1 text-6xl leading-none">
                        <CountUp value={s.value} prefix={s.prefix} />
                      </dd>
                    </div>
                  ))}
                  {board.badge && (
                    <div className="flex flex-col justify-between gap-6 bg-deep p-6">
                      <dt className="sr-only">Conquista</dt>
                      <dd className="flex h-full flex-col justify-between gap-6">
                        <TrophyIcon size={44} weight="fill" className="text-accent-bright" aria-hidden />
                        <span className="font-semibold leading-snug">{board.badge}</span>
                      </dd>
                    </div>
                  )}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
