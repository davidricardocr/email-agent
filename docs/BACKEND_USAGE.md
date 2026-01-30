# Backend Usage Guide - Email Agent

## Quick Start

### 1. Setup

```bash
cd backend

# Create virtual environment
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -e .

# Configure environment
cp ../.env.example .env
# Edit .env with your credentials
```

### 2. Configuration

Create `.env` file in `backend/` directory:

```env
# LLM Configuration
ANTHROPIC_API_KEY=your_api_key_here

# Email Configuration
EMAIL_ADDRESS=your.email@gmail.com
EMAIL_PASSWORD=your_app_password_here  # Gmail App Password
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# App Configuration
CHECK_INTERVAL=60
LOG_LEVEL=INFO

# Backend Configuration
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
```

**Gmail App Password Setup:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA if not already enabled
3. Create new app password for "Mail"
4. Copy the 16-character password

### 3. Run Server

```bash
uvicorn app.main:app --reload
```

Server will start at: **http://localhost:8000**

---

## API Documentation

### Interactive Docs

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Base Endpoints

#### Health Check
```bash
GET /health

Response:
{
  "status": "healthy"
}
```

#### Root
```bash
GET /

Response:
{
  "name": "Email Agent",
  "version": "0.1.0",
  "status": "running"
}
```

---

## Email Endpoints

### 1. List Unread Emails

```bash
GET /api/emails?limit=20
```

**Response:**
```json
[
  {
    "id": "14760",
    "message_id": "<abc@example.com>",
    "from": "sender@example.com",
    "to": ["you@example.com"],
    "cc": [],
    "subject": "Test Email",
    "body": "Email content...",
    "html_body": null,
    "date": "2026-01-29T18:00:00Z",
    "is_read": false,
    "is_flagged": false,
    "has_attachments": false,
    "attachments": [],
    "in_reply_to": null,
    "references": []
  }
]
```

**cURL Example:**
```bash
curl http://localhost:8000/api/emails
```

### 2. Check for New Emails

```bash
POST /api/emails/check?limit=20
```

**Response:**
```json
{
  "new_emails_count": 4,
  "emails": [...],
  "last_check": "2026-01-29T18:42:00Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/emails/check
```

### 3. Get Specific Email

```bash
GET /api/emails/{email_id}
```

**cURL Example:**
```bash
curl http://localhost:8000/api/emails/14760
```

### 4. Mark Email as Read

```bash
POST /api/emails/{email_id}/mark-read
```

**Response:**
```json
{
  "message": "Email marked as read",
  "email_id": "14760"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/emails/14760/mark-read
```

### 5. Mark Email as Unread

```bash
POST /api/emails/{email_id}/mark-unread
```

### 6. Send Email

```bash
POST /api/emails/send
```

**Request Body:**
```json
{
  "draft": {
    "to": ["recipient@example.com"],
    "cc": [],
    "subject": "Re: Your Email",
    "body": "Email body content...",
    "in_reply_to": "<original-message-id>",
    "references": ["<message-id-1>", "<message-id-2>"]
  }
}
```

**Response:**
```json
{
  "message": "Email sent successfully",
  "to": ["recipient@example.com"],
  "subject": "Re: Your Email"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "draft": {
      "to": ["test@example.com"],
      "subject": "Test",
      "body": "Hello!"
    }
  }'
```

---

## AI Agent Endpoints

### 1. Generate Reply

Generate an AI-powered email reply.

```bash
POST /api/agent/generate-reply
```

**Request Body:**
```json
{
  "email_id": "14760",
  "tone": "professional",
  "additional_context": "Keep it short and friendly"
}
```

**Tone Options:**
- `professional` - Balanced and clear
- `formal` - Business formal
- `casual` - Relaxed and conversational
- `friendly` - Warm and personable

**Response:**
```json
{
  "email_id": "14760",
  "reply_text": "Hello,\n\nThank you for your email...",
  "tone": "professional",
  "char_count": 245
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/agent/generate-reply \
  -H "Content-Type: application/json" \
  -d '{
    "email_id": "14760",
    "tone": "professional",
    "additional_context": "Thank them for the alert"
  }'
```

### 2. Refine Reply

Refine an existing draft based on user feedback.

```bash
POST /api/agent/refine-reply
```

**Request Body:**
```json
{
  "email_id": "14760",
  "current_draft": "Original draft text...",
  "user_feedback": "Make it shorter and more casual"
}
```

**Response:**
```json
{
  "refined_text": "Refined email text...",
  "char_count": 150
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/agent/refine-reply \
  -H "Content-Type: application/json" \
  -d '{
    "email_id": "14760",
    "current_draft": "Hello, Thank you for your email...",
    "user_feedback": "Make it shorter"
  }'
```

### 3. Chat Refinement

Interactive chat-based refinement with conversation history.

```bash
POST /api/agent/chat-refine
```

**Request Body:**
```json
{
  "conversation_history": [
    {"role": "user", "content": "Make it more formal"},
    {"role": "assistant", "content": "Here's a formal version..."}
  ],
  "user_message": "Now add a thank you at the beginning"
}
```

**Response:**
```json
{
  "response": "I've added a thank you at the beginning...",
  "updated_history": [
    {"role": "user", "content": "Make it more formal"},
    {"role": "assistant", "content": "Here's a formal version..."},
    {"role": "user", "content": "Now add a thank you at the beginning"},
    {"role": "assistant", "content": "I've added a thank you..."}
  ]
}
```

### 4. Summarize Email

Get AI-powered summary with sentiment and priority analysis.

```bash
POST /api/agent/summarize
```

**Request Body:**
```json
{
  "email_id": "14760"
}
```

**Response:**
```json
{
  "email_id": "14760",
  "summary": "Security alert about app password creation",
  "key_points": [
    "App password was created",
    "May indicate unauthorized access",
    "Check account activity recommended"
  ],
  "sentiment": "negative",
  "priority": "high",
  "action_required": true,
  "suggested_actions": [
    "Check account activity",
    "Secure the account",
    "Monitor for suspicious activity"
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/agent/summarize \
  -H "Content-Type: application/json" \
  -d '{"email_id": "14760"}'
```

---

## Complete Workflow Example

### Scenario: Respond to an Email

```bash
# 1. Check for new emails
curl -X POST http://localhost:8000/api/emails/check

# 2. Get summary of first email
curl -X POST http://localhost:8000/api/agent/summarize \
  -H "Content-Type: application/json" \
  -d '{"email_id": "14760"}'

# 3. Generate a professional reply
curl -X POST http://localhost:8000/api/agent/generate-reply \
  -H "Content-Type: application/json" \
  -d '{
    "email_id": "14760",
    "tone": "professional"
  }'

# 4. Refine the reply (if needed)
curl -X POST http://localhost:8000/api/agent/refine-reply \
  -H "Content-Type: application/json" \
  -d '{
    "email_id": "14760",
    "current_draft": "...",
    "user_feedback": "Make it shorter"
  }'

# 5. Send the email
curl -X POST http://localhost:8000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "draft": {
      "to": ["sender@example.com"],
      "subject": "Re: Original Subject",
      "body": "Final refined text...",
      "in_reply_to": "<message-id>"
    }
  }'

# 6. Mark original as read
curl -X POST http://localhost:8000/api/emails/14760/mark-read
```

---

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Check for new emails
response = requests.post(f"{BASE_URL}/api/emails/check")
emails = response.json()["emails"]

if emails:
    email = emails[0]
    email_id = email["id"]

    # Generate reply
    reply_response = requests.post(
        f"{BASE_URL}/api/agent/generate-reply",
        json={
            "email_id": email_id,
            "tone": "professional",
            "additional_context": "Keep it brief"
        }
    )

    reply = reply_response.json()
    print(f"Generated reply ({reply['char_count']} chars):")
    print(reply['reply_text'])
```

---

## Error Handling

### Common Errors

**401 Unauthorized**
```json
{
  "detail": "Invalid API key"
}
```
→ Check your `ANTHROPIC_API_KEY` in `.env`

**404 Not Found**
```json
{
  "detail": "Email 12345 not found"
}
```
→ Email ID doesn't exist or has been moved

**500 Internal Server Error**
```json
{
  "detail": "Failed to connect to IMAP server: ..."
}
```
→ Check email credentials and IMAP/SMTP settings

### Email Connection Issues

**Gmail Errors:**
- "Application-specific password required" → Use App Password
- "IMAP not enabled" → Enable IMAP in Gmail settings
- "Less secure app access" → Use App Password instead

---

## Performance Notes

### Response Times
- **Email operations** (IMAP/SMTP): 1-3 seconds
- **AI generation**: 2-5 seconds (Claude Haiku)
- **Summarization**: 1-3 seconds

### Rate Limits
- **Anthropic API**: 50 requests/minute (Haiku)
- **IMAP**: ~100 requests/minute (Gmail)
- **SMTP**: ~100 emails/day (Gmail free tier)

### Best Practices
- Cache email summaries to avoid re-processing
- Batch email checks instead of checking individually
- Use appropriate polling intervals (60-300 seconds)
- Implement exponential backoff for API errors

---

## Security Considerations

### API Keys
- Never commit `.env` file to git
- Rotate API keys regularly
- Use environment-specific keys

### Email Credentials
- Use App Passwords, not account passwords
- Enable 2FA on email account
- Monitor for suspicious activity

### Network Security
- Backend runs on localhost only by default
- Enable CORS only for trusted origins
- Use HTTPS in production

---

## Troubleshooting

### Server won't start
```bash
# Check Python version
python --version  # Should be 3.12+

# Reinstall dependencies
uv pip install -e . --force-reinstall

# Check .env file exists
ls -la .env
```

### IMAP connection fails
```bash
# Test IMAP connection manually
python -c "
import imaplib
imap = imaplib.IMAP4_SSL('imap.gmail.com', 993)
imap.login('your-email', 'your-app-password')
print('Connected!')
"
```

### AI responses are slow
- Haiku is the fastest model
- Check network latency
- Consider caching responses

---

## Next Steps

- ✅ Backend is fully functional
- 📱 Frontend implementation (in progress)
- 📦 Desktop app packaging
- 🚀 Production deployment

For frontend development, see [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
