# Email Agent

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

## Usage

1. **First Launch**: Configure your email account and API key
2. **Monitor**: The app runs in the system tray and monitors your inbox
3. **Respond**: Click on notifications to view emails and generate AI responses
4. **Refine**: Chat with the AI to adjust the response tone and content
5. **Send**: Review and send the final response

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
