const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Force absolute GPU disable to avoid GPU-driver crashes on some macOS environments
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-direct-composition');
app.commandLine.appendSwitch('disable-accelerated-video-decode');
app.commandLine.appendSwitch('disable-accelerated-video-encode');
app.commandLine.appendSwitch('disable-accelerated-2d-canvas');
app.commandLine.appendSwitch('no-sandbox');

app.on('gpu-process-crashed', (event, killed) => {
  console.warn('GPU process crashed (killed=' + killed + '), disabling HW accel and reloading...');
  app.disableHardwareAcceleration();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.reload();
  }
});

let mainWindow;
let logsFolder = null;

// Create window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.webContents.openDevTools(); // Remove in production
}

// Initialize app
app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Select Logs Folder',
          accelerator: 'CmdOrCtrl+O',
          click: selectLogsFolder
        },
        { type: 'separator' },
        {
          label: 'Export All Data',
          accelerator: 'CmdOrCtrl+E',
          click: exportData
        },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Navvu To-Do List',
              message: 'Navvu To-Do List v1.0',
              detail: 'A 90-day productivity tracker. Select a logs folder via File > Select Logs Folder.'
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Select logs folder
async function selectLogsFolder() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Logs Folder'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    logsFolder = result.filePaths[0];
    mainWindow.webContents.send('logs-folder-selected', logsFolder);
  }
}

// Export data
async function exportData() {
  if (!mainWindow) return;

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `navvu-backup-${Date.now()}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });

  if (!result.canceled) {
    mainWindow.webContents.send('request-state-for-export', result.filePath);
  }
}

// IPC Handlers

ipcMain.handle('get-logs-folder', () => logsFolder);

ipcMain.handle('save-day-log', async (event, dateStr, data) => {
  if (!logsFolder) {
    return { success: false, error: 'No logs folder selected' };
  }

  try {
    const ext = data.ext || 'json';
    const filePath = path.join(logsFolder, `${dateStr}.${ext}`);
    const content = data.content || JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-day-log', async (event, dateStr) => {
  if (!logsFolder) return null;

  try {
    const filePath = path.join(logsFolder, `${dateStr}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading log:', err);
  }
  return null;
});

ipcMain.handle('list-day-logs', async (event) => {
  if (!logsFolder) return [];

  try {
    const files = fs.readdirSync(logsFolder);
    return files.filter(f => (f.endsWith('.json') || f.endsWith('.md') || f.endsWith('.txt')) && f.match(/^\d{4}-\d{2}-\d{2}\./));
  } catch (err) {
    return [];
  }
});

ipcMain.handle('select-logs-folder', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Logs Folder'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    logsFolder = result.filePaths[0];
    mainWindow.webContents.send('logs-folder-selected', logsFolder);
    return { success: true, path: logsFolder };
  }
  return { success: false };
});

ipcMain.handle('set-logs-folder', async (event, folder) => {
  if (!folder) {
    return { success: false, error: 'Folder path empty' };
  }
  logsFolder = folder;
  if (mainWindow) {
    mainWindow.webContents.send('logs-folder-selected', logsFolder);
  }
  return { success: true, path: logsFolder };
});

ipcMain.handle('export-state', async (event, filePath, state) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      message: 'Export successful',
      detail: `Data exported to ${filePath}`
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.on('state-for-export', (event, filePath, state) => {
  ipcMain.emit('export-state', filePath, state);
});
