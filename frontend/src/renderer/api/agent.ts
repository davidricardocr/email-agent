import { apiClient } from './client'
import type {
  GenerateReplyRequest,
  GeneratedReply,
  RefineReplyRequest,
  RefineReplyResponse,
  ChatRefineRequest,
  ChatRefineResponse,
  EmailSummary
} from '@shared/types'

export const agentApi = {
  // Generate AI reply
  generateReply: async (request: GenerateReplyRequest): Promise<GeneratedReply> => {
    const response = await apiClient.post('/api/agent/generate-reply', request)
    return response.data
  },

  // Refine reply based on feedback
  refineReply: async (request: RefineReplyRequest): Promise<RefineReplyResponse> => {
    const response = await apiClient.post('/api/agent/refine-reply', request)
    return response.data
  },

  // Chat-based refinement
  chatRefine: async (request: ChatRefineRequest): Promise<ChatRefineResponse> => {
    const response = await apiClient.post('/api/agent/chat-refine', request)
    return response.data
  },

  // Summarize email
  summarizeEmail: async (emailId: string): Promise<EmailSummary> => {
    const response = await apiClient.post('/api/agent/summarize', { email_id: emailId })
    return response.data
  }
}
