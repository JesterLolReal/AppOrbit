const os = require('os');
const { execFile, exec } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

async function checkCommand(cmd, args = ['--version'], timeout = 3000) {
  try {
    const { stdout } = await execFileAsync(cmd, args, { timeout });
    return { available: true, version: stdout.trim().split('\n')[0] };
  } catch (err) {
    return { available: false, version: null };
  }
}

async function isElevatedWindows() {
  try {
    await execAsync('net session', { timeout: 2000 });
    return true;
  } catch (e) {
    return false;
  }
}

async function detectSystemInfo() {
  const platform = os.platform(); // 'win32', 'darwin', 'linux'
  const arch = os.arch(); // 'x64', 'arm64', 'ia32'

  let normalizedPlatform = 'linux';
  if (platform === 'win32') normalizedPlatform = 'windows';
  else if (platform === 'darwin') normalizedPlatform = 'macos';

  let normalizedArch = 'x64';
  if (arch === 'arm64') normalizedArch = 'arm64';
  else if (arch === 'ia32') normalizedArch = 'x86';

  const isElevated = normalizedPlatform === 'windows' ? await isElevatedWindows() : (process.getuid ? process.getuid() === 0 : false);

  const packageManagers = {};

  if (normalizedPlatform === 'windows') {
    const winget = await checkCommand('winget', ['--version']);
    packageManagers.winget = winget;

    const choco = await checkCommand('choco', ['--version']);
    packageManagers.choco = choco;

    const scoop = await checkCommand('scoop', ['--version']);
    packageManagers.scoop = scoop;
  } else if (normalizedPlatform === 'macos') {
    const brew = await checkCommand('brew', ['--version']);
    packageManagers.brew = brew;
  } else if (normalizedPlatform === 'linux') {
    packageManagers.flatpak = await checkCommand('flatpak', ['--version']);
    packageManagers.apt = await checkCommand('apt-get', ['--version']);
    packageManagers.pacman = await checkCommand('pacman', ['--version']);
    packageManagers.dnf = await checkCommand('dnf', ['--version']);
  }

  const primaryManager = 
    normalizedPlatform === 'windows' ? (packageManagers.winget?.available ? 'winget' : null) :
    normalizedPlatform === 'macos' ? (packageManagers.brew?.available ? 'brew' : null) :
    (packageManagers.flatpak?.available ? 'flatpak' : packageManagers.apt?.available ? 'apt' : null);

  return {
    platform: normalizedPlatform,
    rawPlatform: platform,
    arch: normalizedArch,
    rawArch: arch,
    osRelease: os.release(),
    hostname: os.hostname(),
    isElevated,
    packageManagers,
    primaryManager
  };
}

module.exports = {
  detectSystemInfo,
  checkCommand
};
