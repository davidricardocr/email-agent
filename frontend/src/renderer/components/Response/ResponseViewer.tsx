import React, { useState, useEffect } from 'react'
import { Button, LoadingSpinner } from '../ui'
import { useI18n } from '../../hooks'
import { useEmailStore } from '../../store/emailStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useNotificationStore } from '../../store/notificationStore'
import { agentApi } from '../../api/agent'
import { emailsApi } from '../../api/emails'

interface ResponseViewerProps {
  onEdit: () => void
  onCancel: () => void
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ onEdit, onCancel }) => {
  const { t } = useI18n()
  const { currentEmail, currentDraft, setDraft, setGenerating, setError, isGenerating } = useEmailStore()
  const { emailTone } = useSettingsStore()
  const { dismissCurrent } = useNotificationStore()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    if (currentEmail && !currentDraft && !isGenerating) {
      generateDraft()
    }
  }, [currentEmail])

  const generateDraft = async () => {
    if (!currentEmail) return

    setGenerating(true)
    setError(null)

    try {
      const response = await agentApi.generateReply({
        email_id: currentEmail.id,
        tone: emailTone
      })
      setDraft(response.reply_text)
    } catch (error) {
      console.error('Failed to generate reply:', error)
      setError(t('errors.apiError'))
    } finally {
      setGenerating(false)
    }
  }

  const handleSend = () => {
    setShowConfirm(true)
  }

  const handleConfirmSend = async () => {
    if (!currentEmail || !currentDraft) return

    setIsSending(true)
    setSendError(null)

    try {
      // Build the reply email
      const replySubject = currentEmail.subject.startsWith('Re:')
        ? currentEmail.subject
        : `Re: ${currentEmail.subject}`

      const references = [
        ...currentEmail.references,
        currentEmail.message_id
      ].filter(Boolean)

      await emailsApi.sendEmail({
        draft: {
          to: [currentEmail.from],
          cc: currentEmail.cc,
          subject: replySubject,
          body: currentDraft,
          in_reply_to: currentEmail.message_id,
          references
        }
      })

      // Mark original email as read
      await emailsApi.markAsRead(currentEmail.id)

      // Dismiss notification and close modal
      dismissCurrent()
      onCancel()
    } catch (error) {
      console.error('Failed to send email:', error)
      setSendError(t('errors.sendFailed'))
      setShowConfirm(false)
    } finally {
      setIsSending(false)
    }
  }

  if (!currentEmail) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-300 dark:border-gray-600">
        <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 border-b border-blue-700">
          <h2 className="text-xl font-bold text-white">{t('response.draft')}</h2>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-800">
          {sendError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{sendError}</p>
            </div>
          )}

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">{t('response.generating')}</p>
            </div>
          ) : currentDraft ? (
            <div>
              <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 mb-4 border border-gray-300 dark:border-gray-600">
                <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 leading-relaxed">{currentDraft}</pre>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {t('response.charCount', { count: currentDraft.length })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">{t('errors.unknown')}</p>
              <Button onClick={generateDraft}>{t('common.retry')}</Button>
            </div>
          )}
        </div>

        <div className="border-t-2 border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between bg-gray-50 dark:bg-slate-900">
          <Button variant="outline" onClick={onCancel}>
            {t('response.cancel')}
          </Button>
          <div className="space-x-2">
            <Button variant="secondary" onClick={onEdit} disabled={!currentDraft || isGenerating}>
              {t('response.edit')}
            </Button>
            <Button variant="primary" onClick={handleSend} disabled={!currentDraft || isGenerating}>
              {t('response.send')}
            </Button>
          </div>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center rounded-xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md shadow-2xl border-2 border-gray-300 dark:border-gray-600">
              <p className="text-gray-900 dark:text-gray-100 mb-6 font-medium text-lg">{t('response.sendConfirm')}</p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isSending}>
                  {t('common.no')}
                </Button>
                <Button variant="primary" onClick={handleConfirmSend} isLoading={isSending} disabled={isSending}>
                  {t('common.yes')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
