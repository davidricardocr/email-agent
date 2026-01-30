import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, LoadingSpinner } from '../ui'
import { useI18n } from '../../hooks'
import { useEmailStore } from '../../store/emailStore'
import { agentApi } from '../../api/agent'

interface ResponseEditorProps {
  onBack: () => void
  onCancel: () => void
}

export const ResponseEditor: React.FC<ResponseEditorProps> = ({ onBack, onCancel }) => {
  const { t } = useI18n()
  const {
    currentEmail,
    currentDraft,
    conversationHistory,
    setDraft,
    addChatMessage,
    setChatHistory,
    isGenerating,
    setGenerating
  } = useEmailStore()

  const [userMessage, setUserMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory])

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isGenerating || !currentEmail) return

    const message = userMessage.trim()
    setUserMessage('')
    setGenerating(true)

    addChatMessage({ role: 'user', content: message })

    try {
      const response = await agentApi.chatRefine({
        conversation_history: conversationHistory,
        user_message: message
      })

      setChatHistory(response.updated_history)

      const assistantMessage = response.updated_history[response.updated_history.length - 1]
      if (assistantMessage.role === 'assistant') {
        setDraft(assistantMessage.content)
      }
    } catch (error) {
      console.error('Failed to refine reply:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const examples = [
    t('chat.examples')[0],
    t('chat.examples')[1],
    t('chat.examples')[2],
    t('chat.examples')[3]
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-bg-primary rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-accent px-6 py-4">
          <h2 className="text-xl font-bold text-white">{t('response.edit')}</h2>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto border-r border-border-color">
            <h3 className="font-semibold text-text-primary mb-2">{t('response.draft')}</h3>
            <div className="bg-bg-secondary rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-sans text-text-primary text-sm">
                {currentDraft}
              </pre>
            </div>
            <div className="text-xs text-text-secondary mt-2">
              {t('response.charCount', { count: currentDraft?.length || 0 })}
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6">
            <h3 className="font-semibold text-text-primary mb-2">{t('chat.instructions')}</h3>

            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {conversationHistory.length === 0 && (
                <div className="text-sm text-text-secondary">
                  <p className="mb-2">Examples:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {conversationHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-accent text-white ml-8'
                      : 'bg-bg-secondary text-text-primary mr-8'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center space-x-2 text-text-secondary">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">{t('chat.refining')}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userMessage.trim() || isGenerating}
                isLoading={isGenerating}
              >
                →
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border-color px-6 py-4 flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            {t('response.cancel')}
          </Button>
          <div className="space-x-2">
            <Button variant="secondary" onClick={onBack}>
              ← {t('config.back')}
            </Button>
            <Button variant="primary" onClick={() => alert('Send functionality coming soon')}>
              {t('response.send')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
