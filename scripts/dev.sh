#!/bin/bash

# Development script to run both backend and frontend

echo "🚀 Starting Email Agent Development Environment"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env with your configuration"
    exit 1
fi

# Function to run backend
run_backend() {
    echo -e "${BLUE}[Backend]${NC} Starting Python FastAPI server..."
    cd backend
    if [ ! -d ".venv" ]; then
        echo "Creating virtual environment..."
        uv venv
    fi
    source .venv/bin/activate
    uv pip install -e . --quiet
    uvicorn app.main:app --reload
}

# Function to run frontend
run_frontend() {
    echo -e "${GREEN}[Frontend]${NC} Starting Electron + React..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    npm run dev
}

# Run both in parallel
run_backend &
BACKEND_PID=$!

sleep 2

run_frontend &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
