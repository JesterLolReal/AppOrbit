const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function postbuild() {
  const userProfile = process.env.USERPROFILE || 'C:\\Users\\Maverick';
  const downloadsDir = path.join(userProfile, 'Downloads');
  const desktopDir = path.join(userProfile, 'Desktop');
  const projectDir = path.resolve(__dirname, '..');
  const distDir = path.join(projectDir, 'dist');

  console.log('--- APPORBIT POST-BUILD VERIFICATION ---');
  console.log('Project directory:', projectDir);
  console.log('Downloads directory:', downloadsDir);
  console.log('Desktop directory:', desktopDir);

  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });
  if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });

  const installerName = 'AppOrbit-Setup-1.0.0.exe';
  const portableName = 'AppOrbit-Portable.exe';

  // 1. Installer
  const builtInstaller = path.join(distDir, installerName);
  if (fs.existsSync(builtInstaller)) {
    const destInstaller = path.join(downloadsDir, installerName);
    fs.copyFileSync(builtInstaller, destInstaller);
    const stat = fs.statSync(destInstaller);
    console.log(`[Installer] Copied to Downloads: ${destInstaller} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
  }

  // 2. Portable EXE
  const builtPortable = path.join(distDir, portableName);
  if (fs.existsSync(builtPortable)) {
    const destDownloadsPortable = path.join(downloadsDir, portableName);
    const destDesktopPortable = path.join(desktopDir, 'AppOrbit.exe');
    fs.copyFileSync(builtPortable, destDownloadsPortable);
    fs.copyFileSync(builtPortable, destDesktopPortable);
    const stat = fs.statSync(destDesktopPortable);
    console.log(`[Portable] Copied to Desktop: ${destDesktopPortable} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`[Portable] Copied to Downloads: ${destDownloadsPortable}`);
  }

  // 3. Desktop Shortcut
  try {
    const psCmd = `
      $WshShell = New-Object -ComObject WScript.Shell;
      $Shortcut = $WshShell.CreateShortcut("${desktopDir}\\AppOrbit Launcher.lnk");
      $Shortcut.TargetPath = "${distDir}\\win-unpacked\\AppOrbit.exe";
      $Shortcut.WorkingDirectory = "${distDir}\\win-unpacked";
      $Shortcut.Description = "AppOrbit 2.0 — Every app. One orbit.";
      $Shortcut.Save();
    `;
    execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'ignore' });
    console.log('[Shortcut] Created Desktop shortcut: AppOrbit Launcher.lnk');
  } catch (e) {
    console.warn('Could not create desktop shortcut:', e.message);
  }

  // 4. Source ZIP Archive in Downloads
  const targetZipPath = path.join(downloadsDir, 'AppOrbit-source-1.0.0.zip');
  try {
    const psZip = `Compress-Archive -Path '${projectDir}\\src', '${projectDir}\\scripts', '${projectDir}\\tests', '${projectDir}\\.github', '${projectDir}\\package.json', '${projectDir}\\README.md', '${projectDir}\\LICENSE', '${projectDir}\\.gitignore' -DestinationPath '${targetZipPath}' -Force`;
    execSync(`powershell -NoProfile -Command "${psZip}"`, { stdio: 'ignore' });
    if (fs.existsSync(targetZipPath)) {
      const zipStat = fs.statSync(targetZipPath);
      console.log(`[Source ZIP] Created at ${targetZipPath} (${(zipStat.size / 1024).toFixed(1)} KB)`);
    }
  } catch (e) {
    console.warn('Could not create source ZIP:', e.message);
  }

  console.log('--- POST-BUILD COMPLETED SUCCESSFULLY ---');
}

postbuild();
