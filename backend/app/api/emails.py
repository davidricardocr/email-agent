"""API routes for email operations."""

import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.email.imap_client import IMAPClient
from app.email.models import CheckEmailsResponse, Email, EmailDraft, SendEmailRequest
from app.email.smtp_client import SMTPClient

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.get("/", response_model=list[Email])
async def list_emails(limit: int = 20):
    """
    List unread emails from inbox.

    Args:
        limit: Maximum number of emails to return (default: 20)

    Returns:
        List of unread emails
    """
    try:
        with IMAPClient(settings) as imap:
            emails = imap.fetch_unread_emails(limit=limit)
            return emails
    except Exception as e:
        logger.error(f"Error listing emails: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch emails: {str(e)}"
        )


@router.post("/check", response_model=CheckEmailsResponse)
async def check_emails(limit: int = 20):
    """
    Check for new emails.

    Args:
        limit: Maximum number of emails to return (default: 20)

    Returns:
        New emails and count
    """
    try:
        with IMAPClient(settings) as imap:
            emails = imap.fetch_unread_emails(limit=limit)

            return CheckEmailsResponse(
                new_emails_count=len(emails),
                emails=emails,
                last_check=datetime.now()
            )
    except Exception as e:
        logger.error(f"Error checking emails: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check emails: {str(e)}"
        )


@router.get("/{email_id}", response_model=Email)
async def get_email(email_id: str):
    """
    Get a specific email by ID.

    Args:
        email_id: Email ID (IMAP UID)

    Returns:
        Email details
    """
    try:
        with IMAPClient(settings) as imap:
            email_obj = imap.fetch_email_by_id(email_id)

            if not email_obj:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Email {email_id} not found"
                )

            return email_obj
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching email {email_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch email: {str(e)}"
        )


@router.post("/{email_id}/mark-read")
async def mark_email_as_read(email_id: str):
    """
    Mark an email as read.

    Args:
        email_id: Email ID (IMAP UID)

    Returns:
        Success message
    """
    try:
        with IMAPClient(settings) as imap:
            success = imap.mark_as_read(email_id)

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to mark email as read"
                )

            return {"message": "Email marked as read", "email_id": email_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking email as read: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark email as read: {str(e)}"
        )


@router.post("/{email_id}/mark-unread")
async def mark_email_as_unread(email_id: str):
    """
    Mark an email as unread.

    Args:
        email_id: Email ID (IMAP UID)

    Returns:
        Success message
    """
    try:
        with IMAPClient(settings) as imap:
            success = imap.mark_as_unread(email_id)

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to mark email as unread"
                )

            return {"message": "Email marked as unread", "email_id": email_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking email as unread: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark email as unread: {str(e)}"
        )


@router.post("/send")
async def send_email(request: SendEmailRequest):
    """
    Send an email.

    Args:
        request: Send email request with draft

    Returns:
        Success message
    """
    try:
        with SMTPClient(settings) as smtp:
            success = smtp.send_email(request.draft)

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to send email"
                )

            return {
                "message": "Email sent successfully",
                "to": request.draft.to_addresses,
                "subject": request.draft.subject
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )
