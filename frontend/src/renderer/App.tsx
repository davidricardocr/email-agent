import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './components/Landing/LandingPage'
import { ConfigurationWizard } from './components/Landing/ConfigurationWizard'
import { NotificationPopup } from './components/Notification'
import { ResponseViewer, ResponseEditor } from './components/Response'
import { useSettingsStore } from './store/settingsStore'
import { useNotificationStore } from './store/notificationStore'
import { useEmailStore } from './store/emailStore'
import { useTheme, useEmailMonitor } from './hooks'
import './i18n/config'

type ResponseMode = 'none' | 'viewing' | 'editing'

// Main App component
const MainApp: React.FC = () => {
  const { checkForNewEmails } = useEmailMonitor()
  const { currentNotification } = useNotificationStore()
  const { currentEmail, setCurrentEmail, clearCurrent } = useEmailStore()
  const [responseMode, setResponseMode] = useState<ResponseMode>('none')

  const handlePrepareResponse = () => {
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
    <div className="min-h-screen bg-bg-primary text-text-primary p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Email Agent</h1>
        <p className="text-text-secondary mb-4">
          Your AI-powered email assistant is running!
        </p>
        <p className="text-sm text-text-secondary">
          Monitoring inbox for new emails...
        </p>
      </div>

      {/* Notification Popup */}
      {currentNotification && responseMode === 'none' && (
        <NotificationPopup onPrepareResponse={handlePrepareResponse} />
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
