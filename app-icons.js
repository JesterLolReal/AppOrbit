// AppOrbit 2.0 Authentic Application Brand Icons Library
(function() {
  'use strict';

  const BrandIcons = {
    // 1. Browsers
    'google-chrome': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#EA4335"/><circle cx="24" cy="24" r="16" fill="#FBBC05"/><path d="M24 12A12 12 0 1 0 36 24L24 24Z" fill="#34A853"/><circle cx="24" cy="24" r="9" fill="#FFFFFF"/><circle cx="24" cy="24" r="7" fill="#4285F4"/></svg>
    `,
    'mozilla-firefox': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="url(#ffGrad)"/><circle cx="24" cy="24" r="12" fill="#2B388F"/><path d="M38 18C34 10 24 10 18 14C12 18 14 26 18 30C22 34 30 34 34 30C38 26 40 22 38 18Z" fill="#FF7139"/><defs><radialGradient id="ffGrad" cx="30%" cy="30%"><stop stop-color="#FF9400"/><stop offset="100%" stop-color="#E22850"/></radialGradient></defs></svg>
    `,
    'microsoft-edge': `
      <svg viewBox="0 0 48 48" fill="none"><path d="M24 6C14 6 6 14 6 24C6 34 14 42 24 42C32 42 38 36 40 28C38 31 34 33 29 33C21 33 15 27 15 19C15 14 18 10 22 8C19 8 16 9 14 11C20 7 28 6 34 10C30 8 27 6 24 6Z" fill="url(#edgeGrad)"/><defs><linearGradient id="edgeGrad" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#0078D7"/><stop offset="50%" stop-color="#00BCF2"/><stop offset="100%" stop-color="#2DDC96"/></linearGradient></defs></svg>
    `,
    'brave-browser': `
      <svg viewBox="0 0 48 48" fill="none"><path d="M24 6L38 12V24C38 34 24 42 24 42C24 42 10 34 10 24V12L24 6Z" fill="#FB542B"/><path d="M24 13L32 17V24C32 30 24 35 24 35C24 35 16 30 16 24V17L24 13Z" fill="#FFFFFF"/><circle cx="24" cy="24" r="5" fill="#FB542B"/></svg>
    `,
    'opera': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#FF1B2D"/><ellipse cx="24" cy="24" rx="10" ry="15" fill="#070A14"/></svg>
    `,
    'opera-gx': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#141419"/><path d="M14 24C14 17 18 12 24 12C30 12 34 17 34 24C34 31 30 36 24 36C18 36 14 31 14 24Z" stroke="#FA1E4E" stroke-width="4"/><line x1="30" y1="30" x2="38" y2="38" stroke="#FA1E4E" stroke-width="4"/></svg>
    `,
    'tor-browser': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#7D4698"/><circle cx="24" cy="24" r="14" fill="#592C78"/><circle cx="24" cy="24" r="8" fill="#3B1C51"/><circle cx="24" cy="24" r="3" fill="#A46BB9"/></svg>
    `,
    'vivaldi': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#EF3939"/><path d="M14 14L24 34L34 14" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `,

    // 2. Messaging
    'discord': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#5865F2"/><path d="M34 16C31.5 14.8 28.8 14 26 13.6C25.7 14.2 25.3 15 25 15.7C22.2 15.3 19.4 15.3 16.6 15.7C16.3 15 15.9 14.2 15.6 13.6C12.8 14 10.1 14.8 7.6 16C2.6 23.4 1.2 30.6 1.9 37.6C5.3 40.1 8.5 41.7 11.7 42.7C12.5 41.6 13.2 40.4 13.8 39.2C12.6 38.7 11.5 38.1 10.5 37.3C10.8 37.1 11.1 36.9 11.3 36.7C17.7 39.6 24.6 39.6 31 36.7C31.3 36.9 31.6 37.1 31.9 37.3C30.9 38.1 29.7 38.7 28.6 39.2C29.2 40.4 29.9 41.6 30.7 42.7C33.9 41.7 37.2 40.1 40.5 37.6C41.4 29.4 39.1 22.3 34 16ZM14.5 31.5C12.6 31.5 11 29.9 11 28C11 26.1 12.5 24.5 14.5 24.5C16.5 24.5 18 26.1 18 28C18 29.9 16.5 31.5 14.5 31.5ZM27.5 31.5C25.6 31.5 24 29.9 24 28C24 26.1 25.5 24.5 27.5 24.5C29.5 24.5 31 26.1 31 28C31 29.9 29.5 31.5 27.5 31.5Z" fill="#FFFFFF"/></svg>
    `,
    'zoom': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#2D8CFF"/><path d="M12 18C12 15.8 13.8 14 16 14H26C28.2 14 30 15.8 30 18V28C30 30.2 28.2 32 26 32H16C13.8 32 12 30.2 12 28V18Z" fill="#FFFFFF"/><path d="M31 20L38 15V31L31 26V20Z" fill="#FFFFFF"/></svg>
    `,
    'slack': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#4A154B"/><path d="M19 14C17.3 14 16 15.3 16 17C16 18.7 17.3 20 19 20H22V17C22 15.3 20.7 14 19 14Z" fill="#E01E5A"/><path d="M14 22C14 20.3 15.3 19 17 19C18.7 19 20 20.3 20 22V29C20 30.7 18.7 32 17 32C15.3 32 14 30.7 14 29V22Z" fill="#36C5F0"/><path d="M29 34C30.7 34 32 32.7 32 31C32 29.3 30.7 28 29 28H26V31C26 32.7 27.3 34 29 34Z" fill="#2EB67D"/><path d="M34 26C34 27.7 32.7 29 31 29C29.3 29 28 27.7 28 26V19C28 17.3 29.3 16 31 16C32.7 16 34 17.3 34 19V26Z" fill="#ECB22E"/></svg>
    `,
    'telegram': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#24A1DE"/><path d="M12 23L33 15L29 33L23 27L19 30L20 25L12 23Z" fill="#FFFFFF"/></svg>
    `,
    'whatsapp': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#25D366"/><path d="M24 11C16.8 11 11 16.8 11 24C11 26.6 11.8 29.1 13.2 31.2L12 36L17 34.8C19 36 21.4 36.8 24 36.8C31.2 36.8 37 31 37 23.8C37 16.6 31.2 11 24 11ZM29.8 28.3C29.5 29.1 28.3 29.8 27.4 30C26.8 30.1 26 30.2 23.4 29.1C20.1 27.7 17.9 24.3 17.7 24.1C17.6 23.9 16.2 22 16.2 20C16.2 18 17.2 17 17.6 16.6C17.9 16.2 18.5 16.2 18.9 16.2C19.2 16.2 19.5 16.2 19.8 16.2C20.1 16.2 20.4 16.1 20.7 16.8C21 17.5 21.7 19.3 21.8 19.5C21.9 19.7 21.9 20 21.8 20.3C21.6 20.5 21.5 20.7 21.3 20.9C21.1 21.1 20.9 21.4 20.7 21.6C20.5 21.8 20.3 22 20.5 22.4C20.7 22.8 21.4 23.9 22.4 24.8C23.7 26 24.8 26.4 25.2 26.6C25.6 26.8 25.8 26.7 26.1 26.4C26.4 26.1 27.1 25.2 27.4 24.8C27.7 24.4 28 24.5 28.4 24.6C28.8 24.8 30.8 25.8 31.2 26C31.6 26.2 31.9 26.3 32 26.5C32.1 26.7 32.1 27.5 29.8 28.3Z" fill="#FFFFFF"/></svg>
    `,
    'signal': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#3A76F0"/><circle cx="24" cy="24" r="14" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="4 2"/><circle cx="24" cy="24" r="7" fill="#FFFFFF"/></svg>
    `,

    // 3. Media
    'vlc': `
      <svg viewBox="0 0 48 48" fill="none"><polygon points="24,6 12,38 36,38" fill="#FF8800"/><polygon points="24,12 15,36 33,36" fill="#FFFFFF"/><polygon points="24,18 18,34 30,34" fill="#FF8800"/><ellipse cx="24" cy="38" rx="14" ry="4" fill="#E65100"/></svg>
    `,
    'spotify': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#1DB954"/><path d="M15 20C22 18 29 19 34 22" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/><path d="M16 25C21 23 27 24 32 27" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><path d="M18 30C22 29 26 30 30 32" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/></svg>
    `,
    'obs-studio': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#202225"/><path d="M24 12C20 12 16 15 16 19C16 22 18 24 21 25C20 27 18 29 15 30C18 33 22 34 25 33C29 32 31 29 31 25C31 20 28 17 25 17C26 14 29 13 32 14C30 12 27 12 24 12Z" fill="#FFFFFF"/></svg>
    `,

    // 4. Developer Tools
    'vscode': `
      <svg viewBox="0 0 48 48" fill="none"><path d="M34 6L22 17L14 11L8 14V34L14 37L22 31L34 42L40 39V9L34 6ZM34 34L20 24L34 14V34Z" fill="#007ACC"/></svg>
    `,
    'git': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#F05032"/><circle cx="18" cy="24" r="4" fill="#FFFFFF"/><circle cx="30" cy="18" r="4" fill="#FFFFFF"/><circle cx="30" cy="30" r="4" fill="#FFFFFF"/><line x1="18" y1="24" x2="30" y2="18" stroke="#FFFFFF" stroke-width="3"/><line x1="18" y1="24" x2="30" y2="30" stroke="#FFFFFF" stroke-width="3"/></svg>
    `,
    'github-desktop': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#181717"/><path d="M24 12C17.4 12 12 17.4 12 24C12 29.3 15.4 33.8 20.2 35.4C20.8 35.5 21 35.1 21 34.8V32.7C17.7 33.4 17 31.1 17 31.1C16.5 29.7 15.7 29.4 15.7 29.4C14.6 28.7 15.8 28.7 15.8 28.7C17 28.8 17.6 30 17.6 30C18.7 31.8 20.4 31.3 21.1 31C21.2 30.2 21.5 29.7 21.9 29.4C19.2 29.1 16.4 28 16.4 23.4C16.4 22.1 16.9 21 17.7 20.1C17.6 19.8 17.2 18.5 17.8 16.9C17.8 16.9 18.8 16.6 21.1 18.2C22.1 17.9 23.1 17.8 24.1 17.8C25.1 17.8 26.1 17.9 27.1 18.2C29.4 16.6 30.4 16.9 30.4 16.9C31 18.5 30.6 19.8 30.5 20.1C31.3 21 31.8 22.1 31.8 23.4C31.8 28.1 29 29.1 26.3 29.4C26.8 29.8 27.2 30.6 27.2 31.8V34.8C27.2 35.1 27.4 35.5 28 35.4C32.8 33.8 36.2 29.3 36.2 24C36.2 17.4 30.8 12 24 12Z" fill="#FFFFFF"/></svg>
    `,
    'nodejs-lts': `
      <svg viewBox="0 0 48 48" fill="none"><polygon points="24,6 40,15 40,33 24,42 8,33 8,15" fill="#339933"/><text x="24" y="28" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">JS</text></svg>
    `,
    'python3': `
      <svg viewBox="0 0 48 48" fill="none"><path d="M23 8C16 8 16 11 16 11V14H24V15H13C9 15 7 19 7 23C7 27 10 28 13 28H15V26C15 22 18 20 22 20H28C30 20 31 18 31 16V11C31 8 28 8 23 8ZM19 12C20 12 20 12.5 20 13C20 13.5 20 14 19 14C18 14 18 13.5 18 13C18 12.5 18 12 19 12Z" fill="#3776AB"/><path d="M25 40C32 40 32 37 32 37V34H24V33H35C39 33 41 29 41 25C41 21 38 20 35 20H33V22C33 26 30 28 26 28H20C18 28 17 30 17 32V37C17 40 20 40 25 40ZM29 36C28 36 28 35.5 28 35C28 34.5 28 34 29 34C30 34 30 34.5 30 35C30 35.5 30 36 29 36Z" fill="#FFD43B"/></svg>
    `,
    'docker-desktop': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#2496ED"/><rect x="8" y="20" width="4" height="4" fill="#FFFFFF"/><rect x="14" y="20" width="4" height="4" fill="#FFFFFF"/><rect x="20" y="20" width="4" height="4" fill="#FFFFFF"/><rect x="14" y="14" width="4" height="4" fill="#FFFFFF"/><rect x="20" y="14" width="4" height="4" fill="#FFFFFF"/><rect x="26" y="20" width="4" height="4" fill="#FFFFFF"/><path d="M6 26C8 34 16 38 24 38C34 38 40 32 42 26C38 26 36 28 32 28C28 28 26 26 6 26Z" fill="#FFFFFF"/></svg>
    `,
    'postman': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#FF6C37"/><circle cx="24" cy="24" r="10" fill="#FFFFFF"/><polygon points="21,18 29,24 21,30" fill="#FF6C37"/></svg>
    `,

    // 5. System Utilities
    'powertoys': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#0078D7"/><polygon points="24,8 36,20 24,32 12,20" fill="#FFFFFF"/><polygon points="24,16 32,24 24,32 16,24" fill="#00B294"/></svg>
    `,
    'rufus': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#4B6A9B"/><rect x="14" y="12" width="20" height="24" rx="4" fill="#D8D8D8"/><rect x="18" y="8" width="12" height="6" fill="#A0A0A0"/><circle cx="24" cy="28" r="4" fill="#4B6A9B"/></svg>
    `,
    '7zip': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#000000"/><text x="24" y="32" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">7z</text></svg>
    `,
    'steam': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#171A21"/><path d="M34 18C34 22 30 25 26 25L20 30C20 32 18 34 16 34C14 34 12 32 12 30C12 28 14 26 16 26L21 20C21 16 25 13 29 13C33 13 36 16 34 18Z" fill="#FFFFFF"/></svg>
    `,
    'blender': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#E87D0D"/><circle cx="24" cy="28" r="8" fill="#265787"/><circle cx="24" cy="28" r="4" fill="#FFFFFF"/><circle cx="24" cy="14" r="3" fill="#FFFFFF"/></svg>
    `,
    'obsidian': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#7C3AED"/><polygon points="24,8 34,18 28,40 18,36 14,20" fill="#A78BFA"/><polygon points="24,8 28,40 18,36" fill="#EDE9FE"/></svg>
    `,
    'bitwarden': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#175DDC"/><path d="M24 10C32 10 36 14 36 20C36 28 28 36 24 38C20 36 12 28 12 20C12 14 16 10 24 10Z" fill="#FFFFFF"/><path d="M24 14C28 14 31 17 31 21C31 27 26 32 24 33C22 32 17 27 17 21C17 17 20 14 24 14Z" fill="#175DDC"/></svg>
    `,
    'notepadplusplus': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#2E7D32"/><path d="M14 24C14 18 20 12 26 12C32 12 36 16 36 22C36 26 33 28 30 28H18C15 28 14 31 14 34" stroke="#81C784" stroke-width="4" stroke-linecap="round"/><circle cx="28" cy="18" r="2.5" fill="#FFFFFF"/></svg>
    `,
    'gimp': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#5C5543"/><path d="M14 24C14 18 22 14 28 17C34 20 36 26 33 30C30 34 20 35 16 31C14 29 14 26 14 24Z" fill="#D3CDBE"/><circle cx="20" cy="22" r="3" fill="#231F20"/><circle cx="29" cy="24" r="3" fill="#231F20"/><path d="M30 26L38 34" stroke="#F58220" stroke-width="4" stroke-linecap="round"/></svg>
    `,
    'audacity': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#002D62"/><path d="M14 24C14 16 20 12 24 12C28 12 34 16 34 24" stroke="#FFCC00" stroke-width="4" stroke-linecap="round"/><polyline points="12,24 16,18 20,30 24,14 28,34 32,20 36,24" stroke="#007ACC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `,
    'handbrake': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#2B3A42"/><polygon points="20,12 32,24 20,36" fill="#E74C3C"/><circle cx="16" cy="24" r="4" fill="#F1C40F"/></svg>
    `,
    'sublime-text': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#272822"/><path d="M12 18L32 10L36 14L16 22L12 18Z" fill="#FF9800"/><path d="M12 26L32 18L36 22L16 30L12 26Z" fill="#FF9800"/><path d="M12 34L32 26L36 30L16 38L12 34Z" fill="#FF9800"/></svg>
    `,
    'keepassxc': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#1B5E20"/><circle cx="24" cy="20" r="8" stroke="#81C784" stroke-width="4"/><path d="M24 28V36M24 32H28" stroke="#81C784" stroke-width="4" stroke-linecap="round"/></svg>
    `,
    'qbittorrent': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#2F6799"/><text x="24" y="30" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle">qB</text></svg>
    `,
    'filezilla': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#BF0000"/><text x="24" y="32" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">FZ</text></svg>
    `,
    'wireshark': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#1679A7"/><path d="M14 30C16 22 24 16 34 18C28 24 24 30 14 30Z" fill="#FFFFFF"/></svg>
    `,
    'inkscape': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#1E1E1E"/><polygon points="24,10 38,36 10,36" fill="#FFFFFF"/><polygon points="24,10 30,22 24,20 18,22" fill="#000000"/></svg>
    `,
    'krita': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#202A35"/><circle cx="18" cy="20" r="4" fill="#00D2FF"/><circle cx="30" cy="20" r="4" fill="#FF4F81"/><circle cx="24" cy="30" r="4" fill="#FFD166"/></svg>
    `,
    'paintnet': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#0072C6"/><path d="M14 34L26 22L30 26L18 38H14V34Z" fill="#FFFFFF"/><circle cx="32" cy="18" r="6" fill="#FFCC00"/></svg>
    `,
    'libreoffice': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#18A303"/><path d="M16 12H28L34 18V36H16V12Z" fill="#FFFFFF"/><polygon points="28,12 34,18 28,18" fill="#B2DFDB"/></svg>
    `,
    'thunderbird': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#0A84FF"/><path d="M14 20C18 16 30 16 34 20L24 28L14 20Z" fill="#FFFFFF"/><rect x="14" y="20" width="20" height="14" rx="2" stroke="#FFFFFF" stroke-width="2.5" fill="none"/></svg>
    `,
    'teams': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#5059C9"/><text x="24" y="32" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">T</text></svg>
    `,
    'epic-games-launcher': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#121212"/><polygon points="24,8 38,16 34,36 24,42 14,36 10,16" fill="#FFFFFF"/><polygon points="24,12 34,18 31,33 24,38 17,33 14,18" fill="#121212"/><polygon points="24,18 30,24 24,30 18,24" fill="#FFFFFF"/></svg>
    `,
    'gog-galaxy': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#8E24AA"/><circle cx="24" cy="24" r="12" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 4"/><circle cx="24" cy="24" r="4" fill="#FFFFFF"/></svg>
    `,
    'unity-hub': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#000000"/><polygon points="24,10 36,18 36,32 24,40 12,32 12,18" stroke="#FFFFFF" stroke-width="3" fill="none"/><circle cx="24" cy="25" r="4" fill="#FFFFFF"/></svg>
    `,
    'godot-engine': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#478CBF"/><rect x="14" y="16" width="20" height="16" rx="4" fill="#FFFFFF"/><circle cx="20" cy="22" r="3" fill="#478CBF"/><circle cx="28" cy="22" r="3" fill="#478CBF"/></svg>
    `,
    'virtualbox': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#183E6D"/><polygon points="24,10 38,18 38,32 24,40 10,32 10,18" stroke="#2D8CFF" stroke-width="3" fill="none"/><line x1="24" y1="10" x2="24" y2="40" stroke="#2D8CFF" stroke-width="2"/><line x1="10" y1="18" x2="24" y2="25" stroke="#2D8CFF" stroke-width="2"/><line x1="38" y1="18" x2="24" y2="25" stroke="#2D8CFF" stroke-width="2"/></svg>
    `,
    'protonvpn': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#6D4AFF"/><path d="M24 10L36 16V26C36 34 24 40 24 40C24 40 12 34 12 26V16L24 10Z" fill="#FFFFFF"/></svg>
    `,
    'tailscale': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#24292E"/><circle cx="16" cy="18" r="4" fill="#FFFFFF"/><circle cx="24" cy="18" r="4" fill="#FFFFFF"/><circle cx="32" cy="18" r="4" fill="#FFFFFF"/><circle cx="24" cy="26" r="4" fill="#FFFFFF"/><circle cx="24" cy="34" r="4" fill="#FFFFFF"/></svg>
    `,
    'anydesk': `
      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#EF4438"/><polygon points="20,14 30,24 20,34 10,24" fill="#FFFFFF"/><polygon points="28,14 38,24 28,34 18,24" stroke="#FFFFFF" stroke-width="3" fill="none"/></svg>
    `,
    'teamviewer': `
      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#0E80D8"/><rect x="14" y="22" width="20" height="4" fill="#FFFFFF"/><polygon points="14,24 20,18 20,30" fill="#FFFFFF"/><polygon points="34,24 28,18 28,30" fill="#FFFFFF"/></svg>
    `
  };

  // Attach to window.Icons
  window.BrandIcons = BrandIcons;

  // Enhance window.Icons.getAppIcon to return real brand SVG or official high-res publisher logo
  window.Icons.getAppIcon = function(app) {
    if (BrandIcons[app.id]) {
      return `<div class="app-icon-badge brand-svg-wrap">${BrandIcons[app.id]}</div>`;
    }

    // Extract official domain from app website
    let domain = '';
    try {
      if (app.website) {
        const u = new URL(app.website);
        domain = u.hostname.replace(/^www\./, '');
      }
    } catch (e) {}

    // Categorized fallback initials & colors
    const initial = app.name.slice(0, 2).trim();
    const hash = app.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [195, 215, 240, 265, 285, 320, 155, 30, 345];
    const h1 = hues[hash % hues.length];
    const h2 = (h1 + 35) % 360;

    if (domain) {
      const iconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
      return `
        <div class="app-icon-badge brand-img-wrap" title="${app.name}">
          <img class="brand-icon-img" src="${iconUrl}" alt="${app.name}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <div class="app-icon-fallback" style="display:none; width:100%; height:100%; background: linear-gradient(135deg, hsl(${h1}, 82%, 46%), hsl(${h2}, 88%, 36%)); border-radius:6px; align-items:center; justify-content:center; font-weight:800; font-size:1.05rem; color:#fff;">
            <span>${initial}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="app-icon-badge" style="background: linear-gradient(135deg, hsl(${h1}, 82%, 46%), hsl(${h2}, 88%, 36%));">
        <span>${initial}</span>
      </div>
    `;
  };
})();

