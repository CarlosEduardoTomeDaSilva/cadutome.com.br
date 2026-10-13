import { ArrowUpRightIcon, XIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Project } from '../data/profile'
import { toneClass, type Tone } from '../lib/tones'

type Props = {
  project: Project
  tone: Tone
  onClose: () => void
}

export function ProjectModal({ project, tone, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const t = toneClass[tone]

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeButton.current?.focus({ preventScroll: true })

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      // Mantém o foco do teclado dentro do modal
      if (event.key === 'Tab' && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#0c1e24]/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-${project.id}`}
        layoutId={`projeto-${project.id}`}
        style={{ borderRadius: 24 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto overscroll-contain ${t.box}`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="p-6 sm:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${t.chip}`}>{project.kind}</span>
              <h3 id={`modal-${project.id}`} className="font-display mt-5 text-4xl leading-none sm:text-5xl">
                {project.name}
              </h3>
              <p className={`mt-3 text-sm ${t.muted}`}>
                {project.role}, {project.period}
              </p>
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition active:scale-95"
            >
              <XIcon size={18} weight="bold" />
            </button>
          </div>

          <p className="mt-8 text-lg leading-relaxed">{project.context}</p>

          <h4 className="mt-10 font-semibold">O que eu fiz</h4>
          <ul className="mt-4 grid gap-3">
            {project.did.map((item) => (
              <li key={item} className={`relative pl-5 leading-relaxed ${t.muted}`}>
                <span aria-hidden className="absolute left-0 top-[0.7em] h-0.5 w-2.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>

          {project.results && (
            <>
              <h4 className="mt-10 font-semibold">Resultados</h4>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {project.results.map((r) => (
                  <li key={r} className={`rounded-2xl border p-4 text-sm leading-snug ${t.chip}`}>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h4 className="mt-10 font-semibold">Ferramentas</h4>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li key={tool} className={`rounded-full border px-3 py-1 text-sm ${t.chip}`}>
                {tool}
              </li>
            ))}
          </ul>

          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 font-semibold underline decoration-accent decoration-2 underline-offset-4"
            >
              {project.link.label}
              <ArrowUpRightIcon />
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
