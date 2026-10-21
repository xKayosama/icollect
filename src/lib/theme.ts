export type Theme = 'light' | 'dark'
export const themeStorageKey = 'icollect-theme'

export function getSavedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(themeStorageKey)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}
