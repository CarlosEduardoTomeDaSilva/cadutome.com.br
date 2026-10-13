/*
 * Todo o conteúdo da página fica aqui. Edite este arquivo para atualizar textos,
 * números e links sem mexer nos componentes.
 */

export const profile = {
  name: 'Carlos Eduardo Tomé da Silva',
  shortName: 'Carlos Eduardo',
  initials: 'CE',
  pitch:
    'Fundador do RankUp e da Oasis Beach. Construo produto do modelo de receita ao código em produção.',
  location: 'São Bernardo do Campo, SP',
  availability: 'Disponível para estágio de 6 h/dia, presencial ou híbrido em São Paulo.',
  // Arquivo em public/. O nome diferencia maiúsculas em produção. Sem o arquivo, aparece o monograma.
  photo: '/foto.JPG',
  // Versão pequena recortada no rosto, usada no menu
  avatar: '/avatar.jpg',
}

export const links = {
  email: 'caduts10@gmail.com',
  linkedin: 'https://www.linkedin.com/in/carloseduardotome/',
  github: 'https://github.com/CarlosEduardoTomeDaSilva',
  rankup: 'https://www.apprankup.com.br/',
}

/* ---------- Painel de números ---------- */

export type Stat = {
  value: number
  prefix?: string
  label: string
}

export type Scoreboard = {
  id: string
  name: string
  context: string
  hero: Stat & { detail: string }
  stats: Stat[]
  badge?: string
}

export const scoreboards: Scoreboard[] = [
  {
    id: 'rankup',
    name: 'RankUp',
    context: 'SaaS de gestão de torneios, desde dez/2025',
    hero: {
      value: 38,
      label: 'torneios realizados na plataforma',
      detail: 'de 13 organizadores em 6 cidades',
    },
    stats: [
      { value: 1922, label: 'equipes inscritas' },
      { value: 4300, prefix: '~', label: 'inscrições de atletas' },
      { value: 3618, label: 'jogos registrados' },
      { value: 3, label: 'modalidades: beach tennis, vôlei de praia e futevôlei' },
    ],
  },
  {
    id: 'oasis',
    name: 'Oasis Beach',
    context: 'Arena de esportes de areia em Sorocaba, desde ago/2022',
    hero: {
      value: 15,
      label: 'torneios organizados',
      detail: 'com média de 200 atletas inscritos por evento',
    },
    stats: [
      { value: 85, prefix: '>', label: 'NPS em todos os torneios' },
      { value: 100, prefix: '~', label: 'alunos na base' },
      { value: 10, label: 'patrocinadores' },
    ],
    badge: 'Campeã do InterArenas 2025, o maior torneio entre arenas do Brasil',
  },
]

/* ---------- Projetos ---------- */

export type Project = {
  id: string
  name: string
  kind: 'Produto' | 'Negócio'
  role: string
  period: string
  summary: string
  context: string
  did: string[]
  results?: string[]
  tools: string[]
  link?: { label: string; href: string }
  // Opcional: caminho de um print ou foto em public/ (ex.: '/projetos/rankup.png')
  image?: string
}

export const projects: Project[] = [
  {
    id: 'rankup',
    name: 'RankUp',
    kind: 'Produto',
    role: 'Fundador e desenvolvedor',
    period: 'nov/2025 até hoje',
    summary:
      'SaaS B2B2C de gestão de torneios de esportes de areia, em uso por organizadores do interior de SP.',
    context:
      'Plataforma de torneios de beach tennis, vôlei de praia e futevôlei, em uso por organizadores do interior de SP e próxima da monetização. Cuido de tudo, do modelo de receita ao código em produção.',
    did: [
      'Desenhei o modelo de receita: taxa de serviço por inscrição paga e assinaturas mensais, com planos separados por funcionalidade (relatórios, IA, ranking) para não frear inscrições.',
      'Projetei a arquitetura de pagamentos com split (Z2Pay): o valor cai direto na conta do organizador, sem custódia pela plataforma.',
      'Traduzi as regras oficiais da ITF (2026) em requisitos de produto, como formatos de set configuráveis e altura de rede por categoria.',
      'Documentei precificação, pagamentos, política de reembolso e regras de arquitetura para manter o desenvolvimento consistente.',
      'Desenvolvo e mantenho o PWA em produção. Corrigi falhas de service worker e versionamento e conduzi auditoria de código e reforço de segurança.',
    ],
    results: [
      '38 torneios de 13 organizadores em 6 cidades',
      '1.922 equipes inscritas (cerca de 4.300 inscrições de atletas)',
      '3.618 jogos registrados',
    ],
    tools: ['React', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL', 'Cloudflare', 'PWA'],
    link: { label: 'apprankup.com.br', href: 'https://www.apprankup.com.br/' },
  },
  {
    id: 'oasis-app',
    name: 'Oasis App',
    kind: 'Produto',
    role: 'Autor do PRD e desenvolvedor',
    period: '2026',
    summary:
      'Check-in e créditos para alunos de arena, no modelo Wellhub/TotalPass. Perto de ser comercializado.',
    context:
      'Sistema de check-in e créditos para alunos de arena, no modelo Wellhub/TotalPass. Será incorporado ao RankUp como módulo.',
    did: [
      'Escrevi o PRD completo, com 17 seções: modelo de dados, 12 funções em PostgreSQL e máquinas de estado.',
      'Defini as regras de cancelamento, no-show e repasse a professores.',
      'Implementei com React e Supabase.',
    ],
    tools: ['PRD', 'React', 'Supabase', 'PostgreSQL (RPC)'],
  },
  {
    id: 'estalo',
    name: 'Estalo',
    kind: 'Produto',
    role: 'Criador do conceito',
    period: 'jun a jul/2026',
    summary: 'Conceito de app de microaprendizagem para ENEM e vestibular.',
    context:
      'Produto criado do zero, da identidade visual ao escopo da primeira fase de desenvolvimento.',
    did: [
      'Criei a identidade visual e o PRD.',
      'Desenhei cinco telas mobile e um protótipo interativo em HTML.',
      'Defini o escopo da primeira fase de desenvolvimento.',
    ],
    tools: ['PRD', 'Design system', 'Prototipação', 'Escopo de MVP'],
  },
  {
    id: 'oasis-beach',
    name: 'Oasis Beach Sorocaba',
    kind: 'Negócio',
    role: 'Sócio-fundador',
    period: 'ago/2022 até hoje',
    summary:
      'Arena de beach tennis, vôlei de praia e futevôlei. Campeã do InterArenas 2025.',
    context:
      'Empresa familiar em que sou o principal responsável por estratégia, finanças, comercial e operação desde a fundação.',
    did: [
      'Estruturei a operação para as primeiras contratações: mapa de papéis e alçadas e seis checklists (reservas, planos de alunos, caixa e fechamento, abertura e fechamento, RH, comercial e retenção).',
      'Organizo a Copa Oasis entre Indústrias (nov/2026), com inscrição automatizada via Google Apps Script e pagamento por PIX.',
      'Criei o design system da marca e o app de gestão de alunos da arena.',
    ],
    results: [
      '15 torneios, com média de 200 atletas e 10 patrocinadores',
      'NPS sempre acima de 85',
      'Base de perto de 100 alunos',
    ],
    tools: ['Gestão', 'Finanças', 'Processos', 'Google Apps Script'],
  },
  {
    id: 'bremen',
    name: 'Bremen Bier',
    kind: 'Negócio',
    role: 'Sócio-fundador',
    period: 'ago/2024 até hoje',
    summary: 'Distribuidora de bebidas em Sorocaba, SP.',
    context:
      'Empresa familiar. Meu trabalho se concentra em custos, logística de entregas e propostas comerciais.',
    did: [
      'Construí um modelo de custo de frete em Excel, separando custos fixos e variáveis, com rentabilidade por cliente em semáforo.',
      'Desenvolvo uma ferramenta interna de roteirização de entregas com várias paradas e restrição de horário, pensada para uso simples pela equipe.',
      'Elaborei a proposta comercial do conceito Chopp Auto Serviço, seguindo o manual da marca.',
      'Atuo na presença da marca na Oktoberfest Votorantim (out/2026) e na negociação de patrocínio com fornecedor de chope.',
    ],
    tools: ['Excel', 'Modelagem de custos', 'Roteirização', 'Negociação'],
  },
]

/* ---------- Linha do tempo ---------- */

export type TimelineCategory = 'Produto' | 'Negócios' | 'Formação'

export type Milestone = {
  date: string
  year: number
  title: string
  category: TimelineCategory
  text: string
  status?: 'agora' | 'previsto'
}

export const timeline: Milestone[] = [
  {
    date: 'ago/2022',
    year: 2022,
    title: 'Fundo a Oasis Beach',
    category: 'Negócios',
    text: 'Arena de beach tennis, vôlei de praia e futevôlei em Sorocaba. Assumo estratégia, finanças, comercial e operação desde o primeiro dia.',
  },
  {
    date: 'set/2022',
    year: 2022,
    title: 'Entro na UFABC',
    category: 'Formação',
    text: 'Bacharelado em Ciência e Tecnologia, no período noturno, em paralelo com a arena.',
  },
  {
    date: 'ago/2024',
    year: 2024,
    title: 'Cofundo a Bremen Bier',
    category: 'Negócios',
    text: 'Distribuidora de bebidas. Modelo de custo de frete com rentabilidade por cliente e ferramenta de roteirização de entregas.',
  },
  {
    date: '2025',
    year: 2025,
    title: 'Oasis campeã do InterArenas',
    category: 'Negócios',
    text: 'A arena vence o maior torneio entre arenas do Brasil.',
  },
  {
    date: 'nov/2025',
    year: 2025,
    title: 'Começo o RankUp',
    category: 'Produto',
    text: 'SaaS de gestão de torneios. Desenho o modelo de receita e os pagamentos com split, e coloco o PWA em produção.',
  },
  {
    date: 'dez/2025',
    year: 2025,
    title: 'Primeiro torneio no RankUp',
    category: 'Produto',
    text: 'Daí em diante, a plataforma rodou 38 torneios de 13 organizadores em 6 cidades.',
  },
  {
    date: '2026',
    year: 2026,
    title: 'Oasis App',
    category: 'Produto',
    text: 'PRD de 17 seções e implementação com React e Supabase de um sistema de check-in e créditos para alunos.',
  },
  {
    date: 'jun/2026',
    year: 2026,
    title: 'Estalo',
    category: 'Produto',
    text: 'Conceito de app de microaprendizagem para o ENEM: identidade, PRD, cinco telas e protótipo interativo.',
  },
  {
    date: 'out/2026',
    year: 2026,
    title: 'Oktoberfest Votorantim',
    category: 'Negócios',
    text: 'Presença da Bremen Bier no evento e negociação de patrocínio com fornecedor de chope.',
    status: 'agora',
  },
  {
    date: 'nov/2026',
    year: 2026,
    title: 'Copa Oasis entre Indústrias',
    category: 'Negócios',
    text: 'Torneio de vôlei de praia entre empresas da região, com inscrição automatizada e pagamento por PIX.',
    status: 'previsto',
  },
  {
    date: 'dez/2027',
    year: 2027,
    title: 'Conclusão do BCT',
    category: 'Formação',
    text: 'Bacharelado em Ciência e Tecnologia pela UFABC.',
    status: 'previsto',
  },
  {
    date: 'set/2028',
    year: 2028,
    title: 'Conclusão em Neurociência',
    category: 'Formação',
    text: 'Bacharelado em Neurociência pela UFABC.',
    status: 'previsto',
  },
]

/* ---------- Formação e competências ---------- */

export const education = {
  school: 'Universidade Federal do ABC (UFABC)',
  place: 'São Bernardo do Campo, SP. Período noturno.',
  courses: [
    { name: 'Bacharelado em Ciência e Tecnologia', when: 'set/2022 a dez/2027 (previsto)' },
    { name: 'Bacharelado em Neurociência', when: 'conclusão prevista em set/2028' },
  ],
  note: 'Formação interdisciplinar em biologia, física e matemática, com foco em análise de dados.',
}

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Produto',
    items: ['PRDs', 'Monetização e precificação', 'Escopo de MVP', 'Prototipação', 'Design systems'],
  },
  {
    group: 'Tecnologia',
    items: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
      'PWA',
      'Cloudflare',
      'Git e GitHub',
      'Google Apps Script',
      'Claude Code e Lovable',
    ],
  },
  {
    group: 'Dados e finanças',
    items: ['Modelos de custo em Excel', 'Simulações econômicas', 'Rentabilidade por cliente', 'Análise de contratos'],
  },
  {
    group: 'Gestão',
    items: ['Operação de negócio físico', 'Desenho de processos', 'Eventos esportivos', 'Negociação com parceiros'],
  },
  {
    group: 'Pesquisa',
    items: ['Métodos experimentais', 'Psicometria', 'Análise do comportamento', 'Redação científica'],
  },
]

export const languages = [
  { name: 'Português', level: 'nativo' },
  { name: 'Inglês', level: 'avançado' },
]

export const interests =
  'Esportes de praia, programação, resolução de problemas, videogames, carros e viagens.'
