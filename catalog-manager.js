const fs = require('fs');
const path = require('path');
const https = require('https');

class CatalogManager {
  constructor(appDataPath) {
    this.appDataPath = appDataPath || __dirname;
    this.bundledPath = path.resolve(__dirname, '../data/catalog.json');
    this.cachePath = path.join(this.appDataPath, 'catalog-cache.json');
    this.catalog = null;
  }

  loadCatalog() {
    // 1. Try reading cached catalog if exists
    if (fs.existsSync(this.cachePath)) {
      try {
        const cachedRaw = fs.readFileSync(this.cachePath, 'utf-8');
        const parsed = JSON.parse(cachedRaw);
        if (this.validateCatalog(parsed)) {
          this.catalog = parsed;
          return this.catalog;
        }
      } catch (e) {
        console.warn('Failed to load cached catalog, falling back to bundled:', e.message);
      }
    }

    // 2. Load bundled catalog
    try {
      const bundledRaw = fs.readFileSync(this.bundledPath, 'utf-8');
      const parsed = JSON.parse(bundledRaw);
      this.catalog = parsed;
      return this.catalog;
    } catch (e) {
      console.error('Fatal error loading bundled catalog:', e);
      throw e;
    }
  }

  validateCatalog(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || !Array.isArray(data.categories) || !Array.isArray(data.apps)) {
      return false;
    }
    if (data.apps.length < 50) return false;

    // Check first 10 and sample entries
    for (const app of data.apps) {
      if (!app.id || !app.name || !app.category || !app.supportedOS || !app.architectures) {
        return false;
      }
    }
    return true;
  }

  async checkRemoteCatalogUpdate(updateUrl) {
    if (!updateUrl || !updateUrl.startsWith('https://')) {
      throw new Error('Catalog update source must be a secure HTTPS URL');
    }

    return new Promise((resolve, reject) => {
      https.get(updateUrl, { timeout: 8000 }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Server returned HTTP ${res.statusCode}`));
          return;
        }

        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (!this.validateCatalog(parsed)) {
              reject(new Error('Downloaded catalog failed schema validation'));
              return;
            }

            // Save to cache
            fs.writeFileSync(this.cachePath, JSON.stringify(parsed, null, 2), 'utf-8');
            this.catalog = parsed;
            resolve({
              updated: true,
              version: parsed.version,
              lastUpdated: parsed.lastUpdated,
              totalApps: parsed.apps.length
            });
          } catch (err) {
            reject(new Error(`Failed to parse catalog JSON: ${err.message}`));
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  getCatalog() {
    if (!this.catalog) {
      this.loadCatalog();
    }
    return this.catalog;
  }
}

module.exports = CatalogManager;
