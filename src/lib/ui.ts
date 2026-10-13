/*
 * Classes compartilhadas.
 * Raios: botões e chips em pílula, cards em 24px (rounded-3xl), blocos internos em 16px (rounded-2xl).
 * Camadas (z-index): nav 40, modal 50, link "pular para o conteúdo" 60.
 */

export const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'

export const sectionY = 'py-20 md:py-28'

export const heading = 'font-display text-4xl leading-[1.05] text-balance md:text-5xl'

export const lead = 'mt-4 max-w-[60ch] text-lg leading-relaxed text-muted'

export const btnPrimary =
  'inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'

export const btnSecondary =
  'inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-6 py-3 font-semibold text-ink transition duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-ink/45 active:translate-y-0 active:scale-[0.98]'

export const chip = 'inline-flex items-center rounded-full border border-line px-3 py-1 text-sm text-muted'

export const iconButton =
  'inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink/40 active:scale-95'
