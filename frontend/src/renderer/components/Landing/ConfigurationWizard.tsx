import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, Select } from '../ui'
import { useI18n, useTheme } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import type { EmailTone, Language, Theme } from '@shared/types'

export const ConfigurationWizard: React.FC = () => {
  const { t, language, changeLanguage } = useI18n()
  const { theme, setTheme } = useTheme()
  const { updateSettings } = useSettingsStore()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [tone, setTone] = useState<EmailTone>('professional')
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme)
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)
  const [interval, setInterval] = useState(60)

  const steps = [
    { key: 'tone', title: t('config.step1') },
    { key: 'preferences', title: t('config.step2') },
    { key: 'finish', title: t('config.step3') }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    // Save all settings
    updateSettings({
      emailTone: tone,
      theme: selectedTheme,
      language: selectedLanguage,
      notificationsEnabled: notifications,
      notificationSound: sound,
      checkInterval: interval,
      isConfigured: true,
      firstLaunch: false
    })

    // Apply theme and language
    setTheme(selectedTheme)
    changeLanguage(selectedLanguage)

    // Navigate to main app
    navigate('/app')
  }

  const toneOptions: EmailTone[] = ['formal', 'casual', 'friendly', 'professional']

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full">
        <Card>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      index <= currentStep
                        ? 'bg-accent border-accent text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 ml-2">
                    <p className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-accent' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <CardContent>
            {/* Step 1: Tone Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('config.tone.title')}</h2>
                  <p className="text-gray-600">{t('config.tone.description')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {toneOptions.map((toneOption) => (
                    <button
                      key={toneOption}
                      onClick={() => setTone(toneOption)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        tone === toneOption ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold mb-1">{t(`config.tone.${toneOption}`)}</h3>
                      <p className="text-sm text-gray-600">{t(`config.tone.${toneOption}Desc`)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Preferences */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('config.preferences.language')}</h2>
                </div>

                <Select
                  label={t('config.preferences.language')}
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' }
                  ]}
                />

                <Select
                  label={t('config.preferences.theme')}
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value as Theme)}
                  options={[
                    { value: 'light', label: t('config.preferences.light') },
                    { value: 'dark', label: t('config.preferences.dark') }
                  ]}
                />

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span>{t('config.preferences.notifications')}</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={sound}
                      onChange={(e) => setSound(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span>{t('config.preferences.sound')}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('config.preferences.interval')}
                  </label>
                  <input
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                    min={30}
                    max={300}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Finish */}
            {currentStep === 2 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('config.finish.title')}</h2>
                  <p className="text-gray-600">{t('config.finish.description')}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                ← {t('config.back')}
              </Button>

              <Button variant="primary" onClick={handleNext}>
                {currentStep === steps.length - 1 ? t('config.finish.start') : `${t('config.next')} →`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
