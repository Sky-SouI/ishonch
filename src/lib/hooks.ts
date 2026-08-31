import { useCallback, useEffect, useState } from 'react'

/** Раскладка переключается на десктопную от 1024 пикселей. */
export const DESKTOP_QUERY = '(min-width: 1024px)'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY)
}

/**
 * Копирование ссылки на сбор. Это единственное действие «поделиться»,
 * которое в прототипе работает по-настоящему: системный шер и переходы
 * в Telegram и Instagram — заглушки.
 */
export function useCopyLink(): [boolean, () => void] {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    const url = window.location.origin + window.location.pathname
    const done = () => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done, done)
    } else {
      done()
    }
  }, [])

  return [copied, copy]
}
