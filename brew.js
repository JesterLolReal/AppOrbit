const BaseAdapter = require('./base');

class BrewAdapter extends BaseAdapter {
  constructor() {
    super('brew');
    this.executable = 'brew';
  }

  getInstallCommand(packageId, options = {}) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._/@+-]+$/.test(packageId)) {
      throw new Error(`Invalid brew packageId: ${packageId}`);
    }

    const args = ['install'];
    if (options.cask) {
      args.push('--cask');
    }
    args.push(packageId);

    return { command: this.executable, args };
  }

  getUpdateCommand(packageId, options = {}) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._/@+-]+$/.test(packageId)) {
      throw new Error(`Invalid brew packageId: ${packageId}`);
    }

    const args = ['upgrade'];
    if (options.cask) {
      args.push('--cask');
    }
    args.push(packageId);

    return { command: this.executable, args };
  }

  getUninstallCommand(packageId, options = {}) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._/@+-]+$/.test(packageId)) {
      throw new Error(`Invalid brew packageId: ${packageId}`);
    }

    const args = ['uninstall'];
    if (options.cask) {
      args.push('--cask');
    }
    args.push(packageId);

    return { command: this.executable, args };
  }

  getCheckInstalledCommand() {
    return { command: this.executable, args: ['list', '--formula', '--cask'] };
  }

  getCheckUpdatesCommand() {
    return { command: this.executable, args: ['outdated', '--json=v2'] };
  }

  parseInstalledList(output) {
    if (!output) return new Set();
    const installed = new Set();
    const lines = output.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line) {
        installed.add(line.toLowerCase());
      }
    }
    return installed;
  }
}

module.exports = BrewAdapter;
