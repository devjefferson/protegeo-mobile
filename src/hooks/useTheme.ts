import { useState, useEffect } from 'react'

export type ThemeMode = 'dark' | 'system'

const THEME_STORAGE_KEY = 'protegeo-theme'

const applyTheme = (mode: ThemeMode) => {
  const html = document.documentElement
  
  if (mode === 'system') {
    // Remover classes e deixar o sistema decidir
    html.classList.remove('ion-theme-dark', 'ion-theme-light')
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      html.classList.add('ion-theme-dark')
    } else {
      html.classList.add('ion-theme-light')
    }
  } else if (mode === 'dark') {
    html.classList.remove('ion-theme-light')
    html.classList.add('ion-theme-dark')
  }
}

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Carregar do localStorage ou usar 'system' como padrão
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    const initialTheme = savedTheme || 'system'
    // Aplicar tema inicial
    applyTheme(initialTheme)
    return initialTheme
  })

  useEffect(() => {
    // Aplicar tema quando mudar
    applyTheme(theme)
    // Salvar no localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)

    // Se estiver em modo system, ouvir mudanças na preferência do sistema
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        applyTheme('system')
      }
      
      // Adicionar listener (suporta addEventListener e addListener)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback para navegadores antigos
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [theme])

  const toggleTheme = () => {
    // Alternar apenas entre 'system' e 'dark'
    if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode)
  }

  // Obter o tema atual efetivo (light ou dark)
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  return {
    theme,
    currentTheme: getCurrentTheme(),
    toggleTheme,
    setThemeMode,
  }
}

