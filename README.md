# Email Agent

> ✅ **Project Status**: MVP Complete and Fully Functional!

An AI-powered email assistant built with LangChain and Electron that helps you manage your inbox intelligently. Generate professional email responses with AI, refine them through an interactive chat interface, and send them directly from the app.

## Features

- 🤖 **AI-Powered Responses**: Generate intelligent email replies using LangChain and Claude Haiku
- 💬 **Interactive Chat Refinement**: Real-time conversation with AI to perfect your responses
- 📧 **Smart Email Monitoring**: Automatic inbox checking with AI-generated summaries
- 🔔 **Beautiful Notifications**: Bottom-left popup system with sentiment analysis and priority detection
- 📨 **Full Email Integration**: Read, compose, refine, and send emails directly from the app
- 📋 **Inbox View**: Clean interface to browse and manage your emails
- 🎨 **Modern UI**: Polished desktop app with React, TypeScript, and Tailwind CSS
- 🌍 **Bilingual Support**: Complete English and Spanish translations
- 🌓 **Light/Dark Themes**: Switch between themes on the fly
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

### ✅ MVP Complete and Fully Functional!

Both backend and frontend are **100% complete and tested**:

#### Backend
- 🔌 **Email Service**: Full IMAP/SMTP integration with Gmail
- 🤖 **AI Agent**: Claude Haiku for intelligent response generation
- 💬 **Chat Refinement**: Iterative response improvement through conversation
- 📝 **Email Summaries**: AI-generated summaries with sentiment and priority analysis
- 📊 **REST API**: 10 endpoints (6 email + 4 agent operations)
- 📚 **Documentation**: Complete API docs with examples

#### Frontend
- 🎨 **Landing Page**: Beautiful welcome screen with feature showcase
- ⚙️ **Configuration Wizard**: 3-step setup for tone, preferences, and theme
- 📧 **Inbox View**: Browse and manage emails with real-time updates
- 🔔 **Smart Notifications**: Animated popups with AI summaries
- ✍️ **Response Generation**: AI-powered draft creation
- 💬 **Chat Interface**: Split-screen editor for response refinement
- 📨 **Email Sending**: Full send functionality with threading support
- 🌍 **i18n**: Complete English and Spanish translations
- 🎨 **Themes**: Seamless light/dark mode switching
- ⚙️ **Settings Panel**: Comprehensive configuration options
- 💾 **Local Storage**: Persistent settings and preferences

**Full documentation**:
- [Installation Guide](./docs/INSTALLATION.md)
- [Backend Usage Guide](./docs/BACKEND_USAGE.md)
- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)

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

### ✅ Completed (MVP)
- [x] Project setup and architecture
- [x] Email monitoring (IMAP) with background checking
- [x] LangChain agent for AI reply generation
- [x] Chat interface for interactive refinement
- [x] Email sending (SMTP) with threading support
- [x] Notification system with AI summaries
- [x] Settings and preferences panel
- [x] Inbox view with email management
- [x] Landing page and configuration wizard
- [x] Bilingual support (EN/ES)
- [x] Light/Dark theme support
- [x] Build and packaging for Mac

### 🚀 Future Enhancements
- [ ] Auto-updates with electron-updater
- [ ] Multi-account support
- [ ] Email templates and shortcuts
- [ ] Advanced filtering and search
- [ ] Email attachments support
- [ ] Keyboard shortcuts
- [ ] System tray integration
- [ ] Windows and Linux builds
- [ ] Enhanced security features
- [ ] Performance optimizations

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [LangChain](https://github.com/langchain-ai/langchain)
- UI inspired by [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui)
- Learned from [LangChain Academy](https://github.com/langchain-ai/langchain-academy)
