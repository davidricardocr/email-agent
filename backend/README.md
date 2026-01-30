# Email Agent Backend

FastAPI backend with LangChain for AI-powered email assistance.

## Setup

### Install Dependencies

```bash
# Using uv (recommended)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Or using pip
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

### Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
ANTHROPIC_API_KEY=your_api_key_here
EMAIL_ADDRESS=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
# ... other settings
```

## Development

### Run Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Or with custom host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Testing

```bash
# Install dev dependencies
uv pip install -e ".[dev]"

# Run tests
pytest

# With coverage
pytest --cov=app --cov-report=html
```

### Code Quality

```bash
# Format code
black app/

# Lint
ruff check app/

# Type check
mypy app/
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `GET /api/emails` - List emails
- `POST /api/emails/check` - Check for new emails
- `GET /api/emails/{email_id}` - Get email details
- `POST /api/agent/generate-reply` - Generate AI reply
- `POST /api/chat/refine` - Refine reply with chat
- `POST /api/emails/send` - Send email

## Project Structure

```
backend/
├── app/
│   ├── agent/          # LangChain agent logic
│   ├── email/          # Email services (IMAP/SMTP)
│   ├── api/            # FastAPI routes
│   ├── core/           # Core utilities
│   ├── config.py       # Settings
│   └── main.py         # FastAPI app
├── tests/              # Tests
└── pyproject.toml      # Dependencies
```
