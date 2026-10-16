// High quality SVG icon generators for AppOrbit 2.0
const Icons = {
  orbitalLogo: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="orbit-logo-svg">
      <defs>
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f2fe" />
          <stop offset="50%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
        <radialGradient id="planetGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#60a5fa" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#1e1b4b" />
        </radialGradient>
      </defs>
      <!-- Outer Orbit Ring -->
      <ellipse cx="24" cy="24" rx="21" ry="8" stroke="url(#orbitGrad)" stroke-width="2.5" stroke-dasharray="4 2" transform="rotate(-30 24 24)" opacity="0.85"/>
      <!-- Inner Orbit Ring -->
      <ellipse cx="24" cy="24" rx="17" ry="6" stroke="#c084fc" stroke-width="1.8" transform="rotate(25 24 24)" opacity="0.65"/>
      <!-- Center Celestial Sphere -->
      <circle cx="24" cy="24" r="9" fill="url(#planetGrad)" filter="drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))"/>
      <!-- Small Orbiting Satellites -->
      <circle cx="9" cy="15" r="2.5" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)"/>
      <circle cx="39" cy="33" r="2" fill="#a855f7" filter="drop-shadow(0 0 4px #a855f7)"/>
      <circle cx="28" cy="8" r="1.5" fill="#38bdf8"/>
    </svg>
  `,

  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  starFilled: `<svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  windows: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.8-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.73-.95 2.76 1.02.08 2.06-.57 2.68-1.32z"/></svg>`,
  linux: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.5 2 7.8 3.8 7.8 6.5c0 1.2.3 2.6.7 3.7C7.6 11.2 7 12.7 7 14.5c0 2.6 1.3 4.8 3.5 5.5l-.5 2h4l-.5-2c2.2-.7 3.5-2.9 3.5-5.5 0-1.8-.6-3.3-1.5-4.3.4-1.1.7-2.5.7-3.7C16.2 3.8 14.5 2 12 2z"/></svg>`,

  // Category Icon Resolver
  getCategoryIcon(cat) {
    switch (cat) {
      case 'Web Browsers': return `🌐`;
      case 'Messaging & Communication': return `💬`;
      case 'Media & Streaming': return `🎬`;
      case 'Image & Design': return `🎨`;
      case 'Documents & PDFs': return `📄`;
      case 'Compression & File Management': return `🗜️`;
      case 'Security & Password Managers': return `🔐`;
      case 'Cloud Storage & Sync': return `☁️`;
      case 'Gaming & Game Dev': return `🎮`;
      case 'Developer Tools': return `💻`;
      case 'Networking & Remote Access': return `📡`;
      case 'System Utilities': return `⚙️`;
      case 'Virtualization & Containers': return `📦`;
      case '3D, CAD & 3D Printing': return `🧊`;
      case 'Education & Accessibility': return `🎓`;
      case 'Runtimes & Dependencies': return `🧩`;
      default: return `📦`;
    }
  },

  // Generate crisp dynamic icon with gradient for each app
  getAppIcon(app) {
    const initial = app.name.charAt(0).toUpperCase();
    const hash = app.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [190, 210, 230, 260, 280, 310, 160, 35];
    const h1 = hues[hash % hues.length];
    const h2 = (h1 + 40) % 360;

    return `
      <div class="app-icon-badge" style="background: linear-gradient(135deg, hsl(${h1}, 80%, 48%), hsl(${h2}, 85%, 38%));">
        <span>${initial}</span>
      </div>
    `;
  }
};

window.Icons = Icons;
