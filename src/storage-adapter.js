/**
 * Storage Adapter - Replace localStorage with Electron file I/O
 * Saves state.json + individual day logs
 */

// Check if running in Electron
const IS_ELECTRON = typeof window !== 'undefined' && window.electron;

class StorageAdapter {
  constructor() {
    this.logsFolder = null;
    this.stateFile = 'app-state';
    this.initialized = false;
    
    // Create a promise that resolves when storage is ready
    this.ready = this.init();
  }

  async init() {
    if (!IS_ELECTRON) {
      console.log('Not running in Electron, localStorage fallback active');
      this.initialized = true;
      return;
    }
    
    try {
      this.logsFolder = await window.electron.getLogsFolder();
      this.initialized = true;
      console.log('Storage initialized, logs folder:', this.logsFolder);
      
      // Listen for folder selection
      window.electron.onLogsFolderSelected((folder) => {
        this.logsFolder = folder;
        // Removed window.location.reload() to prevent infinite loop
        console.log('Logs folder updated:', folder);
      });
      
      // Listen for export requests
      window.electron.onRequestStateForExport((filePath) => {
        this.exportState(filePath);
      });
    } catch (err) {
      console.error('Storage init error:', err);
      this.initialized = false;
    }
  }

  async setItem(key, value) {
    // Always keep localStorage state to ensure app continues working in case of no selected folder.
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }

    if (!IS_ELECTRON || !this.initialized || !this.logsFolder) {
      return;
    }

    try {
         if (key === 'gamified-tracker-v1') {
        // Save to external folder as well
        const parsed = JSON.parse(value);
        await window.electron.saveDayLog(this.stateFile, { content: JSON.stringify(parsed, null, 2), format: 'json', ext: 'json' });
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  }

  async getItem(key) {
    if (!IS_ELECTRON || !this.initialized || !this.logsFolder) {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    }

    try {
      if (key === 'gamified-tracker-v1') {
        // Primary file: app-state.json. Fallback supports older app-state.json.json naming.
        let data = await window.electron.loadDayLog(this.stateFile);
        if (!data) {
          data = await window.electron.loadDayLog('app-state.json');
        }
        return data ? JSON.stringify(data) : localStorage.getItem(key);
      }
    } catch (err) {
      console.error('Load error:', err);
      return localStorage.getItem(key);
    }
  }

  async removeItem(key) {
    // In a real app, you'd delete the file
    // For now, just clear the content
      if (key === 'gamified-tracker-v1') {
      await this.setItem(key, JSON.stringify({}));
    }
  }

  async exportState(filePath) {
    if (!IS_ELECTRON) return;
    
    try {
        const stateStr = localStorage.getItem('gamified-tracker-v1');
      if (stateStr) {
        await window.electron.exportState(filePath, JSON.parse(stateStr));
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  }

  async loadDayLog(dateStr) {
    if (!IS_ELECTRON || !this.initialized || !this.logsFolder) {
      return null;
    }
    return await window.electron.loadDayLog(dateStr);
  }

  async saveDayLog(dateStr, data) {
    if (!IS_ELECTRON || !this.initialized || !this.logsFolder) {
      return;
    }
    await window.electron.saveDayLog(dateStr, data);
  }
}

// Create global instance and expose to window
const storage = new StorageAdapter();
if (typeof window !== 'undefined') {
  window.gamifiedTrackerStorage = storage;
}
