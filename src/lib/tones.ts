/* Tons de fundo dos cards de projeto. O modal herda o tom do card que o abriu. */
export type Tone = 'deep' | 'accent' | 'surface' | 'trophy'

export const toneClass: Record<Tone, { box: string; muted: string; chip: string }> = {
  deep: { box: 'bg-deep text-deep-ink', muted: 'text-deep-muted', chip: 'border-deep-line text-deep-muted' },
  accent: { box: 'bg-accent-soft text-ink', muted: 'text-muted', chip: 'border-ink/15 text-muted' },
  surface: { box: 'bg-surface text-ink', muted: 'text-muted', chip: 'border-line text-muted' },
  trophy: { box: 'bg-surface text-ink', muted: 'text-muted', chip: 'border-line text-muted' },
}
