const BaseAdapter = require('./base');

class FlatpakAdapter extends BaseAdapter {
  constructor() {
    super('flatpak');
    this.executable = 'flatpak';
  }

  getInstallCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid flatpak packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['install', '-y', 'flathub', packageId] };
  }

  getUpdateCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid flatpak packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['update', '-y', packageId] };
  }

  getUninstallCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid flatpak packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['uninstall', '-y', packageId] };
  }

  getCheckInstalledCommand() {
    return { command: this.executable, args: ['list', '--app', '--columns=application'] };
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

module.exports = FlatpakAdapter;
