import { useEffect, useState } from 'react'
import { applyTheme, getSavedTheme, getSystemTheme, themeStorageKey, type Theme } from '@/lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme() ?? getSystemTheme())

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const next = getSavedTheme() ?? getSystemTheme()
      applyTheme(next)
      setTheme(next)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === themeStorageKey || event.key === null) sync()
    }
    system.addEventListener('change', sync)
    window.addEventListener('storage', onStorage)
    return () => {
      system.removeEventListener('change', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(themeStorageKey, next)
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
    applyTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
