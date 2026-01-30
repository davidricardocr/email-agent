import { create } from 'zustand'
import type { Email, EmailSummary, ChatMessage } from '@shared/types'

interface EmailState {
  currentEmail: Email | null
  currentSummary: EmailSummary | null
  currentDraft: string | null
  conversationHistory: ChatMessage[]
  isGenerating: boolean
  error: string | null

  setCurrentEmail: (email: Email, summary?: EmailSummary) => void
  setDraft: (draft: string) => void
  addChatMessage: (message: ChatMessage) => void
  setChatHistory: (history: ChatMessage[]) => void
  setGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  clearCurrent: () => void
}

export const useEmailStore = create<EmailState>((set) => ({
  currentEmail: null,
  currentSummary: null,
  currentDraft: null,
  conversationHistory: [],
  isGenerating: false,
  error: null,

  setCurrentEmail: (email, summary) =>
    set({
      currentEmail: email,
      currentSummary: summary,
      currentDraft: null,
      conversationHistory: [],
      error: null
    }),

  setDraft: (draft) =>
    set({ currentDraft: draft }),

  addChatMessage: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message]
    })),

  setChatHistory: (history) =>
    set({ conversationHistory: history }),

  setGenerating: (isGenerating) =>
    set({ isGenerating }),

  setError: (error) =>
    set({ error }),

  clearCurrent: () =>
    set({
      currentEmail: null,
      currentSummary: null,
      currentDraft: null,
      conversationHistory: [],
      isGenerating: false,
      error: null
    })
}))
