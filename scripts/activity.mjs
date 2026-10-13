/*
 * Gera src/data/activity.json com a contagem de commits por dia de cada projeto.
 * Só as datas são lidas: nenhum código ou mensagem de commit sai dos repositórios privados.
 *
 * Uso local:  ACTIVITY_TOKEN=$(gh auth token) npm run activity
 * No deploy:  o GitHub Actions passa o segredo ACTIVITY_TOKEN (token só de leitura).
 */
import { readFileSync, writeFileSync } from 'node:fs'

const OWNER = 'CarlosEduardoTomeDaSilva'
const PROJECTS = [
  { id: 'rankup', name: 'RankUp', repo: 'apprankup' },
  { id: 'oasis-app', name: 'Oasis App', repo: 'beach-spot-checkin' },
]
// Fundação do RankUp no currículo. O commit isolado de jan/2025 é a criação do projeto e fica de fora.
const START = '2025-11-01'
const OUT = new URL('../src/data/activity.json', import.meta.url)

const token = process.env.ACTIVITY_TOKEN
if (!token) {
  console.warn('::warning::ACTIVITY_TOKEN ausente; mantendo o activity.json atual.')
  process.exit(0)
}

// Data no fuso de Brasília, no formato AAAA-MM-DD
const toDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

async function commitDates(repo) {
  const dates = []
  let url = `https://api.github.com/repos/${OWNER}/${repo}/commits?per_page=100&since=${START}T03:00:00Z`
  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`)
    for (const c of await res.json()) dates.push(toDay.format(new Date(c.commit.author.date)))
    url = res.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null
  }
  return dates
}

try {
  const days = {}
  const projects = []
  for (const [i, p] of PROJECTS.entries()) {
    const dates = await commitDates(p.repo)
    for (const d of dates) {
      days[d] ??= PROJECTS.map(() => 0)
      days[d][i] += 1
    }
    projects.push({ id: p.id, name: p.name, total: dates.length })
  }

  const sorted = Object.fromEntries(Object.entries(days).sort(([a], [b]) => a.localeCompare(b)))
  const data = { start: START, generatedAt: new Date().toISOString(), projects, days: sorted }
  writeFileSync(OUT, JSON.stringify(data) + '\n')
  console.log(`activity.json: ${projects.map((p) => `${p.name} ${p.total}`).join(', ')}`)
} catch (error) {
  // Token expirado ou API fora do ar não derrubam o deploy: o site sai com os dados anteriores.
  const previous = JSON.parse(readFileSync(OUT, 'utf8'))
  console.warn(`::warning::Falha ao atualizar commits (${error.message}); mantendo dados de ${previous.generatedAt}.`)
}
