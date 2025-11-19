import { useEffect } from 'react'

export type ThemeMode = 'dark' | 'system'

const applyTheme = () => {
  const html = document.documentElement
  // Sempre forçar modo dark
  html.classList.remove('ion-theme-light')
  html.classList.add('ion-theme-dark')
}

export const useTheme = () => {
  useEffect(() => {
    // Sempre aplicar modo dark
    applyTheme()
  }, [])

  // Sempre retornar dark
  return {
    theme: 'dark' as ThemeMode,
    currentTheme: 'dark' as const,
    toggleTheme: () => {}, // Função vazia, não faz nada
    setThemeMode: () => {}, // Função vazia, não faz nada
  }
}

