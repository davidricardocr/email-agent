# Email Agent

> ⚠️ **Project Status**: Backend 100% functional and tested. Frontend implementation in progress.

An AI-powered email assistant built with LangChain and Electron that helps you manage your inbox intelligently.

## Features

- 🤖 **AI-Powered Responses**: Generate intelligent email replies using LangChain and Claude
- 💬 **Interactive Refinement**: Chat with the AI to refine responses before sending
- 📧 **Email Monitoring**: Background monitoring of your inbox with smart notifications
- 🎨 **Native UI**: Beautiful desktop app built with Electron and React
- 🔒 **Privacy First**: Runs locally on your machine, your data stays with you
- ⚙️ **Universal Email**: Works with any IMAP/SMTP provider (Gmail, Outlook, etc.)

## Architecture

```
Frontend (Electron + React + TypeScript)
    ↕ HTTP/IPC
Backend (Python + FastAPI + LangChain)
    ↕
Email (IMAP/SMTP)
```

## Tech Stack

### Frontend
- **Electron** - Desktop app framework
- **React** + **TypeScript** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Python 3.12+** - Runtime
- **FastAPI** - API framework
- **LangChain** + **LangGraph** - AI agent framework
- **Anthropic Claude** - LLM provider
- **imaplib** / **smtplib** - Email protocols

## Project Structure

```
email-agent/
├── frontend/           # Electron + React app
│   ├── src/
│   │   ├── main/      # Electron main process
│   │   └── renderer/  # React UI
│   └── package.json
│
├── backend/           # Python FastAPI server
│   ├── app/
│   │   ├── agent/    # LangChain agent
│   │   ├── email/    # Email services
│   │   └── api/      # FastAPI routes
│   └── pyproject.toml
│
├── scripts/          # Build scripts
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12+
- **uv** (recommended) or pip for Python package management
- An **Anthropic API key** (get one at https://console.anthropic.com)
- Email account with **IMAP/SMTP** access

### Installation

```bash
# Clone the repository
git clone https://github.com/davidricardocr/email-agent.git
cd email-agent

# Install backend dependencies
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Install frontend dependencies
cd ../frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys and email credentials
```

### Development

```bash
# Terminal 1: Start backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Build

```bash
# Build for Mac
npm run build:mac

# Build for Windows
npm run build:win

# Build for Linux
npm run build:linux
```

## Configuration

Create a `.env` file in the root directory:

```env
# LLM Configuration
ANTHROPIC_API_KEY=your_api_key_here

# Email Configuration
EMAIL_ADDRESS=your.email@gmail.com
EMAIL_PASSWORD=your_app_password_here
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# App Configuration
CHECK_INTERVAL=60  # seconds
```

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in your `.env` file

## Current Status

### ✅ Backend (Fully Functional)

The backend is **100% complete and tested**:

- 🔌 **Email Service**: IMAP/SMTP clients working with Gmail
- 🤖 **AI Agent**: Claude Haiku generating intelligent responses
- 📊 **API**: 10 endpoints (emails + agent operations)
- ✅ **Tested**: All endpoints verified and working

**Try it now:**
```bash
cd backend
uvicorn app.main:app --reload
# Visit http://localhost:8000/docs for interactive API docs
```

**Full documentation**: [Backend Usage Guide](./docs/BACKEND_USAGE.md)

### 🚧 Frontend (In Progress)

Frontend architecture designed and ready for implementation:

- 🎨 **UI**: Electron + React + TypeScript
- 🌍 **i18n**: English/Spanish support
- 🎨 **Themes**: Light/Dark mode
- 💾 **Storage**: Local settings with Electron Store
- 📍 **Notifications**: Bottom-left popup system

**Architecture**: [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)

## API Examples

### Check for New Emails
```bash
curl -X POST http://localhost:8000/api/emails/check
```

### Generate AI Reply
```bash
curl -X POST http://localhost:8000/api/agent/generate-reply \
  -H "Content-Type: application/json" \
  -d '{
    "email_id": "123",
    "tone": "professional",
    "additional_context": "Keep it brief"
  }'
```

### Get Email Summary
```bash
curl -X POST http://localhost:8000/api/agent/summarize \
  -H "Content-Type: application/json" \
  -d '{"email_id": "123"}'
```

**More examples**: [Backend Usage Guide](./docs/BACKEND_USAGE.md)

## Documentation

- 📘 [Backend Usage Guide](./docs/BACKEND_USAGE.md) - Complete API documentation
- 🏗️ [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md) - UI design and components
- 📝 [Backend README](./backend/README.md) - Backend setup details

## Development

Built as a learning project following the [LangChain Academy](https://github.com/langchain-ai/langchain-academy) curriculum.

### Learned Concepts
- LangChain agents and tools
- LangGraph for complex workflows
- Email automation with Python
- Desktop app development with Electron
- FastAPI backend architecture

## Roadmap

- [x] Project setup and architecture
- [ ] Email monitoring (IMAP)
- [ ] LangChain agent for reply generation
- [ ] Chat interface for refinement
- [ ] Email sending (SMTP)
- [ ] System tray and notifications
- [ ] Settings and preferences
- [ ] Build and packaging
- [ ] Auto-updates
- [ ] Multi-account support

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [LangChain](https://github.com/langchain-ai/langchain)
- UI inspired by [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui)
- Learned from [LangChain Academy](https://github.com/langchain-ai/langchain-academy)
