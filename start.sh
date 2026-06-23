#!/bin/bash

# Lumina Studio Startup Script
# This script starts both the backend API and frontend development server

echo "🎨 Starting Lumina Studio..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "ENABLE_MOCK_MODE=true" >> .env
    echo ""
fi

echo "🚀 Starting servers..."
echo ""
echo "Backend API will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run dev

# Made with Bob
