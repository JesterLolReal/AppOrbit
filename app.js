// AppOrbit 2.0 Client Application Logic
(function () {
  'use strict';

  const state = {
    catalog: null,
    systemInfo: null,
    installedApps: new Set(),
    availableUpdates: new Map(),
    selectedApps: new Set(),
    favorites: new Set(JSON.parse(localStorage.getItem('apporbit_favorites') || '[]')),
    history: JSON.parse(localStorage.getItem('apporbit_history') || '[]'),
    activeView: 'discover',
    activeCategory: 'all',
    searchQuery: '',
    platformFilter: 'windows',
    installFilter: 'all',
    isListView: false,
    concurrency: 1,
    activeDrawerApp: null,
    updateInfo: null,
    updateDownloaded: false,
    isDownloadingUpdate: false
  };

  // DOM Elements
  const elements = {
    brandLogoSlot: document.getElementById('brand-logo-slot'),
    systemOsIndicator: document.getElementById('system-os-indicator'),
    catalogCountBadge: document.getElementById('catalog-count-badge'),
    installedCountBadge: document.getElementById('installed-count-badge'),
    updatesCountBadge: document.getElementById('updates-count-badge'),
    favoritesCountBadge: document.getElementById('favorites-count-badge'),
    queueCountBadge: document.getElementById('queue-count-badge'),
    mainSearchInput: document.getElementById('main-search-input'),
    topSearchIcon: document.getElementById('top-search-icon'),
    btnToggleView: document.getElementById('btn-toggle-view'),
    btnRefreshStatus: document.getElementById('btn-refresh-status'),
    btnExportSelections: document.getElementById('btn-export-selections'),
    btnImportSelections: document.getElementById('btn-import-selections'),
    categoryChipsContainer: document.getElementById('category-chips-container'),
    platformFilter: document.getElementById('platform-filter'),
    installFilter: document.getElementById('install-filter'),
    btnSelectVisible: document.getElementById('btn-select-visible'),
    btnDeselectAll: document.getElementById('btn-deselect-all'),
    btnSelectCategory: document.getElementById('btn-select-category'),
    appsGridContainer: document.getElementById('apps-grid-container'),
    selectionBasket: document.getElementById('selection-basket'),
    basketCount: document.getElementById('basket-count'),
    basketText: document.getElementById('basket-text'),
    btnBasketClear: document.getElementById('btn-basket-clear'),
    btnBasketReview: document.getElementById('btn-basket-review'),
    rocketIconSlot: document.getElementById('rocket-icon-slot'),
    installModal: document.getElementById('install-modal'),
    modalAppCount: document.getElementById('modal-app-count'),
    modalAppList: document.getElementById('modal-app-list'),
    btnModalClose: document.getElementById('btn-modal-close'),
    btnModalCancel: document.getElementById('btn-modal-cancel'),
    btnModalConfirm: document.getElementById('btn-modal-confirm'),
    detailsDrawer: document.getElementById('details-drawer'),
    drawerAppName: document.getElementById('drawer-app-name'),
    drawerBodyContent: document.getElementById('drawer-body-content'),
    btnDrawerClose: document.getElementById('btn-drawer-close'),
    queueJobsContainer: document.getElementById('queue-jobs-container'),
    queueTerminal: document.getElementById('queue-terminal'),
    btnQueueCancelAll: document.getElementById('btn-queue-cancel-all'),
    btnQueueClearFinished: document.getElementById('btn-queue-clear-finished'),
    btnCheckUpdatesNow: document.getElementById('btn-check-updates-now'),
    updatesListContainer: document.getElementById('updates-list-container'),
    installedListContainer: document.getElementById('installed-list-container'),
    favoritesGridContainer: document.getElementById('favorites-grid-container'),
    settingsDiagnosticsBody: document.getElementById('settings-diagnostics-body'),
    settingConcurrencySelect: document.getElementById('setting-concurrency-select'),
    settingThemeSelect: document.getElementById('setting-theme-select'),
    catalogMetadataText: document.getElementById('catalog-metadata-text'),
    btnSyncCatalogNow: document.getElementById('btn-sync-catalog-now'),
    updateNotificationBanner: document.getElementById('update-notification-banner'),
    updateBannerHeadline: document.getElementById('update-banner-headline'),
    updateBannerVersion: document.getElementById('update-banner-version'),
    updateBannerDesc: document.getElementById('update-banner-desc'),
    updateProgressContainer: document.getElementById('update-progress-container'),
    updateProgressBarFill: document.getElementById('update-progress-bar-fill'),
    updateProgressPercent: document.getElementById('update-progress-percent'),
    btnUpdateAction: document.getElementById('btn-update-action'),
    btnUpdateDismiss: document.getElementById('btn-update-dismiss'),
    btnCheckAppUpdate: document.getElementById('btn-check-app-update'),
    btnAutoUpdateAllApps: document.getElementById('btn-auto-update-all-apps'),
    settingAutoCheckUpdates: document.getElementById('setting-auto-check-updates'),
    settingAutoDownloadUpdates: document.getElementById('setting-auto-download-updates'),
    settingAutoSyncCatalog: document.getElementById('setting-auto-sync-catalog'),
    btnSettingsCheckAppUpdate: document.getElementById('btn-settings-check-app-update'),
    settingsAppVersionBadge: document.getElementById('settings-app-version-badge'),
    settingsUpdateStatusLabel: document.getElementById('settings-update-status-label')
  };

  async function init() {
    renderStaticIcons();

    // 1. Fetch system info
    try {
      if (window.apporbit) {
        state.systemInfo = await window.apporbit.getSystemInfo();
        state.platformFilter = state.systemInfo.platform;
        elements.platformFilter.value = state.systemInfo.platform;
        elements.systemOsIndicator.textContent = `${state.systemInfo.platform.toUpperCase()} (${state.systemInfo.arch}) • ${state.systemInfo.primaryManager || 'No PM'}`;
      } else {
        // Fallback for standalone preview
        state.systemInfo = { platform: 'windows', arch: 'x64', isElevated: false, packageManagers: { winget: { available: true, version: '1.29' } } };
        elements.systemOsIndicator.textContent = 'Windows (x64) • winget';
      }
    } catch (e) {
      console.error('System detection error:', e);
    }

    // 2. Fetch catalog
    try {
      if (window.apporbit) {
        state.catalog = await window.apporbit.getCatalog();
      } else {
        // Mock fallback if needed
        state.catalog = { categories: [], apps: [], totalApps: 0, version: '2.0.0' };
      }
      elements.catalogCountBadge.textContent = state.catalog.apps ? state.catalog.apps.length : 0;
      elements.catalogMetadataText.textContent = `Catalog version ${state.catalog.version} with ${state.catalog.apps.length} verified packages. Last updated: ${new Date(state.catalog.lastUpdated).toLocaleDateString()}`;
    } catch (e) {
      console.error('Catalog load error:', e);
    }

    // 3. Scan installed apps
    refreshInstalledApps();

    // 4. Load Auto-Update Settings
    if (elements.settingAutoCheckUpdates) {
      elements.settingAutoCheckUpdates.checked = localStorage.getItem('apporbit_autocheck_updates') !== 'false';
    }
    if (elements.settingAutoDownloadUpdates) {
      elements.settingAutoDownloadUpdates.checked = localStorage.getItem('apporbit_autodownload_updates') !== 'false';
    }
    if (elements.settingAutoSyncCatalog) {
      elements.settingAutoSyncCatalog.checked = localStorage.getItem('apporbit_autosync_catalog') !== 'false';
    }

    // 5. Trigger startup auto-checks
    if (window.apporbit) {
      if (localStorage.getItem('apporbit_autocheck_updates') !== 'false') {
        setTimeout(() => checkForAppUpdates(false), 2000);
      }
      if (localStorage.getItem('apporbit_autosync_catalog') !== 'false') {
        window.apporbit.updateCatalog().catch(() => {});
      }
      // Scan for app updates seamlessly
      setTimeout(async () => {
        try {
          const res = await window.apporbit.scanUpdates();
          if (res && res.updates && res.updates.length > 0) {
            state.availableUpdates.clear();
            for (const u of res.updates) {
              state.availableUpdates.set(u.packageId.toLowerCase(), u);
            }
            elements.updatesCountBadge.textContent = res.updates.length;
            elements.updatesCountBadge.style.display = 'inline-block';
            if (elements.btnAutoUpdateAllApps) {
              elements.btnAutoUpdateAllApps.style.display = 'inline-block';
              elements.btnAutoUpdateAllApps.textContent = `⚡ Orbit Auto-Update All (${res.updates.length})`;
            }
            renderAppCards();
          }
        } catch (e) {
          console.warn('Auto scan updates error:', e);
        }
      }, 3000);
    }

    // 6. Render UI
    renderCategoryChips();
    renderAppCards();
    renderFavoritesBadge();
    setupEventListeners();
    setupIPCListeners();
    renderSettingsDiagnostics();
  }

  function renderStaticIcons() {
    elements.brandLogoSlot.innerHTML = window.Icons.orbitalLogo;
    elements.topSearchIcon.innerHTML = window.Icons.search;
    elements.btnToggleView.innerHTML = window.Icons.grid;
    elements.btnRefreshStatus.innerHTML = window.Icons.refresh;
    elements.btnExportSelections.innerHTML = window.Icons.download;
    elements.btnImportSelections.innerHTML = window.Icons.external;
    if (elements.btnCheckAppUpdate) elements.btnCheckAppUpdate.innerHTML = window.Icons.refresh;
    elements.rocketIconSlot.innerHTML = window.Icons.rocket;
    elements.btnModalClose.innerHTML = window.Icons.cross;
    elements.btnDrawerClose.innerHTML = window.Icons.cross;

    // Sidebar navigation icons
    document.getElementById('nav-icon-discover').innerHTML = window.Icons.search;
    document.getElementById('nav-icon-updates').innerHTML = window.Icons.refresh;
    document.getElementById('nav-icon-installed').innerHTML = window.Icons.check;
    document.getElementById('nav-icon-queue').innerHTML = window.Icons.terminal;
    document.getElementById('nav-icon-favorites').innerHTML = window.Icons.star;
    document.getElementById('nav-icon-history').innerHTML = window.Icons.external;
    document.getElementById('nav-icon-settings').innerHTML = window.Icons.settings;
  }

  async function refreshInstalledApps() {
    if (!window.apporbit) return;
    try {
      const res = await window.apporbit.scanInstalled();
      if (res && res.installed) {
        state.installedApps = new Set(res.installed.map(id => id.toLowerCase()));
        elements.installedCountBadge.textContent = state.installedApps.size;
        renderAppCards();
      }
    } catch (e) {
      console.warn('Error scanning installed apps:', e);
    }
  }

  function renderCategoryChips() {
    if (!state.catalog || !state.catalog.categories) return;

    let html = `
      <div class="category-chip ${state.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
        <span>🌌 All Apps</span>
        <span class="chip-count">${state.catalog.apps.length}</span>
      </div>
    `;

    for (const cat of state.catalog.categories) {
      const count = state.catalog.apps.filter(a => a.category === cat).length;
      const icon = window.Icons.getCategoryIcon(cat);
      html += `
        <div class="category-chip ${state.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
          <span>${icon} ${cat}</span>
          <span class="chip-count">${count}</span>
        </div>
      `;
    }

    elements.categoryChipsContainer.innerHTML = html;
  }

  function getFilteredApps() {
    if (!state.catalog || !state.catalog.apps) return [];

    return state.catalog.apps.filter(app => {
      // 1. Category filter
      if (state.activeCategory !== 'all' && app.category !== state.activeCategory) {
        return false;
      }

      // 2. Platform filter
      if (state.platformFilter !== 'all') {
        if (!app.supportedOS.includes(state.platformFilter)) {
          return false;
        }
      }

      // 3. Status filter
      const isInst = isAppInstalled(app);
      if (state.installFilter === 'installed' && !isInst) return false;
      if (state.installFilter === 'not-installed' && isInst) return false;
      if (state.installFilter === 'updates') {
        const pkg = app.packages?.[state.systemInfo?.platform || 'windows'];
        if (!pkg || !state.availableUpdates.has(pkg.packageId.toLowerCase())) return false;
      }

      // 4. Search query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchName = app.name.toLowerCase().includes(q);
        const matchDesc = app.description.toLowerCase().includes(q);
        const matchPublisher = app.publisher.toLowerCase().includes(q);
        const matchTags = app.tags && app.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchPublisher && !matchTags) return false;
      }

      return true;
    });
  }

  function isAppInstalled(app) {
    const platform = state.systemInfo ? state.systemInfo.platform : 'windows';
    const pkg = app.packages?.[platform];
    if (!pkg || !pkg.packageId) return false;
    const lowerId = pkg.packageId.toLowerCase();
    return state.installedApps.has(lowerId);
  }

  function renderAppCards() {
    const apps = getFilteredApps();
    const currentPlatform = state.systemInfo ? state.systemInfo.platform : 'windows';

    if (apps.length === 0) {
      elements.appsGridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🛸</div>
          <h3 style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 6px;">No applications found</h3>
          <p style="font-size: 0.85rem;">Try adjusting your search terms or platform filters.</p>
        </div>
      `;
      return;
    }

    let html = '';
    for (const app of apps) {
      const isSelected = state.selectedApps.has(app.id);
      const isInstalled = isAppInstalled(app);
      const isFavorite = state.favorites.has(app.id);
      const isCurrentOsSupported = app.supportedOS.includes(currentPlatform);

      const pkg = app.packages?.[currentPlatform];
      const pkgId = pkg ? pkg.packageId : 'Manual / None';

      html += `
        <div class="app-card ${isSelected ? 'selected' : ''} ${!isCurrentOsSupported ? 'unsupported' : ''}" data-id="${app.id}">
          <div class="app-card-header">
            ${window.Icons.getAppIcon(app)}
            <div class="app-card-title-wrap">
              <div class="app-card-name" title="${app.name}">${app.name}</div>
              <div class="app-card-publisher" title="${app.publisher}">${app.publisher}</div>
            </div>
            <div class="custom-checkbox" data-action="toggle-check" data-id="${app.id}">
              ${window.Icons.check}
            </div>
          </div>

          <div class="app-card-desc" title="${app.description}">${app.description}</div>

          <div class="app-card-footer">
            <div class="badges-group">
              <span class="badge-tag">${app.category}</span>
              ${isInstalled ? `<span class="badge-tag installed">Installed</span>` : ''}
              ${app.requiresAdmin ? `<span class="badge-tag admin-req" title="Requires Administrator privileges">Admin</span>` : ''}
            </div>

            <div class="app-card-actions">
              <div class="os-compatibility-icons">
                <span class="os-icon-badge ${app.supportedOS.includes('windows') ? 'active-os' : ''}" title="Windows">${window.Icons.windows}</span>
                <span class="os-icon-badge ${app.supportedOS.includes('macos') ? 'active-os' : ''}" title="macOS">${window.Icons.apple}</span>
                <span class="os-icon-badge ${app.supportedOS.includes('linux') ? 'active-os' : ''}" title="Linux">${window.Icons.linux}</span>
              </div>
              <button class="card-action-btn" data-action="favorite" data-id="${app.id}" title="Toggle Favorite">
                ${isFavorite ? window.Icons.starFilled : window.Icons.star}
              </button>
              <button class="card-action-btn" data-action="details" data-id="${app.id}" title="View Details">
                ${window.Icons.info}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    elements.appsGridContainer.innerHTML = html;
  }

  function toggleAppSelection(appId) {
    if (state.selectedApps.has(appId)) {
      state.selectedApps.delete(appId);
    } else {
      state.selectedApps.add(appId);
    }

    updateBasketDock();

    // Update specific card DOM without full re-render for maximum speed
    const card = document.querySelector(`.app-card[data-id="${appId}"]`);
    if (card) {
      if (state.selectedApps.has(appId)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    }
  }

  function updateBasketDock() {
    const count = state.selectedApps.size;
    elements.basketCount.textContent = count;

    if (count > 0) {
      elements.basketText.textContent = `${count} application${count > 1 ? 's' : ''} in flight basket`;
      elements.selectionBasket.classList.add('visible');
    } else {
      elements.basketText.textContent = 'No apps selected';
      elements.selectionBasket.classList.remove('visible');
    }
  }

  function selectVisible() {
    const apps = getFilteredApps();
    for (const app of apps) {
      state.selectedApps.add(app.id);
    }
    updateBasketDock();
    renderAppCards();
  }

  function deselectAll() {
    state.selectedApps.clear();
    updateBasketDock();
    renderAppCards();
  }

  function selectCategory() {
    if (state.activeCategory === 'all') return;
    const apps = state.catalog.apps.filter(a => a.category === state.activeCategory);
    for (const app of apps) {
      state.selectedApps.add(app.id);
    }
    updateBasketDock();
    renderAppCards();
  }

  function openInstallModal() {
    if (state.selectedApps.size === 0) return;

    elements.modalAppCount.textContent = state.selectedApps.size;
    const currentPlatform = state.systemInfo ? state.systemInfo.platform : 'windows';

    let html = '<ul style="list-style: none; padding: 0;">';
    for (const id of state.selectedApps) {
      const app = state.catalog.apps.find(a => a.id === id);
      if (!app) continue;

      const pkg = app.packages?.[currentPlatform];
      const pkgId = pkg ? pkg.packageId : 'N/A';
      const manager = pkg ? pkg.manager : 'Unknown';

      html += `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <div>
            <strong>${app.name}</strong>
            <span style="color: var(--text-dim); margin-left: 8px;">(${pkgId})</span>
          </div>
          <span class="badge-tag">${manager}</span>
        </li>
      `;
    }
    html += '</ul>';

    elements.modalAppList.innerHTML = html;
    elements.installModal.classList.add('active');
  }

  function closeInstallModal() {
    elements.installModal.classList.remove('active');
  }

  async function confirmInstall() {
    closeInstallModal();
    if (!window.apporbit || state.selectedApps.size === 0) return;

    const jobRequests = [];
    for (const id of state.selectedApps) {
      jobRequests.push({ appId: id, operation: 'install' });
    }

    // Switch view to Queue
    switchView('queue');

    try {
      await window.apporbit.startBatch(jobRequests, {
        concurrency: state.concurrency
      });
      // Clear basket once enqueued
      state.selectedApps.clear();
      updateBasketDock();
      renderAppCards();
    } catch (e) {
      console.error('Failed to start batch:', e);
      appendTerminalLine(`[Error starting batch]: ${e.message}`, 'error');
    }
  }

  function openAppDetails(appId) {
    const app = state.catalog.apps.find(a => a.id === appId);
    if (!app) return;

    state.activeDrawerApp = app;
    elements.drawerAppName.textContent = app.name;

    const currentPlatform = state.systemInfo ? state.systemInfo.platform : 'windows';
    const pkg = app.packages?.[currentPlatform];

    elements.drawerBodyContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
        ${window.Icons.getAppIcon(app)}
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 700;">${app.name}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${app.publisher}</p>
        </div>
      </div>

      <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-main); margin-bottom: 20px;">
        ${app.description}
      </div>

      <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 0.82rem; line-height: 1.8; margin-bottom: 20px;">
        <div><strong>Category:</strong> ${app.category}</div>
        <div><strong>License:</strong> ${app.license || 'Proprietary'}</div>
        <div><strong>Admin Required:</strong> ${app.requiresAdmin ? 'Yes' : 'No'}</div>
        <div><strong>Supported OS:</strong> ${app.supportedOS.join(', ')}</div>
        <div><strong>Architectures:</strong> ${app.architectures.join(', ')}</div>
        <div><strong>Package ID (${currentPlatform}):</strong> <code>${pkg ? pkg.packageId : 'None'}</code></div>
        <div><strong>Package Manager:</strong> ${pkg ? pkg.manager : 'Manual'}</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${app.website ? `
          <button class="btn-secondary" onclick="window.apporbit.openExternal('${app.website}')" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Visit Official Website</span>
            <span style="width: 14px; height: 14px;">${window.Icons.external}</span>
          </button>
        ` : ''}
        ${app.downloadPage ? `
          <button class="btn-secondary" onclick="window.apporbit.openExternal('${app.downloadPage}')" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Official Download Page</span>
            <span style="width: 14px; height: 14px;">${window.Icons.download}</span>
          </button>
        ` : ''}
      </div>
    `;

    elements.detailsDrawer.classList.add('active');
  }

  function closeAppDetails() {
    elements.detailsDrawer.classList.remove('active');
  }

  function toggleFavorite(appId) {
    if (state.favorites.has(appId)) {
      state.favorites.delete(appId);
    } else {
      state.favorites.add(appId);
    }
    localStorage.setItem('apporbit_favorites', JSON.stringify(Array.from(state.favorites)));
    renderFavoritesBadge();
    renderAppCards();
  }

  function renderFavoritesBadge() {
    elements.favoritesCountBadge.textContent = state.favorites.size;
  }

  function switchView(viewName) {
    state.activeView = viewName;

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `view-${viewName}`);
    });

    if (viewName === 'updates') {
      renderUpdatesView();
    } else if (viewName === 'installed') {
      renderInstalledView();
    } else if (viewName === 'favorites') {
      renderFavoritesView();
    } else if (viewName === 'history') {
      renderHistoryView();
    }
  }

  function renderUpdatesView() {
    const container = elements.updatesListContainer;
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        Click "Check for Updates" to query the native package manager for updates.
      </div>
    `;
  }

  function renderInstalledView() {
    const container = elements.installedListContainer;
    if (!state.catalog || !state.catalog.apps) return;

    const installed = state.catalog.apps.filter(a => isAppInstalled(a));
    if (installed.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          No managed applications detected yet. Refresh or install packages to see them here.
        </div>
      `;
      return;
    }

    let html = '';
    for (const app of installed) {
      html += `
        <div class="app-card">
          <div class="app-card-header">
            ${window.Icons.getAppIcon(app)}
            <div class="app-card-title-wrap">
              <div class="app-card-name">${app.name}</div>
              <div class="app-card-publisher">${app.publisher}</div>
            </div>
          </div>
          <div class="app-card-desc">${app.description}</div>
          <div class="app-card-footer">
            <span class="badge-tag installed">Installed</span>
            <button class="btn-secondary" style="font-size: 0.72rem; padding: 3px 8px;" onclick="window.apporbit.openExternal('${app.website}')">Website</button>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderFavoritesView() {
    const container = elements.favoritesGridContainer;
    if (!state.catalog || !state.catalog.apps) return;

    const favs = state.catalog.apps.filter(a => state.favorites.has(a.id));
    if (favs.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          No favorites added yet. Click the star icon on any application card to add it to your favorites.
        </div>
      `;
      return;
    }

    let html = '';
    for (const app of favs) {
      const isSelected = state.selectedApps.has(app.id);
      html += `
        <div class="app-card ${isSelected ? 'selected' : ''}" data-id="${app.id}">
          <div class="app-card-header">
            ${window.Icons.getAppIcon(app)}
            <div class="app-card-title-wrap">
              <div class="app-card-name">${app.name}</div>
              <div class="app-card-publisher">${app.publisher}</div>
            </div>
            <div class="custom-checkbox" data-action="toggle-check" data-id="${app.id}">
              ${window.Icons.check}
            </div>
          </div>
          <div class="app-card-desc">${app.description}</div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderHistoryView() {
    const container = elements.historyContainer;
    if (state.history.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          No previous installation history recorded.
        </div>
      `;
      return;
    }

    let html = '';
    for (const entry of state.history) {
      html += `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong>Batch Run: ${new Date(entry.timestamp).toLocaleString()}</strong>
            <span class="badge-tag">${entry.succeeded} / ${entry.total} Successful</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Succeeded: ${entry.succeeded} | Failed: ${entry.failed} | Cancelled: ${entry.cancelled}
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderSettingsDiagnostics() {
    if (!state.systemInfo) return;
    const s = state.systemInfo;
    const body = elements.settingsDiagnosticsBody;

    const pmList = Object.entries(s.packageManagers || {})
      .map(([pm, info]) => `${pm}: ${info.available ? `✓ (${info.version})` : '✗ Not Found'}`)
      .join('<br>');

    body.innerHTML = `
      <strong>Platform:</strong> ${s.platform} (${s.rawPlatform})<br>
      <strong>Architecture:</strong> ${s.arch}<br>
      <strong>OS Release:</strong> ${s.osRelease}<br>
      <strong>Elevation (Admin):</strong> ${s.isElevated ? 'Yes (Elevated)' : 'No (Standard User)'}<br>
      <strong>Primary Package Manager:</strong> ${s.primaryManager || 'None'}<br>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
        <strong>Package Manager Checks:</strong><br>
        ${pmList}
      </div>
    `;
  }

  function appendTerminalLine(text, type = 'normal') {
    if (!elements.queueTerminal) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    elements.queueTerminal.appendChild(line);
    elements.queueTerminal.scrollTop = elements.queueTerminal.scrollHeight;
  }

  async function checkForAppUpdates(manual = false) {
    if (!window.apporbit || !window.apporbit.checkForUpdates) return;
    if (manual && elements.settingsUpdateStatusLabel) {
      elements.settingsUpdateStatusLabel.textContent = 'Checking for updates...';
    }
    appendTerminalLine('Checking for AppOrbit application updates...');
    try {
      const res = await window.apporbit.checkForUpdates();
      if (res && res.updateAvailable) {
        showUpdateBanner(res);
        if (elements.settingsUpdateStatusLabel) {
          elements.settingsUpdateStatusLabel.textContent = `Update v${res.latestVersion} available!`;
        }
        appendTerminalLine(`Update available: v${res.latestVersion}`, 'success');
        const autoDownload = localStorage.getItem('apporbit_autodownload_updates') !== 'false';
        if (autoDownload && !state.isDownloadingUpdate && !state.updateDownloaded) {
          triggerUpdateDownload(res);
        }
      } else {
        if (elements.settingsUpdateStatusLabel) {
          elements.settingsUpdateStatusLabel.textContent = manual ? 'AppOrbit is up to date.' : 'Up to date';
        }
        appendTerminalLine('AppOrbit is up to date.');
      }
    } catch (e) {
      if (elements.settingsUpdateStatusLabel) {
        elements.settingsUpdateStatusLabel.textContent = `Check failed: ${e.message}`;
      }
      appendTerminalLine(`Update check failed: ${e.message}`, 'error');
    }
  }

  function showUpdateBanner(info) {
    state.updateInfo = info;
    if (elements.updateBannerHeadline) elements.updateBannerHeadline.textContent = 'AppOrbit Update Available';
    if (elements.updateBannerVersion) elements.updateBannerVersion.textContent = `v${info.latestVersion}`;
    if (elements.updateBannerDesc) elements.updateBannerDesc.textContent = info.releaseNotes || 'New packages, performance enhancements, and bug fixes.';
    if (elements.btnUpdateAction) {
      elements.btnUpdateAction.textContent = 'Update & Restart';
      elements.btnUpdateAction.style.display = 'inline-block';
    }
    if (elements.updateNotificationBanner) {
      elements.updateNotificationBanner.style.display = 'block';
    }
  }

  async function triggerUpdateDownload(info) {
    if (!info || state.isDownloadingUpdate || state.updateDownloaded) return;
    state.isDownloadingUpdate = true;
    if (elements.updateProgressContainer) elements.updateProgressContainer.style.display = 'block';
    if (elements.updateProgressPercent) elements.updateProgressPercent.style.display = 'inline-block';
    if (elements.btnUpdateAction) {
      elements.btnUpdateAction.textContent = 'Downloading...';
      elements.btnUpdateAction.disabled = true;
    }
    appendTerminalLine(`Downloading update v${info.latestVersion}...`);

    try {
      await window.apporbit.downloadUpdate({
        assetUrl: info.assetUrl,
        assetName: info.assetName || 'AppOrbit-Update.exe'
      });
    } catch (e) {
      state.isDownloadingUpdate = false;
      if (elements.btnUpdateAction) {
        elements.btnUpdateAction.disabled = false;
        elements.btnUpdateAction.textContent = 'Retry Update';
      }
      appendTerminalLine(`Download error: ${e.message}`, 'error');
    }
  }

  function setupIPCListeners() {
    if (!window.apporbit) return;

    window.apporbit.onJobStatus(data => {
      appendTerminalLine(`Job ${data.jobId}: status -> ${data.status} ${data.exitCode !== undefined ? `(exit ${data.exitCode})` : ''}`, data.status === 'failed' ? 'error' : data.status === 'succeeded' ? 'success' : 'normal');
      updateQueueJobDisplay(data);
    });

    window.apporbit.onJobProgress(data => {
      updateQueueJobProgress(data.jobId, data.progress);
    });

    window.apporbit.onJobLog(data => {
      appendTerminalLine(`[${data.jobId}] ${data.entry.text}`);
    });

    window.apporbit.onQueueFinished(report => {
      appendTerminalLine(`=== Queue Run Completed! Total: ${report.total}, Succeeded: ${report.succeeded}, Failed: ${report.failed} ===`, report.failed > 0 ? 'error' : 'success');
      state.history.unshift(report);
      localStorage.setItem('apporbit_history', JSON.stringify(state.history.slice(0, 30)));
      refreshInstalledApps();
    });

    // AutoUpdater IPC Listeners
    if (window.apporbit.onUpdateAvailable) {
      window.apporbit.onUpdateAvailable(info => {
        appendTerminalLine(`[AutoUpdater] New version detected: v${info.latestVersion}!`);
        showUpdateBanner(info);
        if (elements.settingsUpdateStatusLabel) {
          elements.settingsUpdateStatusLabel.textContent = `Update v${info.latestVersion} available!`;
        }
        if (localStorage.getItem('apporbit_autodownload_updates') !== 'false' && !state.isDownloadingUpdate && !state.updateDownloaded) {
          triggerUpdateDownload(info);
        }
      });
    }

    if (window.apporbit.onUpdateProgress) {
      window.apporbit.onUpdateProgress(prog => {
        if (elements.updateProgressContainer) elements.updateProgressContainer.style.display = 'block';
        if (elements.updateProgressBarFill) elements.updateProgressBarFill.style.width = `${prog.percent}%`;
        if (elements.updateProgressPercent) {
          elements.updateProgressPercent.style.display = 'inline-block';
          elements.updateProgressPercent.textContent = `${prog.percent}%`;
        }
        if (elements.btnUpdateAction) elements.btnUpdateAction.textContent = `Downloading ${prog.percent}%...`;
      });
    }

    if (window.apporbit.onUpdateDownloaded) {
      window.apporbit.onUpdateDownloaded(res => {
        state.isDownloadingUpdate = false;
        state.updateDownloaded = true;
        appendTerminalLine(`[AutoUpdater] Update downloaded successfully to: ${res.filePath}`, 'success');
        if (elements.updateProgressContainer) elements.updateProgressContainer.style.display = 'none';
        if (elements.updateProgressPercent) elements.updateProgressPercent.style.display = 'none';
        if (elements.btnUpdateAction) {
          elements.btnUpdateAction.disabled = false;
          elements.btnUpdateAction.textContent = 'Restart & Install Orbit';
          elements.btnUpdateAction.style.background = 'linear-gradient(135deg, #10b981, #00f2fe)';
        }
      });
    }

    if (window.apporbit.onUpdateNotAvailable) {
      window.apporbit.onUpdateNotAvailable(() => {
        if (elements.settingsUpdateStatusLabel) {
          elements.settingsUpdateStatusLabel.textContent = 'AppOrbit is up to date';
        }
      });
    }

    if (window.apporbit.onUpdaterError) {
      window.apporbit.onUpdaterError(err => {
        state.isDownloadingUpdate = false;
        if (elements.btnUpdateAction) {
          elements.btnUpdateAction.disabled = false;
          elements.btnUpdateAction.textContent = 'Update & Restart';
        }
        appendTerminalLine(`[AutoUpdater Error]: ${err.error || err.message || err}`, 'error');
      });
    }
  }

  function updateQueueJobDisplay(data) {
    let jobEl = document.getElementById(`queue-card-${data.jobId}`);
    if (!jobEl) {
      jobEl = document.createElement('div');
      jobEl.id = `queue-card-${data.jobId}`;
      jobEl.style.cssText = 'background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px;';
      jobEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong id="queue-title-${data.jobId}">Job ${data.jobId}</strong>
          <span id="queue-status-badge-${data.jobId}" class="badge-tag">${data.status}</span>
        </div>
        <div class="progress-bar-track">
          <div id="queue-progress-bar-${data.jobId}" class="progress-bar-fill" style="width: ${data.progress || 10}%"></div>
        </div>
      `;
      elements.queueJobsContainer.appendChild(jobEl);
    }

    const badge = document.getElementById(`queue-status-badge-${data.jobId}`);
    if (badge) {
      badge.textContent = data.status;
      badge.className = `badge-tag ${data.status === 'succeeded' ? 'installed' : data.status === 'failed' ? 'admin-req' : ''}`;
    }
  }

  function updateQueueJobProgress(jobId, progress) {
    const bar = document.getElementById(`queue-progress-bar-${jobId}`);
    if (bar) {
      bar.style.width = `${progress}%`;
    }
  }

  function setupEventListeners() {
    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });

    // Category chips
    elements.categoryChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      state.activeCategory = chip.getAttribute('data-cat');
      renderCategoryChips();
      renderAppCards();
    });

    // Search input
    elements.mainSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderAppCards();
    });

    // Platform filter
    elements.platformFilter.addEventListener('change', (e) => {
      state.platformFilter = e.target.value;
      renderAppCards();
    });

    // Status filter
    elements.installFilter.addEventListener('change', (e) => {
      state.installFilter = e.target.value;
      renderAppCards();
    });

    // Bulk buttons
    elements.btnSelectVisible.addEventListener('click', selectVisible);
    elements.btnDeselectAll.addEventListener('click', deselectAll);
    elements.btnSelectCategory.addEventListener('click', selectCategory);

    // View toggle
    elements.btnToggleView.addEventListener('click', () => {
      state.isListView = !state.isListView;
      elements.appsGridContainer.classList.toggle('list-view', state.isListView);
      elements.btnToggleView.innerHTML = state.isListView ? window.Icons.list : window.Icons.grid;
    });

    // Refresh status
    elements.btnRefreshStatus.addEventListener('click', () => {
      refreshInstalledApps();
    });

    // Export / Import
    elements.btnExportSelections.addEventListener('click', async () => {
      if (!window.apporbit) return;
      const data = {
        exportedAt: new Date().toISOString(),
        selectedApps: Array.from(state.selectedApps)
      };
      await window.apporbit.exportSelections(data);
    });

    elements.btnImportSelections.addEventListener('click', async () => {
      if (!window.apporbit) return;
      const res = await window.apporbit.importSelections();
      if (res && res.success && res.data && Array.isArray(res.data.selectedApps)) {
        for (const id of res.data.selectedApps) {
          state.selectedApps.add(id);
        }
        updateBasketDock();
        renderAppCards();
      }
    });

    // Basket clear and review
    elements.btnBasketClear.addEventListener('click', deselectAll);
    elements.btnBasketReview.addEventListener('click', openInstallModal);

    // Modal buttons
    elements.btnModalClose.addEventListener('click', closeInstallModal);
    elements.btnModalCancel.addEventListener('click', closeInstallModal);
    elements.btnModalConfirm.addEventListener('click', confirmInstall);

    // Drawer close
    elements.btnDrawerClose.addEventListener('click', closeAppDetails);

    // Grid delegation (Check, Favorite, Details)
    elements.appsGridContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.app-card');
      if (!card) return;
      const appId = card.getAttribute('data-id');

      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        if (action === 'toggle-check') {
          toggleAppSelection(appId);
        } else if (action === 'favorite') {
          toggleFavorite(appId);
        } else if (action === 'details') {
          openAppDetails(appId);
        }
        return;
      }

      // Default click anywhere on card toggles selection
      toggleAppSelection(appId);
    });

    // Queue buttons
    elements.btnQueueCancelAll.addEventListener('click', () => {
      if (window.apporbit) window.apporbit.cancelAllJobs();
    });
    elements.btnQueueClearFinished.addEventListener('click', () => {
      if (window.apporbit) {
        window.apporbit.clearFinishedJobs();
        elements.queueJobsContainer.innerHTML = '';
      }
    });

    // Updates check button
    elements.btnCheckUpdatesNow.addEventListener('click', async () => {
      appendTerminalLine('Scanning for package upgrades via native package manager...');
      if (!window.apporbit) return;
      const res = await window.apporbit.scanUpdates();
      if (res && res.updates) {
        appendTerminalLine(`Update check completed. Found ${res.updates.length} upgradable packages.`);
        state.availableUpdates.clear();
        for (const u of res.updates) {
          state.availableUpdates.set(u.packageId.toLowerCase(), u);
        }
        elements.updatesCountBadge.textContent = res.updates.length;
        elements.updatesCountBadge.style.display = res.updates.length > 0 ? 'inline-block' : 'none';
        if (elements.btnAutoUpdateAllApps) {
          elements.btnAutoUpdateAllApps.style.display = res.updates.length > 0 ? 'inline-block' : 'none';
          elements.btnAutoUpdateAllApps.textContent = `⚡ Orbit Auto-Update All (${res.updates.length})`;
        }
        renderAppCards();
        if (state.activeView === 'updates') renderUpdatesView();
      }
    });

    // Auto-update all outdated software packages in 1 click
    if (elements.btnAutoUpdateAllApps) {
      elements.btnAutoUpdateAllApps.addEventListener('click', async () => {
        if (!window.apporbit || state.availableUpdates.size === 0) return;
        const jobRequests = [];
        for (const [pkgIdLower, updateInfo] of state.availableUpdates.entries()) {
          const app = state.catalog.apps.find(a => {
            const currentPlatform = state.systemInfo ? state.systemInfo.platform : 'windows';
            return a.packages?.[currentPlatform]?.packageId?.toLowerCase() === pkgIdLower;
          });
          if (app) {
            jobRequests.push({ appId: app.id, operation: 'update' });
          }
        }

        if (jobRequests.length > 0) {
          appendTerminalLine(`Starting Orbit Auto-Update for ${jobRequests.length} applications...`);
          switchView('queue');
          await window.apporbit.startBatch(jobRequests, { concurrency: state.concurrency });
        }
      });
    }

    // AutoUpdater banner actions
    if (elements.btnUpdateAction) {
      elements.btnUpdateAction.addEventListener('click', () => {
        if (state.updateDownloaded) {
          if (window.apporbit && window.apporbit.applyUpdate) {
            window.apporbit.applyUpdate();
          }
        } else if (state.updateInfo) {
          triggerUpdateDownload(state.updateInfo);
        }
      });
    }

    if (elements.btnUpdateDismiss) {
      elements.btnUpdateDismiss.addEventListener('click', () => {
        if (elements.updateNotificationBanner) {
          elements.updateNotificationBanner.style.display = 'none';
        }
      });
    }

    if (elements.btnCheckAppUpdate) {
      elements.btnCheckAppUpdate.addEventListener('click', () => checkForAppUpdates(true));
    }

    if (elements.btnSettingsCheckAppUpdate) {
      elements.btnSettingsCheckAppUpdate.addEventListener('click', () => checkForAppUpdates(true));
    }

    // Settings checkboxes persistence
    if (elements.settingAutoCheckUpdates) {
      elements.settingAutoCheckUpdates.addEventListener('change', (e) => {
        localStorage.setItem('apporbit_autocheck_updates', e.target.checked);
      });
    }
    if (elements.settingAutoDownloadUpdates) {
      elements.settingAutoDownloadUpdates.addEventListener('change', (e) => {
        localStorage.setItem('apporbit_autodownload_updates', e.target.checked);
      });
    }
    if (elements.settingAutoSyncCatalog) {
      elements.settingAutoSyncCatalog.addEventListener('change', (e) => {
        localStorage.setItem('apporbit_autosync_catalog', e.target.checked);
      });
    }

    // Concurrency setting
    elements.settingConcurrencySelect.addEventListener('change', (e) => {
      state.concurrency = parseInt(e.target.value, 10) || 1;
    });

    // Theme select
    elements.settingThemeSelect.addEventListener('change', (e) => {
      document.body.setAttribute('data-theme', e.target.value);
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.mainSearchInput.focus();
      }
      if (e.key === 'Escape') {
        closeInstallModal();
        closeAppDetails();
      }
    });
  }

  // Start on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
