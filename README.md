# AppOrbit 2.0 — Every app. One orbit.

> A massive, cross-platform software installer, updater, and manager. The modern, open, and beautiful alternative to Ninite.

---

## 🌟 Overview

**AppOrbit** is a desktop application engineered for Windows, macOS, and Linux that lets you select dozens of applications and install, update, or manage them seamlessly through one unified, orbital interface.

### Brand Identity
- **Name**: AppOrbit
- **Tagline**: Every app. One orbit.
- **Theme**: Dark Space Navy (`#070a14`, `#0b1124`) with glowing Cyan (`#00f2fe`) and Violet (`#818cf8`) orbital accents.
- **Logo**: Dual intersecting planetary orbit rings with central glowing celestial sphere and orbiting satellites.

---

## 📦 Verified Application Catalog (230+ Apps)

Every single catalog entry is verified against trusted package managers (`winget` on Windows, `brew` on macOS, `flatpak` / `apt` on Linux) and official publisher documentation.

### Catalog Categories
1. **Web Browsers**: Google Chrome, Mozilla Firefox, Microsoft Edge, Brave, Opera, Opera GX, Vivaldi, Chromium, Tor Browser, LibreWolf.
2. **Messaging & Communication**: Discord, Zoom Workplace, Microsoft Teams, Slack, Telegram, WhatsApp, Signal, Element, Thunderbird, Pidgin, Mumble, TeamSpeak, Webex, Session.
3. **Media & Streaming**: VLC Media Player, Spotify, OBS Studio, Audacity, HandBrake, foobar2000, AIMP, MusicBee, mpv, Kodi, Clementine, Strawberry, Jellyfin Media Player, Plex, iTunes, Shotcut, Kdenlive, OpenShot.
4. **Image & Design**: GIMP, Krita, Inkscape, Blender, Paint.NET, ShareX, Greenshot, Flameshot, darktable, RawTherapee, ImageMagick, XnView MP, IrfanView, FastStone Image Viewer, DaVinci Resolve, Figma, Penpot.
5. **Documents & PDFs**: LibreOffice, ONLYOFFICE, Apache OpenOffice, SumatraPDF, Okular, PDF24 Creator, Foxit Reader, Ghostscript, Pandoc, Calibre, Zotero, Obsidian, Joplin, Logseq, Notion.
6. **Compression & File Management**: 7-Zip, PeaZip, NanaZip, WinRAR, FreeFileSync, Double Commander, Files App, Everything, WizTree, WinDirStat, TeraCopy, Syncthing, Q-Dir.
7. **Security & Password Managers**: Bitwarden, KeePassXC, KeePass 2, 1Password, VeraCrypt, Malwarebytes, Cryptomator, Gpg4win, Proton Pass, Authy.
8. **Cloud Storage & Sync**: Dropbox, Google Drive for Desktop, Microsoft OneDrive, Nextcloud Desktop, Proton Drive, rclone, MEGAsync, pCloud.
9. **Gaming & Game Dev**: Steam, Epic Games Launcher, GOG GALAXY, Heroic Games Launcher, Lutris, Prism Launcher, Minecraft Launcher, itch.io, EA app, Battle.net, Ubisoft Connect, Godot Engine, Unity Hub, Playnite, Moonlight, RetroArch.
10. **Developer Tools**:
    - **IDEs & Editors**: VS Code, VSCodium, Visual Studio Community 2022, JetBrains Toolbox, Sublime Text 4, Notepad++, Neovim, Vim, Zed, Cursor, Android Studio.
    - **Terminals & Shells**: Windows Terminal, Alacritty, WezTerm, PowerShell 7.
    - **Languages & Runtimes**: Node.js LTS, Python 3.12, uv, pipx, Temurin JDK 21, .NET SDK 8, Go, Rust via rustup, PHP, Ruby, Bun, Deno.
    - **DevOps & Containers**: Docker Desktop, Podman, Kubernetes kubectl, Helm, Terraform.
    - **Databases & APIs**: Postman, Insomnia, Bruno, DBeaver, SQLite Browser, MySQL Workbench, pgAdmin 4.
    - **VCS & Git**: Git for Windows, GitHub Desktop, GitHub CLI, GitKraken.
11. **Networking & Remote Access**: Wireshark, PuTTY, FileZilla, WinSCP, RustDesk, AnyDesk, TeamViewer, Tailscale, WireGuard, OpenVPN Connect, Cloudflare WARP, mRemoteNG, iperf3, Nmap, TightVNC, RealVNC Viewer.
12. **System Utilities**: Microsoft PowerToys, AutoHotkey v2, HWiNFO, CPU-Z, GPU-Z, CrystalDiskInfo, CrystalDiskMark, Fan Control, Rufus, balenaEtcher, Raspberry Pi Imager, Ventoy, LocalSend, KDE Connect, Barrier, Input Leap, BleachBit, Geekbench.
13. **Virtualization & Containers**: VirtualBox, VMware Workstation Pro, QEMU, UTM, Podman Desktop, Multipass, Vagrant.
14. **3D, CAD & 3D Printing**: FreeCAD, OpenSCAD, PrusaSlicer, OrcaSlicer, UltiMaker Cura, Bambu Studio, KiCad EDA, MeshLab, SolveSpace, Wings 3D.
15. **Education & Accessibility**: Anki, NVDA Screen Reader, Orca, GoldenDict, Tesseract OCR, GeoGebra, Stellarium, Scilab, GnuCash, Scribus.
16. **Runtimes & Dependencies**: Visual C++ 2015-2022 Redistributable (x64 and ARM64), .NET Desktop Runtime 8, Edge WebView2 Runtime, DirectX End-User Runtimes, .NET Console Runtime 8, Temurin JDK 17, Temurin JRE 8.

---

## 🔒 Security Architecture

1. **No Raw Shell Interpolation**: All process execution uses fixed executable paths with structured argument arrays via Node's `child_process.spawn`.
2. **Context Isolation**: Electron renderer has `contextIsolation: true` and `nodeIntegration: false`. Communication occurs strictly across a typed preload bridge.
3. **Content Security Policy**: Strict CSP configured in `index.html`.
4. **Elevated Privileges Notice**: Security applications and installers requiring administrative rights are clearly labeled in advance.

---

## 🚀 Building & Packaging

### Run Tests
```powershell
npm test
```

### Build Windows Installer
```powershell
npm run build
npm run postbuild
```

The resulting NSIS installer will be located at:
`%USERPROFILE%\Downloads\AppOrbit-Setup-1.0.0.exe`
