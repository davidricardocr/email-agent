import React, { useState } from 'react'
import { Button, Card, CardContent, Select } from '../ui'
import { useI18n, useTheme } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import type { EmailTone, Language, Theme } from '@shared/types'

export const SettingsPanel: React.FC = () => {
  const { t, language, changeLanguage } = useI18n()
  const { theme, setTheme } = useTheme()
  const { emailTone, notificationsEnabled, notificationSound, checkInterval, updateSettings } =
    useSettingsStore()

  const [localTone, setLocalTone] = useState<EmailTone>(emailTone)
  const [localLanguage, setLocalLanguage] = useState<Language>(language)
  const [localTheme, setLocalTheme] = useState<Theme>(theme)
  const [localNotifications, setLocalNotifications] = useState(notificationsEnabled)
  const [localSound, setLocalSound] = useState(notificationSound)
  const [localInterval, setLocalInterval] = useState(checkInterval)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = () => {
    setHasChanges(true)
  }

  const handleSave = () => {
    updateSettings({
      emailTone: localTone,
      theme: localTheme,
      language: localLanguage,
      notificationsEnabled: localNotifications,
      notificationSound: localSound,
      checkInterval: localInterval
    })

    setTheme(localTheme)
    changeLanguage(localLanguage)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalTone(emailTone)
    setLocalLanguage(language)
    setLocalTheme(theme)
    setLocalNotifications(notificationsEnabled)
    setLocalSound(notificationSound)
    setLocalInterval(checkInterval)
    setHasChanges(false)
  }

  const toneOptions: EmailTone[] = ['formal', 'casual', 'friendly', 'professional']

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-text-primary">{t('settings.title')}</h2>

      <div className="space-y-6">
        {/* Email Preferences */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Email Preferences</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">
                  Default Email Tone
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => {
                        setLocalTone(tone)
                        handleChange()
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        localTone === tone
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-text-primary">
                        {t(`config.tone.${tone}`)}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {t(`config.tone.${tone}Desc`)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Appearance</h3>

            <div className="space-y-4">
              <Select
                label={t('config.preferences.theme')}
                value={localTheme}
                onChange={(e) => {
                  setLocalTheme(e.target.value as Theme)
                  handleChange()
                }}
                options={[
                  { value: 'light', label: t('config.preferences.light') },
                  { value: 'dark', label: t('config.preferences.dark') }
                ]}
              />

              <Select
                label={t('config.preferences.language')}
                value={localLanguage}
                onChange={(e) => {
                  setLocalLanguage(e.target.value as Language)
                  handleChange()
                }}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Notifications</h3>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localNotifications}
                  onChange={(e) => {
                    setLocalNotifications(e.target.checked)
                    handleChange()
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-text-primary">{t('config.preferences.notifications')}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localSound}
                  onChange={(e) => {
                    setLocalSound(e.target.checked)
                    handleChange()
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-text-primary">{t('config.preferences.sound')}</span>
              </label>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">
                  {t('config.preferences.interval')}
                </label>
                <input
                  type="number"
                  value={localInterval}
                  onChange={(e) => {
                    setLocalInterval(Number(e.target.value))
                    handleChange()
                  }}
                  min={30}
                  max={300}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-bg-primary text-text-primary"
                />
                <p className="text-xs text-text-secondary mt-1">
                  How often to check for new emails (30-300 seconds)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {hasChanges && (
          <div className="flex justify-end space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Button variant="outline" onClick={handleReset}>
              {t('settings.reset')}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {t('settings.save')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
