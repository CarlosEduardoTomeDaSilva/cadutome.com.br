import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

function readSaved(): Theme | null {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

/** Segue o tema do sistema até a pessoa escolher um manualmente. O script em index.html aplica o tema inicial. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const chosen = useRef(readSaved() !== null)

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (chosen.current) return
      const next: Theme = event.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    chosen.current = true
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Sem armazenamento (aba anônima, por exemplo): o tema vale só nesta visita.
    }
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
