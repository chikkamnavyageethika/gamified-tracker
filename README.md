# Gamified Tracker (Electron MVP)

Desktop productivity tracker built with Electron for a 90-day gamified workflow.

A standalone macOS desktop app for 90-day task tracking with local file-based storage.

**Original:** Single-file HTML/CSS/JavaScript app  
**This version:** Electron-based desktop application for macOS

---

## Features

✅ **Standalone Desktop App** — No browser required  
✅ **Local File Storage** — Your data lives in `Logs_directory` (you control it)  
✅ **Same UI & Functionality** — Identical to the web version  
✅ **Daily Logs** — Automatic snapshots of daily progress  
✅ **Easy Export/Import** — Backup or migrate your data  
✅ **Zero Cloud** — 100% local, zero tracking  

## What This Repo Contains

- Electron main process: main.js
- Secure preload bridge: preload.js
- UI and app logic: src/index.html
- Storage adapter: src/storage-adapter.js
- Optional setup launcher script (macOS): start.sh

## Is This Folder Enough To Build The App?

Yes. This repository is sufficient to build and package the desktop app.

Verified on macOS:

- npm run build completes successfully
- Electron Builder produces artifacts in dist
  - DMG
  - macOS ZIP

Notes:

- macOS code signing is skipped unless you configure a Developer ID certificate.
- Default Electron icon is used unless you add a custom app icon in build config.

## Quick Start

Prerequisites:

- Node.js 18+ (Node 20 recommended)
- npm
- macOS for native mac packaging

Install:

	npm install

Run in development:

	npm start

Build distributables:

	npm run build

Build macOS only:

	npm run build-mac

## App Behavior Notes

- App data is stored in browser storage and can also be mirrored to a selected logs folder.
- End-of-day logs can be written as Markdown, TXT, or JSON.
- Export/Import is available from Settings.

## GitHub-Friendly Repo Guidance

- Keep package-lock.json committed for reproducible installs.
- Do not commit build outputs (dist is ignored).
- Do not commit local dependencies (node_modules is ignored).
- Do not commit secrets or environment files (.env is ignored).

## Suggested Next Improvements

- Add app icons for macOS packaging.
- Add CI workflow for install + build checks.
- Add tests for storage behavior and daily-log formatting.

