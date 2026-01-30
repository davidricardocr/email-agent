import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../store/settingsStore'
import type { Language } from '@shared/types'

export const useI18n = () => {
  const { language, updateSettings } = useSettingsStore()
  const { t, i18n } = useTranslation()
  
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])
  
  const changeLanguage = (newLanguage: Language) => {
    updateSettings({ language: newLanguage })
  }
  
  return { t, language, changeLanguage }
}
