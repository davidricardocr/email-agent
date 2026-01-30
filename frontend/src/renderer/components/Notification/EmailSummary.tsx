import React from 'react'
import { useI18n } from '../../hooks'
import type { EmailSummary as EmailSummaryType } from '@shared/types'

interface EmailSummaryProps {
  summary: EmailSummaryType
}

export const EmailSummary: React.FC<EmailSummaryProps> = ({ summary }) => {
  const { t } = useI18n()

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  }

  const sentimentColors = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    negative: 'text-red-600'
  }

  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-text-primary">{summary.summary}</p>
      </div>

      {summary.key_points.length > 0 && (
        <div>
          <p className="font-semibold text-text-primary mb-1">{t('summary.keyPoints')}:</p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary">
            {summary.key_points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div>
          <span className="text-text-secondary">{t('summary.priority')}: </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[summary.priority]}`}>
            {t(`summary.${summary.priority}`)}
          </span>
        </div>
        <div>
          <span className="text-text-secondary">{t('summary.sentiment')}: </span>
          <span className={`font-semibold ${sentimentColors[summary.sentiment]}`}>
            {t(`summary.${summary.sentiment}`)}
          </span>
        </div>
      </div>

      {summary.action_required && summary.suggested_actions.length > 0 && (
        <div className="border-t border-border-color pt-2">
          <p className="font-semibold text-text-primary mb-1">{t('summary.suggestedActions')}:</p>
          <ul className="list-disc list-inside space-y-1 text-text-secondary">
            {summary.suggested_actions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
