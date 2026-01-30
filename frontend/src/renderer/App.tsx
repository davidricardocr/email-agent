import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './components/Landing/LandingPage'
import { ConfigurationWizard } from './components/Landing/ConfigurationWizard'
import { NotificationPopup } from './components/Notification'
import { ResponseViewer, ResponseEditor } from './components/Response'
import { InboxView } from './components/Inbox'
import { SettingsPanel } from './components/Settings'
import { Button } from './components/ui'
import { useSettingsStore } from './store/settingsStore'
import { useNotificationStore } from './store/notificationStore'
import { useEmailStore } from './store/emailStore'
import { useTheme, useEmailMonitor, useI18n } from './hooks'
import type { Email } from '@shared/types'
import './i18n/config'

type ResponseMode = 'none' | 'viewing' | 'editing'
type ViewMode = 'inbox' | 'settings'

// Main App component
const MainApp: React.FC = () => {
  const { checkForNewEmails } = useEmailMonitor()
  const { currentNotification } = useNotificationStore()
  const { currentEmail, setCurrentEmail, clearCurrent } = useEmailStore()
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const [responseMode, setResponseMode] = useState<ResponseMode>('none')
  const [viewMode, setViewMode] = useState<ViewMode>('inbox')

  const handlePrepareResponse = (email: Email) => {
    setCurrentEmail(email)
    setResponseMode('viewing')
  }

  const handlePrepareResponseFromNotification = () => {
    if (currentNotification) {
      setCurrentEmail(currentNotification.email, currentNotification.summary)
      setResponseMode('viewing')
    }
  }

  const handleEditDraft = () => {
    setResponseMode('editing')
  }

  const handleBackToViewer = () => {
    setResponseMode('viewing')
  }

  const handleCancel = () => {
    setResponseMode('none')
    clearCurrent()
  }

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary">
      {/* Header */}
      <div className="border-b border-border-color px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">Email Agent</h1>
          <nav className="flex space-x-1">
            <Button
              variant={viewMode === 'inbox' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('inbox')}
            >
              Inbox
            </Button>
            <Button
              variant={viewMode === 'settings' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('settings')}
            >
              Settings
            </Button>
          </nav>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'inbox' ? (
          <InboxView onPrepareResponse={handlePrepareResponse} />
        ) : (
          <SettingsPanel />
        )}
      </div>

      {/* Notification Popup */}
      {currentNotification && responseMode === 'none' && (
        <NotificationPopup onPrepareResponse={handlePrepareResponseFromNotification} />
      )}

      {/* Response Viewer */}
      {responseMode === 'viewing' && currentEmail && (
        <ResponseViewer onEdit={handleEditDraft} onCancel={handleCancel} />
      )}

      {/* Response Editor */}
      {responseMode === 'editing' && currentEmail && (
        <ResponseEditor onBack={handleBackToViewer} onCancel={handleCancel} />
      )}
    </div>
  )
}

// Protected route that requires configuration
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured } = useSettingsStore()

  if (!isConfigured) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// Main App Router
function App() {
  const { firstLaunch, isConfigured } = useSettingsStore()
  const { theme } = useTheme()

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - shown on first launch or not configured */}
        <Route
          path="/"
          element={
            isConfigured ? (
              <Navigate to="/app" replace />
            ) : firstLaunch ? (
              <LandingPage />
            ) : (
              <Navigate to="/config" replace />
            )
          }
        />

        {/* Configuration Wizard */}
        <Route path="/config" element={<ConfigurationWizard />} />

        {/* Main Application */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
