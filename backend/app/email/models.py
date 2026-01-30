"""Email data models."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class EmailPriority(str, Enum):
    """Email priority levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class EmailSentiment(str, Enum):
    """Email sentiment analysis."""

    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class EmailAttachment(BaseModel):
    """Email attachment information."""

    filename: str
    content_type: str
    size: int  # bytes


class Email(BaseModel):
    """Email message model."""

    id: str = Field(..., description="Unique email ID (IMAP UID)")
    message_id: str = Field(..., description="Email Message-ID header")
    from_address: EmailStr = Field(..., alias="from")
    to_addresses: list[EmailStr] = Field(default_factory=list, alias="to")
    cc_addresses: list[EmailStr] = Field(default_factory=list, alias="cc")
    subject: str
    body: str
    html_body: Optional[str] = None
    date: datetime
    is_read: bool = False
    is_flagged: bool = False
    has_attachments: bool = False
    attachments: list[EmailAttachment] = Field(default_factory=list)
    in_reply_to: Optional[str] = None
    references: list[str] = Field(default_factory=list)

    class Config:
        populate_by_name = True


class EmailSummary(BaseModel):
    """AI-generated email summary."""

    email_id: str
    summary: str = Field(..., description="Brief summary of email content")
    key_points: list[str] = Field(default_factory=list, description="Main points")
    sentiment: EmailSentiment = EmailSentiment.NEUTRAL
    priority: EmailPriority = EmailPriority.MEDIUM
    action_required: bool = False
    suggested_actions: list[str] = Field(default_factory=list)


class EmailDraft(BaseModel):
    """Email draft for sending."""

    to_addresses: list[EmailStr] = Field(..., alias="to")
    cc_addresses: list[EmailStr] = Field(default_factory=list, alias="cc")
    subject: str
    body: str
    in_reply_to: Optional[str] = None
    references: list[str] = Field(default_factory=list)

    class Config:
        populate_by_name = True


class SendEmailRequest(BaseModel):
    """Request to send an email."""

    draft: EmailDraft


class CheckEmailsResponse(BaseModel):
    """Response from checking for new emails."""

    new_emails_count: int
    emails: list[Email]
    last_check: datetime
