#!/bin/bash

echo "📦 Setting up Email Agent"
echo ""

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"
echo ""

# Setup backend
echo "🐍 Setting up Python backend..."
cd backend
if ! command -v uv &> /dev/null; then
    echo "Installing dependencies with pip..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -e .
else
    echo "Installing dependencies with uv..."
    uv venv
    source .venv/bin/activate
    uv pip install -e .
fi
cd ..
echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "⚛️  Setting up Electron frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend setup complete"
echo ""

# Setup environment
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your API keys and email credentials"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run './scripts/dev.sh' to start development"
echo ""
