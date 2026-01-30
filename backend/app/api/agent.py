"""API routes for AI agent operations."""

import logging

from fastapi import APIRouter, HTTPException, status

from app.agent.email_agent import EmailAgent
from app.agent.models import (
    ChatRefineRequest,
    ChatRefineResponse,
    GenerateReplyRequest,
    GenerateReplyResponse,
    RefineReplyRequest,
    RefineReplyResponse,
    SummarizeEmailRequest,
    ChatMessage,
)
from app.config import get_settings
from app.email.imap_client import IMAPClient
from app.email.models import EmailSummary

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

# Initialize agent
agent = EmailAgent(settings)


@router.post("/generate-reply", response_model=GenerateReplyResponse)
async def generate_reply(request: GenerateReplyRequest):
    """
    Generate an AI-powered email reply.

    Args:
        request: Request containing email_id, tone, and optional context

    Returns:
        Generated reply text
    """
    try:
        # Fetch the email
        with IMAPClient(settings) as imap:
            email = imap.fetch_email_by_id(request.email_id)

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Email {request.email_id} not found"
                )

        # Generate reply
        reply_text = agent.generate_reply(
            email=email,
            tone=request.tone,
            additional_context=request.additional_context
        )

        return GenerateReplyResponse(
            email_id=request.email_id,
            reply_text=reply_text,
            tone=request.tone,
            char_count=len(reply_text)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating reply: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate reply: {str(e)}"
        )


@router.post("/refine-reply", response_model=RefineReplyResponse)
async def refine_reply(request: RefineReplyRequest):
    """
    Refine an existing email draft based on user feedback.

    Args:
        request: Request containing email_id, current draft, and feedback

    Returns:
        Refined reply text
    """
    try:
        # Fetch the original email
        with IMAPClient(settings) as imap:
            email = imap.fetch_email_by_id(request.email_id)

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Email {request.email_id} not found"
                )

        # Refine the reply
        refined_text = agent.refine_reply(
            original_email=email,
            current_draft=request.current_draft,
            user_feedback=request.user_feedback
        )

        return RefineReplyResponse(
            refined_text=refined_text,
            char_count=len(refined_text)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refining reply: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refine reply: {str(e)}"
        )


@router.post("/chat-refine", response_model=ChatRefineResponse)
async def chat_refine(request: ChatRefineRequest):
    """
    Chat-based refinement of email drafts.

    This endpoint maintains conversation history to allow
    iterative refinement through natural conversation.

    Args:
        request: Request containing conversation history and new user message

    Returns:
        AI response and updated conversation history
    """
    try:
        # Convert to dict format for agent
        history_dicts = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversation_history
        ]

        # Get AI response
        response = agent.chat_refine(
            conversation_history=history_dicts,
            user_message=request.user_message
        )

        # Build updated history
        updated_history = list(request.conversation_history)
        updated_history.append(ChatMessage(role="user", content=request.user_message))
        updated_history.append(ChatMessage(role="assistant", content=response))

        return ChatRefineResponse(
            response=response,
            updated_history=updated_history
        )

    except Exception as e:
        logger.error(f"Error in chat refinement: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat: {str(e)}"
        )


@router.post("/summarize", response_model=EmailSummary)
async def summarize_email(request: SummarizeEmailRequest):
    """
    Generate an AI-powered summary of an email.

    Args:
        request: Request containing email_id

    Returns:
        Email summary with key points, sentiment, and priority
    """
    try:
        # Fetch the email
        with IMAPClient(settings) as imap:
            email = imap.fetch_email_by_id(request.email_id)

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Email {request.email_id} not found"
                )

        # Generate summary
        summary = agent.summarize_email(email)

        return summary

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error summarizing email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to summarize email: {str(e)}"
        )
