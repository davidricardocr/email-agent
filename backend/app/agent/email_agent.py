"""LangChain agent for email response generation."""

import json
import logging
from typing import Optional

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.agent.prompts import (
    BASE_SYSTEM_PROMPT,
    EmailTone,
    get_refinement_prompt,
    get_reply_generation_prompt,
    get_summary_prompt,
)
from app.config import Settings
from app.email.models import Email, EmailPriority, EmailSentiment, EmailSummary

logger = logging.getLogger(__name__)


class EmailAgent:
    """LangChain agent for email operations."""

    def __init__(self, settings: Settings):
        """Initialize the email agent."""
        self.settings = settings

        # Initialize Claude
        self.llm = ChatAnthropic(
            model=settings.llm_model,
            api_key=settings.anthropic_api_key,
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens,
        )

        logger.info(f"EmailAgent initialized with model: {settings.llm_model}")

    def generate_reply(
        self,
        email: Email,
        tone: EmailTone = EmailTone.PROFESSIONAL,
        additional_context: str = "",
    ) -> str:
        """
        Generate a reply to an email.

        Args:
            email: The email to reply to
            tone: Desired tone for the response
            additional_context: Additional instructions from the user

        Returns:
            Generated reply text
        """
        try:
            # Extract sender name from email address
            sender_name = email.from_address.split("@")[0]

            # Generate prompt
            prompt = get_reply_generation_prompt(
                original_email=email.body,
                sender_name=sender_name,
                subject=email.subject,
                tone=tone,
                additional_context=additional_context,
            )

            # Generate response
            logger.info(f"Generating reply for email {email.id} with tone: {tone}")

            messages = [HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)

            reply_text = response.content

            logger.info(f"Generated reply of {len(reply_text)} characters")
            return reply_text

        except Exception as e:
            logger.error(f"Error generating reply: {e}")
            raise

    def refine_reply(
        self,
        original_email: Email,
        current_draft: str,
        user_feedback: str,
    ) -> str:
        """
        Refine an existing reply based on user feedback.

        Args:
            original_email: The original email being replied to
            current_draft: Current draft of the response
            user_feedback: User's feedback on what to change

        Returns:
            Refined reply text
        """
        try:
            prompt = get_refinement_prompt(
                original_email=original_email.body,
                current_draft=current_draft,
                user_feedback=user_feedback,
            )

            logger.info(f"Refining reply based on feedback: {user_feedback[:50]}...")

            messages = [HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)

            refined_text = response.content

            logger.info(f"Refined reply to {len(refined_text)} characters")
            return refined_text

        except Exception as e:
            logger.error(f"Error refining reply: {e}")
            raise

    def chat_refine(
        self,
        conversation_history: list[dict],
        user_message: str,
    ) -> str:
        """
        Continue a conversation to refine an email draft.

        Args:
            conversation_history: List of previous messages in the conversation
                Format: [{"role": "user"|"assistant", "content": "..."}]
            user_message: New message from the user

        Returns:
            Assistant's response
        """
        try:
            # Convert history to LangChain messages
            messages = [SystemMessage(content=BASE_SYSTEM_PROMPT)]

            for msg in conversation_history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))

            # Add new user message
            messages.append(HumanMessage(content=user_message))

            logger.info(f"Chat refine with {len(conversation_history)} history messages")

            response = self.llm.invoke(messages)

            return response.content

        except Exception as e:
            logger.error(f"Error in chat refinement: {e}")
            raise

    def summarize_email(self, email: Email) -> EmailSummary:
        """
        Generate a summary of an email.

        Args:
            email: Email to summarize

        Returns:
            EmailSummary with analysis
        """
        try:
            # Extract sender name
            sender = email.from_address.split("@")[0] if email.from_address else "Unknown"

            prompt = get_summary_prompt(
                email_body=email.body,
                sender=sender,
                subject=email.subject,
            )

            logger.info(f"Generating summary for email {email.id}")

            messages = [HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)

            # Parse JSON response
            try:
                summary_data = json.loads(response.content)

                return EmailSummary(
                    email_id=email.id,
                    summary=summary_data.get("summary", ""),
                    key_points=summary_data.get("key_points", []),
                    sentiment=EmailSentiment(summary_data.get("sentiment", "neutral")),
                    priority=EmailPriority(summary_data.get("priority", "medium")),
                    action_required=summary_data.get("action_required", False),
                    suggested_actions=summary_data.get("suggested_actions", []),
                )

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse summary JSON: {e}")
                # Return basic summary
                return EmailSummary(
                    email_id=email.id,
                    summary=response.content[:200],
                    key_points=[],
                    sentiment=EmailSentiment.NEUTRAL,
                    priority=EmailPriority.MEDIUM,
                    action_required=False,
                    suggested_actions=[],
                )

        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            raise
