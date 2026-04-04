const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('electron', {
  getLogsFolder: () => ipcRenderer.invoke('get-logs-folder'),
  setLogsFolder: (folder) => ipcRenderer.invoke('set-logs-folder', folder),
  saveDayLog: (dateStr, data) => ipcRenderer.invoke('save-day-log', dateStr, data),
  loadDayLog: (dateStr) => ipcRenderer.invoke('load-day-log', dateStr),
  listDayLogs: () => ipcRenderer.invoke('list-day-logs'),
  selectLogsFolder: () => ipcRenderer.invoke('select-logs-folder'),
  exportState: (filePath, state) => ipcRenderer.invoke('export-state', filePath, state),
  onLogsFolderSelected: (callback) => {
    ipcRenderer.on('logs-folder-selected', (event, folder) => callback(folder));
  },
  onRequestStateForExport: (callback) => {
    ipcRenderer.on('request-state-for-export', (event, filePath) => callback(filePath));
  }
});
