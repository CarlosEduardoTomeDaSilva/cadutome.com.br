import { ListIcon, MoonIcon, SunIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useTheme } from '../hooks/useTheme'
import { iconButton, wrap } from '../lib/ui'

const sections = [
  { id: 'numeros', label: 'Números' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'trajetoria', label: 'Trajetória' },
  { id: 'contato', label: 'Contato' },
] as const

// Hero e formação não têm link, mas são observados para apagar o destaque quando estão na tela
const observedIds = ['topo', ...sections.map((s) => s.id), 'formacao']

export function Nav() {
  const active = useActiveSection(observedIds)
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav className={`${wrap} flex h-16 items-center justify-between gap-3 sm:gap-6`} aria-label="Principal">
        <a href="#topo" className="flex items-center gap-3 font-semibold">
          <Avatar />
          <span className="text-sm leading-tight text-balance min-[360px]:whitespace-nowrap sm:text-base">
            <span className="hidden min-[390px]:inline">{profile.name}</span>
            <span className="min-[390px]:hidden">{profile.compactName}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id} className="relative">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`relative isolate block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active === s.id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-ink/8"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className={iconButton}
            aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`${iconButton} md:hidden`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <XIcon /> : <ListIcon />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="menu-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`${wrap} grid gap-1 pb-4 md:hidden`}
          >
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-lg font-medium text-ink hover:bg-ink/5"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}

/** Foto recortada no rosto. Se o arquivo faltar, volta para o monograma. */
function Avatar() {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="font-display flex size-9 items-center justify-center rounded-full bg-accent text-sm text-on-accent">
        {profile.initials}
      </span>
    )
  }

  return (
    <img
      src={profile.avatar}
      alt=""
      width={36}
      height={36}
      className="size-9 rounded-full object-cover ring-2 ring-accent/60 ring-offset-2 ring-offset-bg"
      onError={() => setFailed(true)}
    />
  )
}
