import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export const useTheme = () => {
  const { theme, updateSettings } = useSettingsStore()
  
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateSettings({ theme: newTheme })
  }
  
  const setTheme = (newTheme: 'light' | 'dark') => {
    updateSettings({ theme: newTheme })
  }
  
  return { theme, toggleTheme, setTheme }
}
