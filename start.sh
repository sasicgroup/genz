#!/bin/bash

# GenZ AI Agents - Development Startup Script

echo "🚀 Starting GenZ AI Agents..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before continuing"
    echo "🔑 You'll need to add your AI provider API keys (OpenAI, Anthropic)"
    read -p "Press Enter after editing .env file..."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client
    npm install
    cd ..
fi

# Start backend server
echo "🔧 Starting backend server..."
npm run dev &

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd client
npm start &

echo ""
echo "✅ GenZ AI Agents is starting up!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "📱 Open your browser and navigate to http://localhost:3000"
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
wait