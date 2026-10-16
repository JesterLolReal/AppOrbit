class BaseAdapter {
  constructor(name) {
    this.name = name;
  }

  getInstallCommand(packageId, options = {}) {
    throw new Error('Not implemented');
  }

  getUpdateCommand(packageId, options = {}) {
    throw new Error('Not implemented');
  }

  getUninstallCommand(packageId, options = {}) {
    throw new Error('Not implemented');
  }

  getCheckInstalledCommand() {
    throw new Error('Not implemented');
  }

  getCheckUpdatesCommand() {
    throw new Error('Not implemented');
  }

  parseInstalledList(output) {
    return [];
  }

  parseUpdatesList(output) {
    return [];
  }
}

module.exports = BaseAdapter;
