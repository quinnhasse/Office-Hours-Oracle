#!/bin/bash

echo "🚀 Office Hours Oracle - Chaos Simulation Demo"
echo "=============================================="
echo ""
echo "Starting simulation server on http://localhost:8080"
echo "Opening simulator.html in your default browser..."
echo ""
echo "📋 Demo Script:"
echo "  1. Click 'START CHAOS SIMULATION'"
echo "  2. Watch chaos unfold (students flooding in)"
echo "  3. Click 'ACTIVATE CLAUDE AI'"
echo "  4. See 70% improvement!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser (works on macOS)
open "http://localhost:8080/simulator.html" 2>/dev/null || echo "Open http://localhost:8080/simulator.html in your browser"

# Start simple HTTP server
python3 -m http.server 8080
