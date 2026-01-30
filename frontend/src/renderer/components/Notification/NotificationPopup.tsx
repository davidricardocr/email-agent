import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui'
import { useI18n } from '../../hooks'
import { useNotificationStore } from '../../store/notificationStore'
import { useEmailStore } from '../../store/emailStore'
import { EmailSummary } from './EmailSummary'

export const NotificationPopup: React.FC = () => {
  const { t } = useI18n()
  const { currentNotification, dismissCurrent } = useNotificationStore()
  const { setCurrentEmail } = useEmailStore()
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (currentNotification) {
      setIsExpanded(false)
    }
  }, [currentNotification])

  const handlePrepareResponse = () => {
    if (currentNotification) {
      setCurrentEmail(currentNotification.email, currentNotification.summary)
      dismissCurrent()
    }
  }

  const handleDismiss = () => {
    dismissCurrent()
  }

  if (!currentNotification) return null

  const { email, summary } = currentNotification
  const sender = email.from.split('@')[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 z-50"
        style={{ maxWidth: '400px' }}
      >
        <div className="bg-bg-primary border-2 border-accent rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-accent px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-semibold">
                {t('notification.newEmail', { sender })}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="text-sm text-text-secondary mb-1">
                {t('summary.subject')}
              </div>
              <div className="font-semibold text-text-primary line-clamp-2">
                {email.subject}
              </div>
            </div>

            {summary && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-3"
              >
                <EmailSummary summary={summary} />
              </motion.div>
            )}

            {summary && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-accent hover:text-accent-hover font-medium mb-3"
              >
                {isExpanded ? '↑ Hide Summary' : '↓ Show Summary'}
              </button>
            )}

            <div className="flex space-x-2">
              <Button variant="primary" size="sm" onClick={handlePrepareResponse} className="flex-1">
                {t('notification.prepareResponse')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDismiss} className="flex-1">
                {t('notification.dismiss')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
