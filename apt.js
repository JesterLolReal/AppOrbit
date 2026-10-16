const BaseAdapter = require('./base');

class AptAdapter extends BaseAdapter {
  constructor() {
    super('apt');
    this.executable = 'apt-get';
  }

  getInstallCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid apt packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['install', '-y', packageId] };
  }

  getUpdateCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid apt packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['install', '--only-upgrade', '-y', packageId] };
  }

  getUninstallCommand(packageId) {
    if (!packageId || typeof packageId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(packageId)) {
      throw new Error(`Invalid apt packageId: ${packageId}`);
    }
    return { command: this.executable, args: ['remove', '-y', packageId] };
  }

  getCheckInstalledCommand() {
    return { command: 'dpkg-query', args: ['-W', '-f=${Package}\n'] };
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

module.exports = AptAdapter;
