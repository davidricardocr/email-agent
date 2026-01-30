import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { useI18n, useTheme } from '../../hooks'

export const LandingPage: React.FC = () => {
  const { t } = useI18n()
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  const handleStart = () => {
    navigate('/config')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <div className="bg-bg-primary rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-12 md:px-12 md:py-16 text-center">
            {/* Icon/Logo */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {t('landing.title')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-text-secondary mb-2">
              {t('landing.subtitle')}
            </p>
            
            {/* Description */}
            <p className="text-text-secondary max-w-2xl mx-auto mb-8">
              {t('landing.description')}
            </p>
            
            {/* CTA Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {t('landing.cta')} →
            </Button>
          </div>
          
          {/* Features Section */}
          <div className="bg-bg-secondary px-8 py-10 md:px-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: AI */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-light mb-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('landing.features.ai')}
                </h3>
                <p className="text-sm text-text-secondary">
                  Generate intelligent email replies with AI
                </p>
              </div>
              
              {/* Feature 2: Smart Notifications */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-light mb-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('landing.features.smart')}
                </h3>
                <p className="text-sm text-text-secondary">
                  Get notified with smart email summaries
                </p>
              </div>
              
              {/* Feature 3: Privacy */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-light mb-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('landing.features.privacy')}
                </h3>
                <p className="text-sm text-text-secondary">
                  Runs locally, your data stays with you
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-text-secondary text-sm">
          <p>Built with LangChain • Powered by AI</p>
        </div>
      </div>
    </div>
  )
}
