const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { app } = require('electron');
const EventEmitter = require('events');

class AutoUpdater extends EventEmitter {
  constructor(options = {}) {
    super();
    this.currentVersion = options.currentVersion || (app ? app.getVersion() : '1.0.0');
    this.repository = options.repository || 'apporbit/apporbit';
    this.autoCheckOnStartup = true;
    this.isChecking = false;
    this.isDownloading = false;
    this.downloadedFilePath = null;
  }

  isNewerVersion(remote, local) {
    const cleanRemote = remote.replace(/^v/, '').trim();
    const cleanLocal = local.replace(/^v/, '').trim();

    const rParts = cleanRemote.split('.').map(n => parseInt(n, 10) || 0);
    const lParts = cleanLocal.split('.').map(n => parseInt(n, 10) || 0);

    for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
      const r = rParts[i] || 0;
      const l = lParts[i] || 0;
      if (r > l) return true;
      if (r < l) return false;
    }
    return false;
  }

  async checkForUpdates() {
    if (this.isChecking) return;
    this.isChecking = true;
    this.emit('checking');

    return new Promise((resolve) => {
      const url = `https://api.github.com/repos/${this.repository}/releases/latest`;
      const req = https.get(url, {
        headers: {
          'User-Agent': 'AppOrbit-AutoUpdater/2.0'
        },
        timeout: 6000
      }, (res) => {
        if (res.statusCode !== 200) {
          this.isChecking = false;
          const result = { updateAvailable: false, error: `GitHub API returned ${res.statusCode}` };
          this.emit('not-available', result);
          resolve(result);
          return;
        }

        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          this.isChecking = false;
          try {
            const release = JSON.parse(raw);
            const latestVersion = (release.tag_name || release.name || '').replace(/^v/, '');
            const hasUpdate = this.isNewerVersion(latestVersion, this.currentVersion);

            // Find asset for current platform
            const platform = process.platform;
            let matchedAsset = null;
            if (Array.isArray(release.assets)) {
              if (platform === 'win32') {
                matchedAsset = release.assets.find(a => a.name.endsWith('.exe')) || release.assets[0];
              } else if (platform === 'darwin') {
                matchedAsset = release.assets.find(a => a.name.endsWith('.dmg')) || release.assets[0];
              } else {
                matchedAsset = release.assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb')) || release.assets[0];
              }
            }

            const info = {
              updateAvailable: hasUpdate,
              currentVersion: this.currentVersion,
              latestVersion: latestVersion,
              releaseName: release.name || release.tag_name,
              releaseNotes: release.body || 'New features, updated package catalog, and performance improvements.',
              publishedAt: release.published_at,
              assetUrl: matchedAsset ? matchedAsset.browser_download_url : release.html_url,
              assetName: matchedAsset ? matchedAsset.name : null,
              assetSize: matchedAsset ? matchedAsset.size : 0,
              htmlUrl: release.html_url
            };

            if (hasUpdate) {
              this.emit('update-available', info);
            } else {
              this.emit('not-available', info);
            }

            resolve(info);
          } catch (e) {
            const errResult = { updateAvailable: false, error: e.message };
            this.emit('error', errResult);
            resolve(errResult);
          }
        });
      });

      req.on('error', (err) => {
        this.isChecking = false;
        const errResult = { updateAvailable: false, error: err.message };
        this.emit('error', errResult);
        resolve(errResult);
      });
    });
  }

  async downloadUpdate(downloadUrl, assetName = 'AppOrbit-Update.exe') {
    if (this.isDownloading) return;
    this.isDownloading = true;

    const tempDir = os.tmpdir();
    const destPath = path.join(tempDir, assetName);
    this.downloadedFilePath = destPath;

    return new Promise((resolve, reject) => {
      const handleDownload = (currentUrl) => {
        https.get(currentUrl, {
          headers: { 'User-Agent': 'AppOrbit-AutoUpdater/2.0' }
        }, (res) => {
          // Handle GitHub asset redirect to AWS S3
          if (res.statusCode === 302 || res.statusCode === 301) {
            handleDownload(res.headers.location);
            return;
          }

          if (res.statusCode !== 200) {
            this.isDownloading = false;
            reject(new Error(`Download failed with status: ${res.statusCode}`));
            return;
          }

          const total = parseInt(res.headers['content-length'] || '0', 10);
          let transferred = 0;
          const fileStream = fs.createWriteStream(destPath);

          res.on('data', (chunk) => {
            transferred += chunk.length;
            if (total > 0) {
              const percent = Math.round((transferred / total) * 100);
              this.emit('download-progress', { percent, transferred, total });
            }
          });

          res.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close(() => {
              this.isDownloading = false;
              this.emit('update-downloaded', { filePath: destPath });
              resolve({ success: true, filePath: destPath });
            });
          });

          fileStream.on('error', (err) => {
            this.isDownloading = false;
            fs.unlink(destPath, () => {});
            reject(err);
          });
        }).on('error', (err) => {
          this.isDownloading = false;
          reject(err);
        });
      };

      handleDownload(downloadUrl);
    });
  }

  applyUpdateAndRestart() {
    if (!this.downloadedFilePath || !fs.existsSync(this.downloadedFilePath)) {
      throw new Error('No downloaded update file found to apply');
    }

    if (process.platform === 'win32') {
      spawn(this.downloadedFilePath, ['/passive'], {
        detached: true,
        stdio: 'ignore'
      }).unref();
      if (app) app.quit();
    } else {
      // macOS or Linux: open package or inform user
      const { shell } = require('electron');
      shell.openPath(this.downloadedFilePath);
      if (app) app.quit();
    }
  }
}

module.exports = AutoUpdater;
