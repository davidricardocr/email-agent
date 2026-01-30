import { create } from 'zustand'
import type { UserSettings } from '@shared/types'

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
  emailTone: 'professional',
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  notificationSound: true,
  checkInterval: 60,
  isConfigured: false,
  firstLaunch: true
}

interface SettingsState extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,

  updateSettings: (newSettings) =>
    set((state) => ({
      ...state,
      ...newSettings
    })),

  resetSettings: () => set(DEFAULT_SETTINGS)
}))

// Persist to localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('email-agent-settings')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      useSettingsStore.setState(parsed)
    } catch (e) {
      console.error('Failed to parse stored settings:', e)
    }
  }

  // Save to localStorage on every change
  useSettingsStore.subscribe((state) => {
    const { updateSettings, resetSettings, ...settings } = state
    localStorage.setItem('email-agent-settings', JSON.stringify(settings))
  })
}
