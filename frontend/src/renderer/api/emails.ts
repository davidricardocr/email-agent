import { apiClient } from './client'
import type { Email, CheckEmailsResponse, SendEmailRequest } from '@shared/types'

export const emailsApi = {
  // Check for new emails
  checkEmails: async (limit: number = 20): Promise<CheckEmailsResponse> => {
    const response = await apiClient.post(`/api/emails/check?limit=${limit}`)
    return response.data
  },

  // List unread emails
  listEmails: async (limit: number = 20): Promise<Email[]> => {
    const response = await apiClient.get(`/api/emails/?limit=${limit}`)
    return response.data
  },

  // Get specific email
  getEmail: async (emailId: string): Promise<Email> => {
    const response = await apiClient.get(`/api/emails/${emailId}`)
    return response.data
  },

  // Mark email as read
  markAsRead: async (emailId: string): Promise<void> => {
    await apiClient.post(`/api/emails/${emailId}/mark-read`)
  },

  // Mark email as unread
  markAsUnread: async (emailId: string): Promise<void> => {
    await apiClient.post(`/api/emails/${emailId}/mark-unread`)
  },

  // Send email
  sendEmail: async (request: SendEmailRequest): Promise<void> => {
    await apiClient.post('/api/emails/send', request)
  }
}
