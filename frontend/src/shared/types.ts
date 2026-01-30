/**
 * Shared types between main and renderer processes
 */

export interface Email {
  id: string
  from: string
  to: string
  subject: string
  body: string
  date: string
  read: boolean
  hasAttachments: boolean
}

export interface EmailSummary {
  emailId: string
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  priority: 'low' | 'medium' | 'high'
}

export interface GeneratedReply {
  replyText: string
  confidence: number
  tone: 'formal' | 'casual' | 'friendly'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AppSettings {
  email: {
    address: string
    imapServer: string
    imapPort: number
    smtpServer: string
    smtpPort: number
  }
  llm: {
    provider: 'anthropic' | 'openai'
    model: string
    temperature: number
  }
  app: {
    checkInterval: number
    notificationsEnabled: boolean
    autoStart: boolean
  }
}
