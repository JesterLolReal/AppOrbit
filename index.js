const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const { detectSystemInfo } = require('./system');
const CatalogManager = require('./catalog-manager');
const JobQueue = require('./queue');
const InstalledDetector = require('./installed-detector');

const WingetAdapter = require('./adapters/winget');
const BrewAdapter = require('./adapters/brew');
const FlatpakAdapter = require('./adapters/flatpak');
const AptAdapter = require('./adapters/apt');
const AutoUpdater = require('./updater');

let mainWindow = null;
let systemInfo = null;
let catalogManager = null;
let queue = null;
let installedDetector = null;
let autoUpdater = null;

const adapters = {
  windows: new WingetAdapter(),
  macos: new BrewAdapter(),
  linux: new FlatpakAdapter()
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#080c16',
    title: 'AppOrbit — Every app. One orbit.',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

function setupIPC() {
  // 1. System Info
  ipcMain.handle('system:get-info', async () => {
    if (!systemInfo) {
      systemInfo = await detectSystemInfo();
    }
    return systemInfo;
  });

  // 2. Catalog
  ipcMain.handle('catalog:get', async () => {
    return catalogManager.getCatalog();
  });

  ipcMain.handle('catalog:update', async (event, url) => {
    try {
      const result = await catalogManager.checkRemoteCatalogUpdate(url);
      return { success: true, ...result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  // 3. Apps Installed & Updates
  ipcMain.handle('apps:scan-installed', async () => {
    const platform = systemInfo ? systemInfo.platform : 'windows';
    return await installedDetector.scanInstalled(platform);
  });

  ipcMain.handle('apps:scan-updates', async () => {
    const platform = systemInfo ? systemInfo.platform : 'windows';
    return await installedDetector.scanUpdates(platform);
  });

  ipcMain.handle('apps:launch', async (event, appId) => {
    const catalog = catalogManager.getCatalog();
    const appData = catalog.apps.find(a => a.id === appId);
    if (!appData) return { success: false, error: 'App not found' };

    // Safe execution or winget run
    if (appData.website) {
      shell.openExternal(appData.website);
      return { success: true, openedWebsite: true };
    }
    return { success: false, error: 'Cannot launch' };
  });

  // 4. Job Queue
  ipcMain.handle('queue:start', async (event, jobRequests, options = {}) => {
    if (options.concurrency) {
      queue.setConcurrency(options.concurrency);
    }

    const platform = systemInfo ? systemInfo.platform : 'windows';
    const adapter = adapters[platform];
    if (!adapter) {
      return { success: false, error: `No package manager adapter for platform ${platform}` };
    }

    const jobs = [];
    const catalog = catalogManager.getCatalog();

    for (const req of jobRequests) {
      const app = catalog.apps.find(a => a.id === req.appId);
      if (!app) continue;

      const pkg = app.packages?.[platform];
      if (!pkg || !pkg.packageId) continue;

      let cmdObj;
      if (req.operation === 'update') {
        cmdObj = adapter.getUpdateCommand(pkg.packageId, { cask: pkg.cask });
      } else if (req.operation === 'uninstall') {
        cmdObj = adapter.getUninstallCommand(pkg.packageId, { cask: pkg.cask });
      } else {
        cmdObj = adapter.getInstallCommand(pkg.packageId, { cask: pkg.cask });
      }

      jobs.push({
        appId: app.id,
        appName: app.name,
        category: app.category,
        operation: req.operation || 'install',
        command: cmdObj.command,
        args: cmdObj.args
      });
    }

    queue.addBatch(jobs);
    queue.start(); // runs asynchronously in background

    return { success: true, enqueuedCount: jobs.length };
  });

  ipcMain.handle('queue:cancel-job', (event, jobId) => {
    return queue.cancelJob(jobId);
  });

  ipcMain.handle('queue:cancel-all', () => {
    queue.cancelAll();
    return true;
  });

  ipcMain.handle('queue:retry-job', (event, jobId) => {
    return queue.retryJob(jobId);
  });

  ipcMain.handle('queue:clear-finished', () => {
    queue.clearFinished();
    return true;
  });

  ipcMain.handle('queue:get-snapshot', () => {
    return queue.getSnapshot();
  });

  // 5. Selections Export / Import
  ipcMain.handle('selections:export', async (event, data) => {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export AppOrbit Selections',
      defaultPath: 'apporbit-selections.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, filePath };
    }
    return { success: false, cancelled: true };
  });

  ipcMain.handle('selections:import', async () => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Import AppOrbit Selections',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile']
    });

    if (filePaths && filePaths.length > 0) {
      try {
        const raw = fs.readFileSync(filePaths[0], 'utf-8');
        const parsed = JSON.parse(raw);
        return { success: true, data: parsed };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    return { success: false, cancelled: true };
  });

    // 6. Shell
    ipcMain.handle('shell:open-external', (event, url) => {
      if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        shell.openExternal(url);
        return true;
      }
      return false;
    });

    // 7. Auto Updater
    ipcMain.handle('updater:check', async () => {
      if (!autoUpdater) return { updateAvailable: false, error: 'Updater not initialized' };
      return await autoUpdater.checkForUpdates();
    });

    ipcMain.handle('updater:download', async (event, payload = {}) => {
      if (!autoUpdater) return { success: false, error: 'Updater not initialized' };
      return await autoUpdater.downloadUpdate(payload.assetUrl, payload.assetName);
    });

    ipcMain.handle('updater:apply', () => {
      if (!autoUpdater) return false;
      return autoUpdater.applyUpdateAndRestart();
    });
  }

app.whenReady().then(async () => {
  systemInfo = await detectSystemInfo();
  catalogManager = new CatalogManager(app.getPath('userData'));
  catalogManager.loadCatalog();
  installedDetector = new InstalledDetector(adapters);
  queue = new JobQueue({ concurrency: 1 });

  // Forward queue events to renderer
  queue.on('job-status', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('job:status', data);
    }
  });

  queue.on('job-progress', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('job:progress', data);
    }
  });

  queue.on('job-log', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('job:log', data);
    }
  });

  queue.on('queue-finished', (report) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('queue:finished', report);
    }
  });

  // Initialize AutoUpdater
  autoUpdater = new AutoUpdater({
    currentVersion: app.getVersion() || '1.0.0',
    repository: 'apporbit/apporbit'
  });

  autoUpdater.on('checking', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:checking');
    }
  });

  autoUpdater.on('update-available', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:available', info);
    }
  });

  autoUpdater.on('not-available', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:not-available', info);
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:progress', progress);
    }
  });

  autoUpdater.on('update-downloaded', (res) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:downloaded', res);
    }
  });

  autoUpdater.on('error', (err) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:error', err);
    }
  });

  setupIPC();
  createWindow();

  // Automatic check for updates on startup after UI is visible
  setTimeout(() => {
    if (autoUpdater) {
      autoUpdater.checkForUpdates().catch(e => console.log('AutoUpdater background check:', e.message));
    }
  }, 3500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
