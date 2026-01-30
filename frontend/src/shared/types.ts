/**
 * Shared types between main and renderer processes
 */

export interface Email {
  id: string
  message_id: string
  from: string
  to: string[]
  cc: string[]
  subject: string
  body: string
  html_body: string | null
  date: string
  is_read: boolean
  is_flagged: boolean
  has_attachments: boolean
  attachments: EmailAttachment[]
  in_reply_to: string | null
  references: string[]
}

export interface EmailAttachment {
  filename: string
  content_type: string
  size: number
}

export interface EmailSummary {
  email_id: string
  summary: string
  key_points: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  priority: 'low' | 'medium' | 'high'
  action_required: boolean
  suggested_actions: string[]
}

export interface GeneratedReply {
  email_id: string
  reply_text: string
  tone: EmailTone
  char_count: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export type EmailTone = 'formal' | 'casual' | 'friendly' | 'professional'
export type Language = 'en' | 'es'
export type Theme = 'light' | 'dark'

export interface UserSettings {
  emailTone: EmailTone
  theme: Theme
  language: Language
  notificationsEnabled: boolean
  notificationSound: boolean
  checkInterval: number
  isConfigured: boolean
  firstLaunch: boolean
  emailAddress?: string
  lastSync?: string
}

export interface CheckEmailsResponse {
  new_emails_count: number
  emails: Email[]
  last_check: string
}

export interface GenerateReplyRequest {
  email_id: string
  tone: EmailTone
  additional_context?: string
}

export interface RefineReplyRequest {
  email_id: string
  current_draft: string
  user_feedback: string
}

export interface RefineReplyResponse {
  refined_text: string
  char_count: number
}

export interface ChatRefineRequest {
  conversation_history: ChatMessage[]
  user_message: string
}

export interface ChatRefineResponse {
  response: string
  updated_history: ChatMessage[]
}

export interface SendEmailRequest {
  draft: {
    to: string[]
    cc?: string[]
    subject: string
    body: string
    in_reply_to?: string
    references?: string[]
  }
}
