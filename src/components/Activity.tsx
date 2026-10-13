import { SquaresFourIcon, TableIcon, XIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import raw from '../data/activity.json'
import type { Milestone } from '../data/profile'
import { heading, lead, sectionY, wrap } from '../lib/ui'
import { Reveal } from './Reveal'

type ActivityData = {
  start: string
  generatedAt: string
  projects: { id: string; name: string; total: number }[]
  days: Record<string, number[]>
}
const data = raw as ActivityData

/* Geometria do calendário (em unidades do SVG, que escala com a largura) */
const STEP = 17 // célula de 14 + 3 de respiro
const CELL = 14
const LEFT = 30 // espaço para os dias da semana
const TOP = 22 // espaço para os meses

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const WEEKDAYS: [number, string][] = [
  [1, 'seg'],
  [3, 'qua'],
  [5, 'sex'],
]

// Escala de uma cor só: mais commits, laranja mais forte (no tema escuro, mais claro)
const LEVEL_FILL = [
  'color-mix(in oklab, var(--color-ink) 8%, var(--color-surface))',
  'color-mix(in oklab, var(--color-accent) 28%, var(--color-surface))',
  'color-mix(in oklab, var(--color-accent) 52%, var(--color-surface))',
  'color-mix(in oklab, var(--color-accent) 76%, var(--color-surface))',
  'var(--color-accent)',
]

const DAY_MS = 86_400_000
const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`)
const toIso = (d: Date) => d.toISOString().slice(0, 10)
const brDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const longDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })
const nf = new Intl.NumberFormat('pt-BR')
const commits = (n: number) => `${nf.format(n)} ${n === 1 ? 'commit' : 'commits'}`
const range = (a: number, b: number) => (a >= b ? `${a}` : `${a}-${b}`)

type Cell = { iso: string; week: number; day: number; counts: number[] }

/** Semanas de domingo a sábado, do início (no máximo 12 meses atrás) até o dia em que os dados foram gerados. */
function buildCalendar() {
  const end = toDate(brDay.format(new Date(data.generatedAt)))
  const rollingStart = new Date(end.getTime() - 52 * 7 * DAY_MS)
  const start = new Date(Math.max(toDate(data.start).getTime(), rollingStart.getTime()))
  const firstSunday = new Date(start.getTime() - start.getUTCDay() * DAY_MS)
  const empty = data.projects.map(() => 0)

  const cells: Cell[] = []
  for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) {
    const d = new Date(t)
    const iso = toIso(d)
    const week = Math.floor((t - firstSunday.getTime()) / DAY_MS / 7)
    cells.push({ iso, week, day: d.getUTCDay(), counts: data.days[iso] ?? empty })
  }
  return { cells, weeks: (cells.at(-1)?.week ?? 0) + 1, start: toIso(start), end: toIso(end) }
}

/** Período de um marco: "nov/2025" vira o mês inteiro, "2026" vira o ano inteiro. */
function periodOf(m: Milestone): [string, string] {
  const [a, b] = m.date.split('/')
  if (!b) return [`${a}-01-01`, `${a}-12-31`]
  const month = MONTHS.indexOf(a) + 1
  const last = new Date(Date.UTC(Number(b), month, 0)).getUTCDate()
  const mm = String(month).padStart(2, '0')
  return [`${b}-${mm}-01`, `${b}-${mm}-${last}`]
}

/* Tudo o que depende só dos dados é calculado uma vez, fora do componente */
const calendar = buildCalendar()
const { cells, weeks } = calendar
const index = new Map(cells.map((c, i) => [`${c.week}-${c.day}`, i]))

const monthLabels: { week: number; text: string }[] = []
for (const c of cells) {
  const date = toDate(c.iso)
  if (date.getUTCDate() !== 1 && c !== cells[0]) continue
  const last = monthLabels.at(-1)
  if (last && c.week - last.week < 3) continue
  const month = date.getUTCMonth()
  monthLabels.push({ week: c.week, text: month === 0 ? String(date.getUTCFullYear()) : MONTHS[month] })
}

const monthlySums = new Map<string, number[]>()
for (const c of cells) {
  const key = c.iso.slice(0, 7)
  const sums = monthlySums.get(key) ?? data.projects.map(() => 0)
  c.counts.forEach((n, j) => (sums[j] += n))
  monthlySums.set(key, sums)
}
const months = [...monthlySums.entries()]

type Props = {
  highlight: Milestone | null
  onClearHighlight: () => void
}

export function Activity({ highlight, onClearHighlight }: Props) {
  const [filter, setFilter] = useState<'all' | number>('all')
  const [view, setView] = useState<'map' | 'table'>('map')
  const [active, setActive] = useState<{ i: number; x: number; y: number } | null>(null)
  const card = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  const value = (c: Cell) => (filter === 'all' ? c.counts.reduce((a, b) => a + b, 0) : c.counts[filter])
  const values = cells.map(value)

  // Limiares pelos quartis dos dias com commit, para a escala acompanhar o filtro
  const nonZero = values.filter((v) => v > 0).sort((a, b) => a - b)
  const quartile = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * p))] ?? 1
  const q1 = quartile(0.25)
  const q2 = Math.max(quartile(0.5), q1 + 1)
  const thresholds = [q1, q2, Math.max(quartile(0.75), q2 + 1)]
  const level = (v: number) => (v === 0 ? 0 : v <= thresholds[0] ? 1 : v <= thresholds[1] ? 2 : v <= thresholds[2] ? 3 : 4)
  const legend = [
    '0',
    range(1, thresholds[0]),
    range(thresholds[0] + 1, thresholds[1]),
    range(thresholds[1] + 1, thresholds[2]),
    `${thresholds[2] + 1}+`,
  ]

  const total = values.reduce((a, b) => a + b, 0)
  const activeDays = values.filter((v) => v > 0).length
  let streak = 0
  let run = 0
  for (const v of values) {
    run = v > 0 ? run + 1 : 0
    streak = Math.max(streak, run)
  }

  // Marco escolhido na linha do tempo
  let highlightRange: [string, string] | null = null
  let highlightNote = ''
  if (highlight) {
    const [from, to] = periodOf(highlight)
    if (to < calendar.start) highlightNote = 'é anterior ao período do mapa.'
    else if (from > calendar.end) highlightNote = 'ainda não aconteceu.'
    else highlightRange = [from < calendar.start ? calendar.start : from, to > calendar.end ? calendar.end : to]
  }
  const inHighlight = (c: Cell) => !highlightRange || (c.iso >= highlightRange[0] && c.iso <= highlightRange[1])
  const highlightWeeks = highlightRange
    ? [cells.find((c) => c.iso >= highlightRange[0])!.week, cells.findLast((c) => c.iso <= highlightRange[1])!.week]
    : null

  // Mostra os dias mais recentes primeiro quando o mapa não cabe na tela
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [view])

  const place = (i: number | undefined) => {
    if (i === undefined) return setActive(null)
    if (active?.i === i) return
    const rect = svg.current?.querySelector(`[data-i="${i}"]`)?.getBoundingClientRect()
    const box = card.current?.getBoundingClientRect()
    if (!rect || !box) return
    const x = Math.min(Math.max(rect.left + rect.width / 2 - box.left, 96), box.width - 96)
    setActive({ i, x, y: rect.top - box.top })
  }

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM()
    if (!matrix) return
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    // O alvo é a área inteira da grade: cada ponto cai na célula mais próxima
    place(index.get(`${Math.floor((p.x - LEFT) / STEP)}-${Math.floor((p.y - TOP) / STEP)}`))
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const current = active ? cells[active.i] : cells[cells.length - 1]
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }
    let next: number | undefined
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = cells.length - 1
    else if (event.key in moves) {
      const [dw, dd] = moves[event.key]
      next = active ? index.get(`${current.week + dw}-${current.day + dd}`) ?? active.i : cells.length - 1
    } else return
    event.preventDefault()
    svg.current?.querySelector(`[data-i="${next}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    requestAnimationFrame(() => place(next))
  }

  const activeCell = active ? cells[active.i] : null
  const describe = (c: Cell) => {
    const parts = filter === 'all' ? data.projects.map((p, j) => `${p.name} ${c.counts[j]}`).join(', ') : ''
    return `${longDate.format(toDate(c.iso))}: ${commits(value(c))}${parts ? ` (${parts})` : ''}`
  }

  const tableProjects = filter === 'all' ? data.projects.map((p, j) => ({ ...p, j })) : [{ ...data.projects[filter], j: filter }]

  const filters: { key: 'all' | number; label: string }[] = [
    { key: 'all', label: 'Todos' },
    ...data.projects.map((p, j) => ({ key: j, label: p.name })),
  ]

  return (
    <section id="ritmo" className={sectionY}>
      <div className={wrap}>
        <Reveal>
          <h2 className={heading}>Ritmo de construção</h2>
          <p className={lead}>
            Commits por dia no RankUp e no Oasis App desde nov/2025, incluindo os feitos com Lovable e Claude Code.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por projeto">
              {filters.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={filter === f.key}
                  onClick={() => {
                    setFilter(f.key)
                    setActive(null)
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === f.key
                      ? 'border-ink bg-ink text-bg'
                      : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setView((v) => (v === 'map' ? 'table' : 'map'))}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-ink/40 hover:text-ink"
            >
              {view === 'map' ? <TableIcon size={18} /> : <SquaresFourIcon size={18} />}
              {view === 'map' ? 'Ver tabela' : 'Ver mapa'}
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 sm:max-w-2xl">
            {[
              { label: 'commits', value: total },
              { label: 'dias com commit', value: activeDays },
              { label: 'dias seguidos, no máximo', value: streak },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <dt className="order-2 text-sm leading-snug text-muted">{s.label}</dt>
                <dd className="font-score order-1 text-4xl leading-none sm:text-5xl">{nf.format(s.value)}</dd>
              </div>
            ))}
          </dl>

          {highlight && (
            <div className="mt-6 inline-flex max-w-full items-center gap-3 rounded-full border border-accent/40 py-1.5 pl-4 pr-1.5 text-sm">
              <span>
                <span className="font-semibold">{highlight.title}</span> ({highlight.date})
                {highlightNote ? ` ${highlightNote}` : ' em destaque no mapa.'}
              </span>
              <button
                type="button"
                onClick={onClearHighlight}
                aria-label="Remover destaque"
                className="flex size-7 shrink-0 items-center justify-center rounded-full hover:bg-ink/8"
              >
                <XIcon size={14} />
              </button>
            </div>
          )}

          <div ref={card} className="relative mt-6 rounded-3xl border border-line bg-surface p-4 sm:p-8">
            {view === 'map' ? (
              <>
                <div
                  ref={scroller}
                  tabIndex={0}
                  role="group"
                  aria-label="Mapa de commits por dia. Use as setas para percorrer os dias."
                  onKeyDown={onKeyDown}
                  onBlur={() => setActive(null)}
                  className="overflow-x-auto rounded-2xl [scrollbar-width:thin]"
                >
                  <svg
                    ref={svg}
                    viewBox={`0 0 ${LEFT + weeks * STEP} ${TOP + 7 * STEP}`}
                    style={{ minWidth: LEFT + weeks * 13 }}
                    className="block h-auto w-full"
                    onPointerMove={onPointerMove}
                    onPointerDown={onPointerMove}
                    onPointerLeave={() => setActive(null)}
                    aria-hidden
                  >
                    {monthLabels.map((m) => (
                      <text key={m.week} x={LEFT + m.week * STEP} y={12} className="fill-muted text-[11px]">
                        {m.text}
                      </text>
                    ))}
                    {WEEKDAYS.map(([day, label]) => (
                      <text key={label} x={0} y={TOP + day * STEP + 11} className="fill-muted text-[10px]">
                        {label}
                      </text>
                    ))}
                    {cells.map((c, i) => (
                      <rect
                        key={c.iso}
                        data-i={i}
                        x={LEFT + c.week * STEP}
                        y={TOP + c.day * STEP}
                        width={CELL}
                        height={CELL}
                        rx={3}
                        style={{
                          fill: LEVEL_FILL[level(values[i])],
                          opacity: inHighlight(c) ? 1 : 0.2,
                          transition: 'fill 300ms, opacity 300ms',
                        }}
                      />
                    ))}
                    {highlightWeeks && (
                      <motion.rect
                        key={highlightRange?.join()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        x={LEFT + highlightWeeks[0] * STEP - 3}
                        y={TOP - 3}
                        width={(highlightWeeks[1] - highlightWeeks[0] + 1) * STEP + 3}
                        height={7 * STEP + 3}
                        rx={6}
                        fill="none"
                        className="stroke-accent"
                        strokeWidth={2}
                      />
                    )}
                    {activeCell && (
                      <rect
                        x={LEFT + activeCell.week * STEP - 1.5}
                        y={TOP + activeCell.day * STEP - 1.5}
                        width={CELL + 3}
                        height={CELL + 3}
                        rx={4}
                        fill="none"
                        className="stroke-ink"
                        strokeWidth={1.5}
                      />
                    )}
                  </svg>
                </div>

                {activeCell && active && (
                  <div
                    className="pointer-events-none absolute z-10 w-max -translate-x-1/2 -translate-y-full rounded-2xl border border-line bg-bg px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgb(16_42_50/0.35)]"
                    style={{ left: active.x, top: active.y - 8 }}
                  >
                    <p className="font-semibold">{commits(value(activeCell))}</p>
                    <p className="text-xs text-muted">{longDate.format(toDate(activeCell.iso))}</p>
                    {filter === 'all' && (
                      <ul className="mt-1.5 grid gap-0.5 text-xs">
                        {data.projects.map((p, j) => (
                          <li key={p.id} className="flex justify-between gap-6">
                            <span className="text-muted">{p.name}</span>
                            <span className="font-semibold tabular-nums">{nf.format(activeCell.counts[j])}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <p className="sr-only" aria-live="polite">
                  {activeCell ? describe(activeCell) : ''}
                </p>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 text-xs text-muted">
                  <p>Atualizado em {shortDate.format(new Date(data.generatedAt))}</p>
                  <div className="flex items-end gap-2" aria-label="Escala de cores">
                    <span className="pb-4">Menos</span>
                    {legend.map((label, l) => (
                      <span key={label} className="flex flex-col items-center gap-1">
                        <span className="size-3.5 rounded-[3px]" style={{ background: LEVEL_FILL[l] }} />
                        <span className="tabular-nums">{label}</span>
                      </span>
                    ))}
                    <span className="pb-4">Mais</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Commits por mês</caption>
                  <thead className="text-muted">
                    <tr>
                      <th className="pb-3 font-semibold">Mês</th>
                      {tableProjects.map((p) => (
                        <th key={p.id} className="pb-3 text-right font-semibold">
                          {p.name}
                        </th>
                      ))}
                      {filter === 'all' && <th className="pb-3 text-right font-semibold">Total</th>}
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {months.map(([key, sums]) => {
                      const [y, m] = key.split('-')
                      return (
                        <tr key={key} className="border-t border-line">
                          <td className="py-2.5">{`${MONTHS[Number(m) - 1]}/${y}`}</td>
                          {tableProjects.map((p) => (
                            <td key={p.id} className="py-2.5 text-right">
                              {nf.format(sums[p.j])}
                            </td>
                          ))}
                          {filter === 'all' && (
                            <td className="py-2.5 text-right font-semibold">
                              {nf.format(sums.reduce((a, b) => a + b, 0))}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
