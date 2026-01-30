"""IMAP client for reading emails."""

import email
import imaplib
import logging
from datetime import datetime
from email.header import decode_header
from email.utils import parsedate_to_datetime
from typing import Optional

from app.config import Settings
from app.email.models import Email, EmailAttachment

logger = logging.getLogger(__name__)


class IMAPClient:
    """IMAP client for reading emails."""

    def __init__(self, settings: Settings):
        """Initialize IMAP client with settings."""
        self.settings = settings
        self.imap: Optional[imaplib.IMAP4_SSL] = None
        self._connected = False

    def connect(self) -> None:
        """Connect and authenticate to IMAP server."""
        try:
            logger.info(f"Connecting to IMAP server: {self.settings.imap_server}")
            self.imap = imaplib.IMAP4_SSL(
                self.settings.imap_server,
                self.settings.imap_port
            )

            self.imap.login(
                self.settings.email_address,
                self.settings.email_password
            )

            self._connected = True
            logger.info("Successfully connected to IMAP server")

        except Exception as e:
            logger.error(f"Failed to connect to IMAP server: {e}")
            raise

    def disconnect(self) -> None:
        """Disconnect from IMAP server."""
        if self.imap and self._connected:
            try:
                self.imap.close()
                self.imap.logout()
                self._connected = False
                logger.info("Disconnected from IMAP server")
            except Exception as e:
                logger.error(f"Error disconnecting from IMAP: {e}")

    def _ensure_connected(self) -> None:
        """Ensure connection is established."""
        if not self._connected or not self.imap:
            self.connect()

    def select_mailbox(self, mailbox: str = "INBOX") -> None:
        """Select a mailbox."""
        self._ensure_connected()
        if self.imap:
            self.imap.select(mailbox)

    def fetch_unread_emails(self, limit: int = 20) -> list[Email]:
        """Fetch unread emails from inbox."""
        self._ensure_connected()
        self.select_mailbox("INBOX")

        if not self.imap:
            return []

        try:
            # Search for unread emails
            status, messages = self.imap.search(None, "UNSEEN")

            if status != "OK":
                logger.error("Failed to search for unread emails")
                return []

            email_ids = messages[0].split()

            if not email_ids:
                logger.info("No unread emails found")
                return []

            # Limit the number of emails to fetch
            email_ids = email_ids[-limit:]  # Get most recent

            emails = []
            for email_id in reversed(email_ids):  # Most recent first
                try:
                    email_obj = self._fetch_email_by_id(email_id.decode())
                    if email_obj:
                        emails.append(email_obj)
                except Exception as e:
                    logger.error(f"Error fetching email {email_id}: {e}")
                    continue

            logger.info(f"Fetched {len(emails)} unread emails")
            return emails

        except Exception as e:
            logger.error(f"Error fetching unread emails: {e}")
            return []

    def fetch_email_by_id(self, email_id: str) -> Optional[Email]:
        """Fetch a specific email by ID."""
        self._ensure_connected()
        self.select_mailbox("INBOX")
        return self._fetch_email_by_id(email_id)

    def _fetch_email_by_id(self, email_id: str) -> Optional[Email]:
        """Internal method to fetch email by ID."""
        if not self.imap:
            return None

        try:
            status, msg_data = self.imap.fetch(email_id, "(RFC822)")

            if status != "OK":
                logger.error(f"Failed to fetch email {email_id}")
                return None

            # Parse email
            email_body = msg_data[0][1]
            email_message = email.message_from_bytes(email_body)

            return self._parse_email(email_id, email_message)

        except Exception as e:
            logger.error(f"Error fetching email {email_id}: {e}")
            return None

    def _parse_email(self, email_id: str, msg: email.message.Message) -> Email:
        """Parse email message into Email model."""
        # Decode email header
        def decode_str(s: str) -> str:
            """Decode email header string."""
            if not s:
                return ""

            decoded_parts = decode_header(s)
            result = []

            for content, encoding in decoded_parts:
                if isinstance(content, bytes):
                    result.append(content.decode(encoding or "utf-8", errors="replace"))
                else:
                    result.append(str(content))

            return "".join(result)

        # Extract basic fields
        from_address = decode_str(msg.get("From", ""))
        # Extract just the email address from "Name <email>"
        if "<" in from_address and ">" in from_address:
            from_address = from_address.split("<")[1].split(">")[0].strip()

        to_addresses = [
            addr.strip()
            for addr in decode_str(msg.get("To", "")).split(",")
            if addr.strip()
        ]

        cc_addresses = [
            addr.strip()
            for addr in decode_str(msg.get("Cc", "")).split(",")
            if addr.strip()
        ]

        subject = decode_str(msg.get("Subject", ""))
        message_id = msg.get("Message-ID", "")
        in_reply_to = msg.get("In-Reply-To")
        references = msg.get("References", "").split() if msg.get("References") else []

        # Parse date
        date_str = msg.get("Date")
        try:
            date = parsedate_to_datetime(date_str) if date_str else datetime.now()
        except Exception:
            date = datetime.now()

        # Extract body
        body = ""
        html_body = None
        attachments = []

        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition", ""))

                # Extract text body
                if content_type == "text/plain" and "attachment" not in content_disposition:
                    try:
                        body = part.get_payload(decode=True).decode(errors="replace")
                    except Exception:
                        pass

                # Extract HTML body
                elif content_type == "text/html" and "attachment" not in content_disposition:
                    try:
                        html_body = part.get_payload(decode=True).decode(errors="replace")
                    except Exception:
                        pass

                # Extract attachments
                elif "attachment" in content_disposition:
                    filename = part.get_filename()
                    if filename:
                        attachments.append(EmailAttachment(
                            filename=decode_str(filename),
                            content_type=content_type,
                            size=len(part.get_payload(decode=True) or b"")
                        ))
        else:
            # Simple email
            try:
                body = msg.get_payload(decode=True).decode(errors="replace")
            except Exception:
                body = str(msg.get_payload())

        return Email(
            id=email_id,
            message_id=message_id,
            from_address=from_address,
            to_addresses=to_addresses,
            cc_addresses=cc_addresses,
            subject=subject,
            body=body,
            html_body=html_body,
            date=date,
            is_read=False,
            has_attachments=len(attachments) > 0,
            attachments=attachments,
            in_reply_to=in_reply_to,
            references=references
        )

    def mark_as_read(self, email_id: str) -> bool:
        """Mark an email as read."""
        self._ensure_connected()
        self.select_mailbox("INBOX")

        if not self.imap:
            return False

        try:
            self.imap.store(email_id, "+FLAGS", "\\Seen")
            logger.info(f"Marked email {email_id} as read")
            return True
        except Exception as e:
            logger.error(f"Error marking email as read: {e}")
            return False

    def mark_as_unread(self, email_id: str) -> bool:
        """Mark an email as unread."""
        self._ensure_connected()
        self.select_mailbox("INBOX")

        if not self.imap:
            return False

        try:
            self.imap.store(email_id, "-FLAGS", "\\Seen")
            logger.info(f"Marked email {email_id} as unread")
            return True
        except Exception as e:
            logger.error(f"Error marking email as unread: {e}")
            return False

    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()
