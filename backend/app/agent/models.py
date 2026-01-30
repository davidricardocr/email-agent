"""Models for agent API requests and responses."""

from pydantic import BaseModel, Field

from app.agent.prompts import EmailTone


class GenerateReplyRequest(BaseModel):
    """Request to generate an email reply."""

    email_id: str = Field(..., description="ID of the email to reply to")
    tone: EmailTone = Field(
        default=EmailTone.PROFESSIONAL,
        description="Desired tone for the response"
    )
    additional_context: str = Field(
        default="",
        description="Additional instructions or context for the reply"
    )


class GenerateReplyResponse(BaseModel):
    """Response containing generated email reply."""

    email_id: str
    reply_text: str
    tone: EmailTone
    char_count: int = Field(..., description="Character count of the reply")


class RefineReplyRequest(BaseModel):
    """Request to refine an existing reply."""

    email_id: str = Field(..., description="ID of the original email")
    current_draft: str = Field(..., description="Current draft of the reply")
    user_feedback: str = Field(..., description="User's feedback on what to change")


class RefineReplyResponse(BaseModel):
    """Response containing refined email reply."""

    refined_text: str
    char_count: int


class ChatMessage(BaseModel):
    """A message in the chat conversation."""

    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRefineRequest(BaseModel):
    """Request for chat-based refinement."""

    conversation_history: list[ChatMessage] = Field(
        default_factory=list,
        description="Previous messages in the conversation"
    )
    user_message: str = Field(..., description="New message from the user")


class ChatRefineResponse(BaseModel):
    """Response from chat refinement."""

    response: str
    updated_history: list[ChatMessage] = Field(
        ...,
        description="Updated conversation history including the new exchange"
    )


class SummarizeEmailRequest(BaseModel):
    """Request to summarize an email."""

    email_id: str = Field(..., description="ID of the email to summarize")


# EmailSummary is already defined in email.models, so we'll import that
