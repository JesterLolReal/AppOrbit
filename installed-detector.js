const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

class InstalledDetector {
  constructor(adapters) {
    this.adapters = adapters;
    this.cache = {
      installedIds: new Set(),
      updates: new Map(), // packageId -> { currentVersion, newVersion }
      lastChecked: 0
    };
  }

  async scanInstalled(platform) {
    const adapter = this.adapters[platform];
    if (!adapter) {
      return { installed: [], updates: [] };
    }

    try {
      const { command, args } = adapter.getCheckInstalledCommand();
      const { stdout } = await execFileAsync(command, args, { timeout: 15000 });
      const installedSet = adapter.parseInstalledList(stdout);

      this.cache.installedIds = installedSet;
      this.cache.lastChecked = Date.now();

      return {
        installed: Array.from(installedSet),
        lastChecked: this.cache.lastChecked
      };
    } catch (e) {
      console.warn('Failed to scan installed apps via CLI:', e.message);
      return { installed: Array.from(this.cache.installedIds), error: e.message };
    }
  }

  async scanUpdates(platform) {
    const adapter = this.adapters[platform];
    if (!adapter || !adapter.getCheckUpdatesCommand) {
      return { updates: [] };
    }

    try {
      const { command, args } = adapter.getCheckUpdatesCommand();
      const { stdout } = await execFileAsync(command, args, { timeout: 20000 });
      const updates = adapter.parseUpdatesList(stdout);

      this.cache.updates.clear();
      for (const u of updates) {
        this.cache.updates.set(u.packageId.toLowerCase(), u);
      }

      return { updates };
    } catch (e) {
      console.warn('Failed to scan updates via CLI:', e.message);
      return { updates: [], error: e.message };
    }
  }

  isInstalled(app, platform) {
    if (!this.cache.installedIds || this.cache.installedIds.size === 0) return false;
    const pkg = app.packages?.[platform];
    if (!pkg || !pkg.packageId) return false;

    const lowerId = pkg.packageId.toLowerCase();
    if (this.cache.installedIds.has(lowerId)) return true;

    // Check partial or alternative names
    for (const id of this.cache.installedIds) {
      if (id.includes(lowerId) || lowerId.includes(id)) {
        return true;
      }
    }

    return false;
  }

  getUpdateInfo(app, platform) {
    const pkg = app.packages?.[platform];
    if (!pkg || !pkg.packageId) return null;
    return this.cache.updates.get(pkg.packageId.toLowerCase()) || null;
  }
}

module.exports = InstalledDetector;
