import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { links, profile } from '../data/profile'
import { btnSecondary, wrap } from '../lib/ui'
import { Reveal } from './Reveal'

const year = new Date().getFullYear()

export function Contact() {
  // O LinkedIn só aparece depois que a URL for preenchida em data/profile.ts
  const social: { href: string; label: string; Icon: Icon }[] = [
    { href: links.linkedin, label: 'LinkedIn', Icon: LinkedinLogoIcon },
    { href: links.github, label: 'GitHub', Icon: GithubLogoIcon },
    { href: links.rankup, label: 'RankUp', Icon: ArrowUpRightIcon },
  ].filter((item) => item.href !== '')

  return (
    <section id="contato" className="pt-20 md:pt-28">
      <div className={wrap}>
        <Reveal>
          <div className="rounded-3xl bg-accent-soft px-6 py-14 sm:px-12 md:py-20">
            <h2 className="font-display text-4xl leading-[0.95] min-[360px]:text-5xl md:text-7xl">Vamos conversar?</h2>
            <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-ink/80">{profile.availability}</p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${links.email}`}
                className="font-display text-2xl leading-tight underline decoration-accent decoration-[3px] underline-offset-[6px] [overflow-wrap:anywhere] sm:text-4xl"
              >
                {links.email}
              </a>
              <CopyEmail />
            </div>

            <ul className="mt-10 flex flex-wrap gap-3">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className={btnSecondary}>
                    <Icon />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <footer className="flex flex-col gap-2 py-10 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>Feito com React, TypeScript, Tailwind CSS e Motion.</p>
        </footer>
      </div>
    </section>
  )
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2400)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setState('copied')
    } catch {
      setState('error')
    }
  }

  const label = { idle: 'Copiar e-mail', copied: 'Copiado', error: 'Não deu para copiar' }[state]

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold transition hover:border-ink/45 active:scale-[0.98]"
    >
      {state === 'copied' ? <CheckIcon className="text-accent" /> : <CopyIcon />}
      <span aria-live="polite">{label}</span>
    </button>
  )
}
