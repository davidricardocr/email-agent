import React, { useState, useEffect } from 'react'
import { Button, LoadingSpinner, Card, CardContent } from '../ui'
import { useI18n } from '../../hooks'
import { useEmailStore } from '../../store/emailStore'
import { useNotificationStore } from '../../store/notificationStore'
import { emailsApi } from '../../api/emails'
import { agentApi } from '../../api/agent'
import type { Email } from '@shared/types'

interface InboxViewProps {
  onPrepareResponse: (email: Email) => void
}

export const InboxView: React.FC<InboxViewProps> = ({ onPrepareResponse }) => {
  const { t } = useI18n()
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    console.log('[InboxView] Loading emails...')
    setIsLoading(true)
    try {
      const result = await emailsApi.listEmails(50)
      console.log('[InboxView] API response:', result)
      console.log('[InboxView] Number of emails:', result?.length || 0)
      setEmails(result)
      console.log('[InboxView] Emails state updated')
    } catch (error) {
      console.error('[InboxView] Failed to load emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await emailsApi.checkEmails(50)
      await loadEmails()
    } catch (error) {
      console.error('Failed to refresh emails:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
  }

  const handleMarkAsRead = async (emailId: string) => {
    try {
      await emailsApi.markAsRead(emailId)
      setEmails(emails.map(e => e.id === emailId ? { ...e, is_read: true } : e))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail({ ...selectedEmail, is_read: true })
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handlePrepareResponse = () => {
    if (selectedEmail) {
      onPrepareResponse(selectedEmail)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Email List */}
      <div className="w-96 border-r border-border-color overflow-y-auto">
        <div className="p-4 border-b border-border-color flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-primary">
            Inbox ({emails.filter(e => !e.is_read).length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            disabled={isRefreshing}
          >
            ↻ Refresh
          </Button>
        </div>

        <div className="divide-y divide-border-color">
          {emails.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No emails found
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 cursor-pointer hover:bg-bg-secondary transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-bg-secondary' : ''
                } ${!email.is_read ? 'font-semibold' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm text-text-primary truncate flex-1">
                    {email.from}
                  </span>
                  <span className="text-xs text-text-secondary ml-2 whitespace-nowrap">
                    {formatDate(email.date)}
                  </span>
                </div>
                <div className="text-sm text-text-primary truncate mb-1">
                  {email.subject}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {email.body.substring(0, 100)}...
                </div>
                {!email.is_read && (
                  <div className="inline-block mt-2 px-2 py-0.5 bg-accent text-white text-xs rounded">
                    Unread
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedEmail ? (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-4">
                {selectedEmail.subject}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    <span className="font-medium">From:</span> {selectedEmail.from}
                  </div>
                  <div className="text-sm text-text-secondary">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(selectedEmail.date).toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!selectedEmail.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(selectedEmail.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={handlePrepareResponse}>
                    Prepare Response
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <CardContent>
                <div className="prose max-w-none">
                  {selectedEmail.html_body ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html_body }} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-text-primary">
                      {selectedEmail.body}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary">Select an email to read</p>
          </div>
        )}
      </div>
    </div>
  )
}
