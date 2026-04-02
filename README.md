# gamified-tracker
I am currently working on building a gamified tracker which is more interactive and fun to use to track day-to-day tasks.

A standalone macOS desktop app for 90-day task tracking with local file-based storage.

**Original:** Single-file HTML/CSS/JavaScript app  
**This version:** Electron-based desktop application for macOS

---

# 🎮 Gamified Tracker (Desktop App)

A simple, local-first productivity app that turns your daily tasks into a gamified experience.

Track progress, earn rewards, and stay consistent — all without relying on the cloud.

---

## ✨ Features

* ✅ Desktop app (no browser required)
* ✅ 100% local storage (no tracking, no cloud)
* ✅ Daily task tracking with history
* ✅ Automatic daily logs
* ✅ Import/export your data anytime
* ✅ Lightweight and fast

---

## 🚀 Getting Started

### Prerequisites

* macOS (tested on Big Sur and above)
* Node.js v16 or higher → https://nodejs.org/

---

### Install & Run

```bash
cd "your directory"
npm install
npm start
```

---

### Build the App

```bash
npm run build-mac
```

This will generate a `.app` and `.dmg` file for local installation.

---

## 📁 Project Structure

```
your directory/
├── src/
│   └── index.html        # UI
├── main.js               # Electron main process
├── preload.js            # Secure bridge (IPC)
├── package.json          # Config & dependencies
└── README.md
```

---

## 💾 Data & Storage

All data is stored locally on your machine.
Select the location manually


### Files:

* `app-state.json` → current app state
* `YYYY-MM-DD.json` → daily logs

You fully control your data.

---

## ⚙️ How It Works

* The UI runs inside Electron (desktop environment)
* The app communicates with the system using IPC
* Data is saved as local files instead of browser storage

---

## 🛠 Development

### Run the app

```bash
npm start
```

---

### Edit the UI

Modify:

```
src/index.html
```

Restart the app to see changes.

---

### Open Developer Tools

Inside the app:

```
Cmd + Option + I
```

---

## 📦 Build & Distribution

### Create installer

```bash
npm run build-mac
```

Output files will be generated in the `/dist` or `/out` directory.

---

## 🧪 Troubleshooting

### App not starting

```bash
npm install
npm start
```

---

### Logs not saving

Check if the folder exists:

```bash
ls ~/navvu-logs/
```

---

## 🔒 Privacy

* No internet connection required
* No analytics or tracking
* All data stays on your device

---

## 🧭 Roadmap

* [ ] Task analytics & insights
* [ ] Custom rewards system
* [ ] Theme customization
* [ ] Optional cloud backup

---

## 🤝 Contributing

1. Make changes to the code
2. Test locally using `npm start`
3. Build using `npm run build-mac`

---

## 📄 License
MIT License
Copyright (c) 2026 chikkamnavyageethika
Copyright (c) Electron contributors
Copyright (c) 2013-2020 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 🙌 Notes

This project is designed to be simple, private, and fully controlled by the user.

---

