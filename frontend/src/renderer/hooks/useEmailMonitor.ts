import { useEffect, useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { useNotificationStore } from '../store/notificationStore'
import { emailsApi } from '../api/emails'
import { agentApi } from '../api/agent'

export const useEmailMonitor = () => {
  const { checkInterval, notificationsEnabled, isConfigured } = useSettingsStore()
  const { addNotification } = useNotificationStore()
  
  const checkForNewEmails = useCallback(async () => {
    if (!isConfigured || !notificationsEnabled) return
    
    try {
      const response = await emailsApi.checkEmails()
      
      if (response.new_emails_count > 0) {
        // Process each new email
        for (const email of response.emails) {
          try {
            // Get AI summary
            const summary = await agentApi.summarizeEmail(email.id)
            addNotification(email, summary)
          } catch (error) {
            console.error('Failed to summarize email:', error)
            // Add notification without summary
            addNotification(email)
          }
        }
      }
    } catch (error) {
      console.error('Failed to check emails:', error)
    }
  }, [isConfigured, notificationsEnabled, addNotification])
  
  useEffect(() => {
    if (!isConfigured || !notificationsEnabled) return
    
    // Check immediately on mount
    checkForNewEmails()
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkForNewEmails, checkInterval * 1000)
    
    return () => {
      clearInterval(intervalId)
    }
  }, [checkForNewEmails, checkInterval, isConfigured, notificationsEnabled])
  
  return { checkForNewEmails }
}
