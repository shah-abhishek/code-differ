#!/bin/bash

# Screenshot Generator for Code Differ
# This script helps you take a screenshot of the running application

echo "🚀 Starting Code Differ application..."

# Start the dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Server is running at http://localhost:5173"
    echo "📸 Please take a screenshot manually and save it as docs/screenshot.png"
    echo "   - Open http://localhost:5173 in your browser"
    echo "   - Set up some interesting code comparison"
    echo "   - Take a screenshot of the full interface"
    echo "   - Save as docs/screenshot.png"
    echo ""
    echo "Press Enter when you've taken the screenshot..."
    read -r
    
    # Kill the dev server
    kill $DEV_PID
    echo "✅ Screenshot setup complete!"
else
    echo "❌ Failed to start server"
    kill $DEV_PID
    exit 1
fi