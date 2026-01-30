import { create } from 'zustand'
import type { Email, EmailSummary } from '@shared/types'

interface EmailNotification {
  email: Email
  summary?: EmailSummary
  timestamp: number
}

interface NotificationState {
  queue: EmailNotification[]
  currentNotification: EmailNotification | null
  
  addNotification: (email: Email, summary?: EmailSummary) => void
  removeNotification: (emailId: string) => void
  showNext: () => void
  dismissCurrent: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  queue: [],
  currentNotification: null,

  addNotification: (email, summary) => {
    const notification: EmailNotification = {
      email,
      summary,
      timestamp: Date.now()
    }

    set((state) => {
      const newQueue = [...state.queue, notification]
      
      // If no current notification, show this one immediately
      if (!state.currentNotification) {
        return {
          queue: newQueue.slice(1),
          currentNotification: notification
        }
      }
      
      return { queue: newQueue }
    })
  },

  removeNotification: (emailId) => {
    set((state) => ({
      queue: state.queue.filter((n) => n.email.id !== emailId),
      currentNotification:
        state.currentNotification?.email.id === emailId
          ? null
          : state.currentNotification
    }))
  },

  showNext: () => {
    set((state) => {
      if (state.queue.length === 0) {
        return { currentNotification: null }
      }
      
      const [next, ...rest] = state.queue
      return {
        queue: rest,
        currentNotification: next
      }
    })
  },

  dismissCurrent: () => {
    const { showNext } = get()
    showNext()
  },

  clearAll: () => {
    set({ queue: [], currentNotification: null })
  }
}))
