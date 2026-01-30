"""SMTP client for sending emails."""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.config import Settings
from app.email.models import EmailDraft

logger = logging.getLogger(__name__)


class SMTPClient:
    """SMTP client for sending emails."""

    def __init__(self, settings: Settings):
        """Initialize SMTP client with settings."""
        self.settings = settings
        self.smtp: Optional[smtplib.SMTP] = None
        self._connected = False

    def connect(self) -> None:
        """Connect and authenticate to SMTP server."""
        try:
            logger.info(f"Connecting to SMTP server: {self.settings.smtp_server}")

            self.smtp = smtplib.SMTP(
                self.settings.smtp_server,
                self.settings.smtp_port
            )

            self.smtp.ehlo()
            self.smtp.starttls()
            self.smtp.ehlo()

            self.smtp.login(
                self.settings.email_address,
                self.settings.email_password
            )

            self._connected = True
            logger.info("Successfully connected to SMTP server")

        except Exception as e:
            logger.error(f"Failed to connect to SMTP server: {e}")
            raise

    def disconnect(self) -> None:
        """Disconnect from SMTP server."""
        if self.smtp and self._connected:
            try:
                self.smtp.quit()
                self._connected = False
                logger.info("Disconnected from SMTP server")
            except Exception as e:
                logger.error(f"Error disconnecting from SMTP: {e}")

    def _ensure_connected(self) -> None:
        """Ensure connection is established."""
        if not self._connected or not self.smtp:
            self.connect()

    def send_email(self, draft: EmailDraft) -> bool:
        """Send an email using the draft."""
        self._ensure_connected()

        if not self.smtp:
            logger.error("SMTP client not connected")
            return False

        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = draft.subject
            msg["From"] = self.settings.email_address
            msg["To"] = ", ".join(draft.to_addresses)

            if draft.cc_addresses:
                msg["Cc"] = ", ".join(draft.cc_addresses)

            # Add threading headers for replies
            if draft.in_reply_to:
                msg["In-Reply-To"] = draft.in_reply_to
                msg["References"] = " ".join(draft.references) if draft.references else draft.in_reply_to

            # Add body as both plain text and HTML
            text_part = MIMEText(draft.body, "plain", "utf-8")
            msg.attach(text_part)

            # Convert plain text to simple HTML
            html_body = draft.body.replace("\n", "<br>\n")
            html_part = MIMEText(f"<html><body>{html_body}</body></html>", "html", "utf-8")
            msg.attach(html_part)

            # Send email
            recipients = draft.to_addresses + draft.cc_addresses

            self.smtp.send_message(msg, from_addr=self.settings.email_address, to_addrs=recipients)

            logger.info(f"Email sent successfully to {', '.join(draft.to_addresses)}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

    def send_reply(self, original_email_id: str, draft: EmailDraft) -> bool:
        """Send a reply to an existing email."""
        # This is essentially the same as send_email, but we ensure
        # the threading headers are set properly
        return self.send_email(draft)

    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()
