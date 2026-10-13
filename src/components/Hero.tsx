import { ArrowDownIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { profile } from '../data/profile'
import { btnPrimary, btnSecondary, wrap } from '../lib/ui'

const ease = [0.16, 1, 0.3, 1] as const

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
})

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div
        className={`${wrap} grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-12 md:grid-cols-12 md:gap-8 md:py-16`}
      >
        <div className="md:col-span-7">
          <motion.h1
            {...enter(0)}
            className="font-display text-6xl leading-[0.95] text-balance sm:text-7xl lg:text-8xl"
          >
            {profile.shortName}
          </motion.h1>
          <motion.p {...enter(0.08)} className="mt-6 max-w-[34ch] text-xl leading-relaxed text-muted md:text-2xl">
            {profile.pitch}
          </motion.p>
          <motion.div {...enter(0.16)} className="mt-10 flex flex-wrap gap-3">
            <a href="#projetos" className={btnPrimary}>
              Ver projetos
              <ArrowDownIcon />
            </a>
            <a href="#contato" className={btnSecondary}>
              Fale comigo
            </a>
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <Portrait />
        </div>
      </div>
    </section>
  )
}

function Portrait() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative mx-auto w-full max-w-sm md:ml-auto md:mr-0">
      {/* Sol de fim de tarde atrás do retrato */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease }}
        className="absolute -right-8 -top-8 size-44 rounded-full bg-accent md:-right-12 md:-top-12 md:size-56"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease }}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent-soft shadow-[0_30px_60px_-30px_rgb(16_42_50/0.45)]"
      >
        {failed ? (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-8xl text-accent">{profile.initials}</span>
          </div>
        ) : (
          <img
            src={profile.photo}
            alt={`Foto de ${profile.name}`}
            className="h-full w-full object-cover"
            width={1024}
            height={1024}
            onError={() => setFailed(true)}
          />
        )}
      </motion.div>
    </div>
  )
}
