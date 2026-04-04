#!/bin/bash
# Quick Start Script for Gamified Tracker Electron App
# Run this script to set up and launch the app

set -e  # Exit on any error

echo "🚀 Gamified Tracker - Quick Start"
echo "=================================="
echo ""

# Step 1: Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please download Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Step 2: Install dependencies (with SSL workaround)
echo "📦 Installing dependencies..."

# Try npm install first
if npm install 2>/dev/null; then
    echo "✅ Dependencies installed via npm"
else
    echo "⚠️  npm install failed (likely SSL certificate issue)"
    echo "🔧 Attempting manual Electron download..."

    # Manual Electron download for macOS
    ELECTRON_VERSION="v30.0.0"
    ELECTRON_URL="https://github.com/electron/electron/releases/download/${ELECTRON_VERSION}/electron-${ELECTRON_VERSION}-darwin-x64.zip"
    ELECTRON_ZIP="electron.zip"
    ELECTRON_DIR="electron-bin"

    echo "📥 Downloading Electron ${ELECTRON_VERSION}..."
    if curl -L -o "$ELECTRON_ZIP" "$ELECTRON_URL" 2>/dev/null; then
        echo "✅ Electron downloaded"
        rm -rf "$ELECTRON_DIR"
        mkdir -p "$ELECTRON_DIR"
        unzip -oq "$ELECTRON_ZIP" -d "$ELECTRON_DIR"
        rm "$ELECTRON_ZIP"

        # Create symlink or copy to node_modules/.bin
        mkdir -p node_modules/.bin
        ln -sf "../../$ELECTRON_DIR/Electron.app/Contents/MacOS/Electron" node_modules/.bin/electron

        echo "✅ Electron manually installed"
    else
        echo "❌ Manual download failed"
        echo ""
        echo "🔧 MANUAL SETUP REQUIRED:"
        echo "1. Download Electron from: $ELECTRON_URL"
        echo "2. Extract to: $(pwd)/electron-bin/"
        echo "3. Create symlink: ln -s electron-bin/Electron.app/Contents/MacOS/Electron node_modules/.bin/electron"
        echo "4. Run: npm start"
        exit 1
    fi
fi

echo ""

# Step 3: Launch the app
echo "🎮 Launching Gamified Tracker..."

# Force GPU disable flags and crash dump options
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1
export ELECTRON_DISABLE_GPU=1
export ELECTRON_DISABLE_GLES2=1
export LIBGL_ALWAYS_SOFTWARE=1

if [ -x "electron-bin/Electron.app/Contents/MacOS/Electron" ]; then
  echo "⚙️  Launching direct Electron binary (no npx)"
  ./electron-bin/Electron.app/Contents/MacOS/Electron . --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-accelerated-video --disable-accelerated-2d-canvas --no-sandbox
else
  if command -v npx &> /dev/null; then
    echo "⚙️  Launching via npx electron"
    npx electron . --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-accelerated-video --disable-accelerated-2d-canvas --no-sandbox
  else
    echo "⚙️  Launching via npm start"
    npm start -- --disable-gpu --disable-software-rasterizer --disable-gpu-compositing --disable-accelerated-video --disable-accelerated-2d-canvas --no-sandbox
  fi
fi
