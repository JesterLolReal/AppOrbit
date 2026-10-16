const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apporbit', {
  // System info
  getSystemInfo: () => ipcRenderer.invoke('system:get-info'),

  // Catalog
  getCatalog: () => ipcRenderer.invoke('catalog:get'),
  updateCatalog: (url) => ipcRenderer.invoke('catalog:update', url),

  // Installed & updates
  scanInstalled: () => ipcRenderer.invoke('apps:scan-installed'),
  scanUpdates: () => ipcRenderer.invoke('apps:scan-updates'),
  launchApp: (appId) => ipcRenderer.invoke('apps:launch', appId),

  // Job Queue
  startBatch: (jobRequests, options) => ipcRenderer.invoke('queue:start', jobRequests, options),
  cancelJob: (jobId) => ipcRenderer.invoke('queue:cancel-job', jobId),
  cancelAllJobs: () => ipcRenderer.invoke('queue:cancel-all'),
  retryJob: (jobId) => ipcRenderer.invoke('queue:retry-job', jobId),
  clearFinishedJobs: () => ipcRenderer.invoke('queue:clear-finished'),
  getQueueSnapshot: () => ipcRenderer.invoke('queue:get-snapshot'),

  // Selections Export / Import
  exportSelections: (data) => ipcRenderer.invoke('selections:export', data),
  importSelections: () => ipcRenderer.invoke('selections:import'),

  // Shell / URL
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),

  // Auto Updater
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: (payload) => ipcRenderer.invoke('updater:download', payload),
  applyUpdate: () => ipcRenderer.invoke('updater:apply'),

  // Event Listeners - Queue
  onJobStatus: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('job:status', handler);
    return () => ipcRenderer.removeListener('job:status', handler);
  },
  onJobProgress: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('job:progress', handler);
    return () => ipcRenderer.removeListener('job:progress', handler);
  },
  onJobLog: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('job:log', handler);
    return () => ipcRenderer.removeListener('job:log', handler);
  },
  onQueueFinished: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('queue:finished', handler);
    return () => ipcRenderer.removeListener('queue:finished', handler);
  },

  // Event Listeners - Auto Updater
  onUpdaterChecking: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('updater:checking', handler);
    return () => ipcRenderer.removeListener('updater:checking', handler);
  },
  onUpdateAvailable: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('updater:available', handler);
    return () => ipcRenderer.removeListener('updater:available', handler);
  },
  onUpdateNotAvailable: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('updater:not-available', handler);
    return () => ipcRenderer.removeListener('updater:not-available', handler);
  },
  onUpdateProgress: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('updater:progress', handler);
    return () => ipcRenderer.removeListener('updater:progress', handler);
  },
  onUpdateDownloaded: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('updater:downloaded', handler);
    return () => ipcRenderer.removeListener('updater:downloaded', handler);
  },
  onUpdaterError: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('updater:error', handler);
    return () => ipcRenderer.removeListener('updater:error', handler);
  }
});

