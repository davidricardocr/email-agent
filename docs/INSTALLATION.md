# Email Agent - Installation Guide

## Prerequisites

### Backend Requirements
- Python 3.12 or higher
- pip (Python package manager)
- Gmail account with App Password enabled

### Frontend Requirements
- Node.js 18 or higher
- npm (Node package manager)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/davidricardocr/email-agent.git
cd email-agent
```

### 2. Backend Setup

#### Create Python Virtual Environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
IMAP_SERVER=imap.gmail.com
IMAP_PORT=993
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# AI Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key
LLM_MODEL=claude-3-haiku-20240307
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1024

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=["http://localhost:5173","http://localhost:5174"]
```

#### How to Get Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password (remove spaces)
6. Use this password in the `EMAIL_PASSWORD` field

#### Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend will be running at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Start the Development Server

```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## First Launch

1. **Landing Page**: You'll see the welcome screen with features overview
2. **Configuration Wizard**:
   - Step 1: Choose your default email tone (formal, casual, friendly, or professional)
   - Step 2: Set preferences (language, theme, notifications, check interval)
   - Step 3: Finish setup and start using the app
3. **Main Application**: Access your inbox, prepare AI-powered responses, and manage settings

## Using the Packaged App (Mac)

If you have the `.dmg` or `.app` file:

1. Open the `.dmg` file (if applicable)
2. Drag "Email Agent.app" to your Applications folder
3. Open "Email Agent" from Applications
4. If you see a security warning, go to System Preferences → Security & Privacy and click "Open Anyway"
5. **Important**: Make sure the backend server is running before using the app:
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn app.main:app
   ```

## Troubleshooting

### Backend Issues

**Problem**: "ValidationError: anthropic_api_key field required"
- **Solution**: Make sure your `.env` file is in the `backend` directory (not just the root)

**Problem**: "Error 404 - model not found"
- **Solution**: Verify your Anthropic API key is valid and the model name is correct

**Problem**: "Connection failed to Gmail"
- **Solution**:
  - Verify your Gmail App Password is correct (16 characters, no spaces)
  - Ensure 2FA is enabled on your Google account
  - Check IMAP is enabled in Gmail settings

### Frontend Issues

**Problem**: "Network error" when trying to use features
- **Solution**: Make sure the backend server is running on `http://localhost:8000`

**Problem**: App crashes on startup
- **Solution**:
  - Clear browser cache/localStorage
  - Check browser console for errors
  - Verify all dependencies are installed (`npm install`)

**Problem**: Notifications not appearing
- **Solution**:
  - Check that notifications are enabled in Settings
  - Verify the backend is running and accessible
  - Check the check interval is set appropriately (minimum 30 seconds)

### Development Tips

- **Hot Reload**: Both backend and frontend support hot reloading during development
- **API Documentation**: Visit `http://localhost:8000/docs` for interactive API documentation
- **Logs**: Backend logs appear in the terminal where you started the server
- **State Reset**: To reset the app configuration, clear localStorage in browser dev tools

## Next Steps

- See [BACKEND_USAGE.md](./BACKEND_USAGE.md) for API documentation
- See [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) for frontend structure
- See [README.md](../README.md) for project overview

## Support

For issues or questions, please open an issue on [GitHub](https://github.com/davidricardocr/email-agent/issues).
