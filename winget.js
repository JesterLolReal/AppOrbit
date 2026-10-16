const BaseAdapter = require('./base');

class WingetAdapter extends BaseAdapter {
  constructor() {
    super('winget');
    this.executable = 'winget';
  }

  getInstallCommand(packageId, options = {}) {
    // Validate packageId to prevent command injection
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid packageId format: ${packageId}`);
    }

    const args = [
      'install',
      '--id', packageId,
      '--exact',
      '--accept-package-agreements',
      '--accept-source-agreements'
    ];

    if (options.silent !== false) {
      args.push('--disable-interactivity');
    }

    return { command: this.executable, args };
  }

  getUpdateCommand(packageId, options = {}) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid packageId format: ${packageId}`);
    }

    const args = [
      'upgrade',
      '--id', packageId,
      '--exact',
      '--accept-package-agreements',
      '--accept-source-agreements'
    ];

    if (options.silent !== false) {
      args.push('--disable-interactivity');
    }

    return { command: this.executable, args };
  }

  getUninstallCommand(packageId, options = {}) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid packageId format: ${packageId}`);
    }

    const args = [
      'uninstall',
      '--id', packageId,
      '--exact'
    ];

    if (options.silent !== false) {
      args.push('--disable-interactivity');
    }

    return { command: this.executable, args };
  }

  getCheckInstalledCommand() {
    return { command: this.executable, args: ['list', '--accept-source-agreements'] };
  }

  getCheckUpdatesCommand() {
    return { command: this.executable, args: ['upgrade', '--accept-source-agreements'] };
  }

  parseInstalledList(output) {
    if (!output) return new Set();
    const installed = new Set();
    const lines = output.split('\n');
    let headerPassed = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.includes('---') && line.length > 5) {
        headerPassed = true;
        continue;
      }
      if (!headerPassed) continue;

      // Extract all word tokens that look like package IDs or names
      const words = line.split(/\s+/);
      for (const word of words) {
        const cleaned = word.trim().toLowerCase();
        // Winget IDs are typically dotted e.g. "Google.Chrome", "Microsoft.VisualStudioCode", "7zip.7zip"
        if (/^[a-z0-9-_]+\.[a-z0-9-_.]+$/i.test(cleaned)) {
          installed.add(cleaned);
        }
      }

      // Also support columns if split by 2+ spaces
      const columns = line.split(/\s{2,}/);
      if (columns.length >= 2) {
        const candidate = columns[1].trim().toLowerCase();
        if (candidate) installed.add(candidate);
      }
    }
    return installed;
  }

  parseUpdatesList(output) {
    if (!output) return [];
    const updates = [];
    const lines = output.split('\n');
    let headerPassed = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.includes('---') && line.length > 10) {
        headerPassed = true;
        continue;
      }
      if (!headerPassed) continue;

      const tokens = line.split(/\s{2,}/);
      if (tokens.length >= 4) {
        const name = tokens[0].trim();
        const packageId = tokens[1].trim();
        const currentVersion = tokens[2].trim();
        const newVersion = tokens[3].trim();
        if (packageId && newVersion) {
          updates.push({ name, packageId, currentVersion, newVersion });
        }
      }
    }
    return updates;
  }
}

module.exports = WingetAdapter;
