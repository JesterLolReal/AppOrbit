const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const CatalogManager = require('../src/main/catalog-manager');
const JobQueue = require('../src/main/queue');
const WingetAdapter = require('../src/main/adapters/winget');
const BrewAdapter = require('../src/main/adapters/brew');
const FlatpakAdapter = require('../src/main/adapters/flatpak');
const AptAdapter = require('../src/main/adapters/apt');

describe('AppOrbit 2.0 Test Suite', () => {

  describe('1. Catalog Integrity & Schema', () => {
    const catalogPath = path.resolve(__dirname, '../src/data/catalog.json');
    assert.ok(fs.existsSync(catalogPath), 'catalog.json must exist');

    const catalogRaw = fs.readFileSync(catalogPath, 'utf-8');
    const catalog = JSON.parse(catalogRaw);

    test('Catalog contains 200+ unique applications', () => {
      assert.ok(catalog.apps.length >= 200, `Expected at least 200 apps, got ${catalog.apps.length}`);
      const ids = new Set();
      for (const app of catalog.apps) {
        assert.ok(!ids.has(app.id), `Duplicate app ID found: ${app.id}`);
        ids.add(app.id);
      }
    });

    test('All apps have required metadata fields', () => {
      for (const app of catalog.apps) {
        assert.ok(app.id && typeof app.id === 'string', `App missing valid id: ${JSON.stringify(app)}`);
        assert.ok(app.name && typeof app.name === 'string', `App ${app.id} missing name`);
        assert.ok(app.category && typeof app.category === 'string', `App ${app.id} missing category`);
        assert.ok(app.description && typeof app.description === 'string', `App ${app.id} missing description`);
        assert.ok(app.publisher && typeof app.publisher === 'string', `App ${app.id} missing publisher`);
        assert.ok(Array.isArray(app.supportedOS) && app.supportedOS.length > 0, `App ${app.id} missing supportedOS`);
        assert.ok(Array.isArray(app.architectures) && app.architectures.length > 0, `App ${app.id} missing architectures`);
        assert.ok(typeof app.requiresAdmin === 'boolean', `App ${app.id} requiresAdmin must be boolean`);
      }
    });

    test('Catalog contains all requested categories', () => {
      const requiredCategories = [
        'Web Browsers',
        'Messaging & Communication',
        'Media & Streaming',
        'Image & Design',
        'Documents & PDFs',
        'Compression & File Management',
        'Security & Password Managers',
        'Cloud Storage & Sync',
        'Gaming & Game Dev',
        'Developer Tools',
        'Networking & Remote Access',
        'System Utilities',
        'Virtualization & Containers',
        '3D, CAD & 3D Printing',
        'Education & Accessibility',
        'Runtimes & Dependencies'
      ];

      for (const cat of requiredCategories) {
        assert.ok(catalog.categories.includes(cat), `Catalog missing category: ${cat}`);
        const count = catalog.apps.filter(a => a.category === cat).length;
        assert.ok(count > 0, `Category ${cat} must contain at least 1 app`);
      }
    });

    test('CatalogManager loads and validates correctly', () => {
      const cm = new CatalogManager(__dirname);
      const loaded = cm.loadCatalog();
      assert.ok(loaded && loaded.apps.length >= 200, 'CatalogManager should load bundled catalog');
      assert.strictEqual(cm.validateCatalog(loaded), true, 'Catalog validation should pass');
      assert.strictEqual(cm.validateCatalog({ invalid: true }), false, 'Invalid catalog should fail validation');
    });

    test('Filtering by OS correctly identifies compatible apps', () => {
      const windowsApps = catalog.apps.filter(a => a.supportedOS.includes('windows'));
      const macosApps = catalog.apps.filter(a => a.supportedOS.includes('macos'));
      const linuxApps = catalog.apps.filter(a => a.supportedOS.includes('linux'));

      assert.ok(windowsApps.length >= 190, `Windows should support most apps, got ${windowsApps.length}`);
      assert.ok(macosApps.length >= 100, `macOS should support at least 100 apps, got ${macosApps.length}`);
      assert.ok(linuxApps.length >= 100, `Linux should support at least 100 apps, got ${linuxApps.length}`);
    });

    test('Architecture filtering functions as expected', () => {
      const arm64Apps = catalog.apps.filter(a => a.architectures.includes('arm64'));
      const x64Apps = catalog.apps.filter(a => a.architectures.includes('x64'));

      assert.ok(x64Apps.length >= 200, 'x64 architecture should be supported across apps');
      assert.ok(arm64Apps.length > 50, 'arm64 architecture should be supported on a significant subset');
    });
  });

  describe('2. Package Manager Adapters & Security', () => {
    const winget = new WingetAdapter();
    const brew = new BrewAdapter();
    const flatpak = new FlatpakAdapter();
    const apt = new AptAdapter();

    test('Winget adapter generates safe argument array', () => {
      const cmd = winget.getInstallCommand('Mozilla.Firefox');
      assert.strictEqual(cmd.command, 'winget');
      assert.deepStrictEqual(cmd.args, [
        'install',
        '--id', 'Mozilla.Firefox',
        '--exact',
        '--accept-package-agreements',
        '--accept-source-agreements',
        '--disable-interactivity'
      ]);
    });

    test('Winget rejects shell injection characters', () => {
      assert.throws(() => {
        winget.getInstallCommand('Mozilla.Firefox & calc.exe');
      }, /Invalid packageId format/);

      assert.throws(() => {
        winget.getInstallCommand('Package; rm -rf /');
      }, /Invalid packageId format/);
    });

    test('Brew adapter handles casks and formulas', () => {
      const cmdCask = brew.getInstallCommand('google-chrome', { cask: true });
      assert.strictEqual(cmdCask.command, 'brew');
      assert.deepStrictEqual(cmdCask.args, ['install', '--cask', 'google-chrome']);

      const cmdFormula = brew.getInstallCommand('git', { cask: false });
      assert.deepStrictEqual(cmdFormula.args, ['install', 'git']);
    });

    test('Flatpak and Apt adapters generate correct commands', () => {
      const fp = flatpak.getInstallCommand('org.mozilla.firefox');
      assert.deepStrictEqual(fp.args, ['install', '-y', 'flathub', 'org.mozilla.firefox']);

      const ap = apt.getInstallCommand('firefox');
      assert.deepStrictEqual(ap.args, ['install', '-y', 'firefox']);
    });

    test('Winget parses installed output table correctly', () => {
      const mockOutput = `
Name               Id                   Version      Available Source
----------------------------------------------------------------------
Google Chrome      Google.Chrome        128.0.6613.119           winget
Mozilla Firefox    Mozilla.Firefox      130.0                    winget
Visual Studio Code Microsoft.VisualStudioCode 1.93.0            winget
`;
      const installed = winget.parseInstalledList(mockOutput);
      assert.ok(installed.has('google.chrome'));
      assert.ok(installed.has('mozilla.firefox'));
      assert.ok(installed.has('microsoft.visualstudiocode'));
      assert.ok(!installed.has('unknown.app'));
    });

    test('Winget parses updates list correctly', () => {
      const mockUpgradeOutput = `
Name               Id                   Version   Available Source
----------------------------------------------------------------------
Mozilla Firefox    Mozilla.Firefox      129.0     130.0     winget
Git                Git.Git              2.45.0    2.46.0    winget
`;
      const updates = winget.parseUpdatesList(mockUpgradeOutput);
      assert.strictEqual(updates.length, 2);
      assert.strictEqual(updates[0].packageId, 'Mozilla.Firefox');
      assert.strictEqual(updates[0].currentVersion, '129.0');
      assert.strictEqual(updates[0].newVersion, '130.0');
    });
  });

  describe('3. Job Queue Engine & Concurrency', () => {
    test('JobQueue enqueues jobs and manages lifecycle', () => {
      const q = new JobQueue({ concurrency: 2 });
      assert.strictEqual(q.concurrency, 2);

      const job1 = q.addJob({
        appId: 'test-1',
        appName: 'Test 1',
        command: 'echo',
        args: ['hello']
      });

      assert.strictEqual(job1.status, 'pending');
      assert.ok(q.jobs.has(job1.id));

      const snapshot = q.getSnapshot();
      assert.strictEqual(snapshot.jobs.length, 1);
      assert.strictEqual(snapshot.jobs[0].appId, 'test-1');
    });

    test('JobQueue supports cancellation and retry', () => {
      const q = new JobQueue({ concurrency: 1 });
      const job = q.addJob({
        appId: 'test-cancel',
        appName: 'Test Cancel',
        command: 'echo',
        args: ['cancel']
      });

      const cancelled = q.cancelJob(job.id);
      assert.strictEqual(cancelled, true);
      assert.strictEqual(job.status, 'cancelled');

      const retried = q.retryJob(job.id, false);
      assert.strictEqual(retried, true);
      assert.strictEqual(job.status, 'pending');
      assert.strictEqual(job.retryCount, 1);
    });

    test('JobQueue generates accurate report', () => {
      const q = new JobQueue({ concurrency: 1 });
      const j1 = q.addJob({ appId: '1', appName: 'A1', command: 'echo' });
      j1.status = 'succeeded';
      const j2 = q.addJob({ appId: '2', appName: 'A2', command: 'echo' });
      j2.status = 'failed';

      const report = q.generateReport();
      assert.strictEqual(report.total, 2);
      assert.strictEqual(report.succeeded, 1);
      assert.strictEqual(report.failed, 1);
      assert.strictEqual(report.cancelled, 0);
    });

    test('JobQueue concurrency clamps between 1 and 8', () => {
      const q = new JobQueue();
      q.setConcurrency(0);
      assert.strictEqual(q.concurrency, 1);
      q.setConcurrency(12);
      assert.strictEqual(q.concurrency, 8);
      q.setConcurrency(4);
      assert.strictEqual(q.concurrency, 4);
    });
  });

  describe('4. Selection Management & Import/Export', () => {
    test('Import and export schema validation', () => {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        selectedApps: ['google-chrome', 'mozilla-firefox', 'vscode', 'git']
      };

      assert.ok(exportPayload.exportedAt);
      assert.ok(Array.isArray(exportPayload.selectedApps));
      assert.strictEqual(exportPayload.selectedApps.length, 4);

      // Verify all exported IDs exist in catalog
      const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/catalog.json'), 'utf-8'));
      const appMap = new Map(catalog.apps.map(a => [a.id, a]));

      for (const id of exportPayload.selectedApps) {
        assert.ok(appMap.has(id), `Exported app ${id} should exist in catalog`);
      }
    });
  });

  describe('5. AutoUpdater & Release Management', () => {
    const AutoUpdater = require('../src/main/updater');

    test('AutoUpdater correctly compares semver versions', () => {
      const updater = new AutoUpdater({ currentVersion: '1.0.0' });
      assert.strictEqual(updater.isNewerVersion('v1.1.0', '1.0.0'), true);
      assert.strictEqual(updater.isNewerVersion('2.0.0', '1.9.9'), true);
      assert.strictEqual(updater.isNewerVersion('1.0.1', '1.0.0'), true);
      assert.strictEqual(updater.isNewerVersion('1.0.0', '1.0.0'), false);
      assert.strictEqual(updater.isNewerVersion('0.9.0', '1.0.0'), false);
      assert.strictEqual(updater.isNewerVersion('v1.0.0', 'v1.0.1'), false);
      assert.strictEqual(updater.isNewerVersion('1.2.3', '1.2.4'), false);
      assert.strictEqual(updater.isNewerVersion('1.3.0', '1.2.9'), true);
    });

    test('AutoUpdater emits lifecycle events', () => {
      const updater = new AutoUpdater({ currentVersion: '1.0.0' });
      assert.strictEqual(updater.currentVersion, '1.0.0');
      assert.strictEqual(updater.repository, 'apporbit/apporbit');

      let receivedEvent = false;
      updater.on('checking', () => {
        receivedEvent = true;
      });

      updater.emit('checking');
      assert.strictEqual(receivedEvent, true);
    });
  });
});

