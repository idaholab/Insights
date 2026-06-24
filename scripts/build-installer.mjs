#!/usr/bin/env node
// Installer build script
//
// Walks the whole pipeline from a fresh clone (or incremental rebuild):
//   1. Locate Node 24 (current process if it's already on 24.x, otherwise fnm)
//   2. Install api/ and ui/ deps if missing
//   3. Download vendored Node runtimes for each target platform
//   4. Build api bundle + UI + electron-builder then create installer
//
// Usage:  node scripts/build-installer.mjs            (current platform)
//         node scripts/build-installer.mjs win        (Windows NSIS only)
//         node scripts/build-installer.mjs mac        (macOS DMG only)
// Or:     npm run installer [-- win|mac]

import { spawnSync, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';

const NODE_VERSION = '24.16.0';
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const isWin = platform() === 'win32';
const isMac = platform() === 'darwin';
const PATH_SEP = isWin ? ';' : ':';

const target = (process.argv[2] || 'current').toLowerCase();
if (!['current', 'win', 'mac'].includes(target)) {
  console.error(`Unknown target "${target}". Use: win | mac | (omit for current platform)`);
  process.exit(2);
}
if (target === 'mac' && !isMac) {
  console.error('Building macOS installers requires running on macOS (codesign tooling).');
  console.error('On Windows, build win or omit target. Use a Mac or CI runner for mac.');
  process.exit(2);
}

// Step 1: Find Node 24 for the subprocesses we'll spawn

function fnmManagedNodeDir() {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  if (isWin) {
    return join(process.env.APPDATA || home, 'fnm', 'node-versions', `v${NODE_VERSION}`, 'installation');
  }
  // Mac/Linux: fnm puts node under installation/bin/
  return join(home, '.local', 'share', 'fnm', 'node-versions', `v${NODE_VERSION}`, 'installation', 'bin');
}

function locateNode24() {
  const [major] = process.versions.node.split('.').map(Number);
  // Any 24.x shares the same ABI (NODE_MODULE_VERSION 137) as the vendored
  // runtime and the better-sqlite3 prebuild, so the current process is fine.
  if (major === 24) {
    return { dir: dirname(process.execPath), source: 'this process' };
  }
  // If fnm is installed but the version isn't, install it (idempotent).
  try {
    execSync(`fnm install ${NODE_VERSION}`, { stdio: 'pipe' });
  } catch {
    // fnm not in PATH — fine if the version was already installed via another path
  }
  const fnmDir = fnmManagedNodeDir();
  if (existsSync(join(fnmDir, isWin ? 'node.exe' : 'node'))) {
    return { dir: fnmDir, source: 'fnm' };
  }
  return null;
}

const node24 = locateNode24();
if (!node24) {
  console.error(`Node ${NODE_VERSION} not available.`);
  console.error('Install via fnm:');
  console.error('    winget install Schniz.fnm        (Windows)');
  console.error('    brew install fnm                 (macOS)');
  console.error(`    fnm install ${NODE_VERSION}`);
  console.error('Or install Node 24 LTS system-wide.');
  process.exit(1);
}
process.env.PATH = node24.dir + PATH_SEP + (process.env.PATH || '');
console.log(`Node ${NODE_VERSION} ready (via ${node24.source})`);

// Step 2: electron-builder's winCodeSign cache contains Mac dylib symlinks that
// only extract on Windows with Developer Mode enabled.

if (isWin) {
  try {
    const cmd = 'powershell -NoProfile -Command "(Get-ItemProperty -Path \'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock\' -Name AllowDevelopmentWithoutDevLicense -ErrorAction SilentlyContinue).AllowDevelopmentWithoutDevLicense"';
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (out !== '1') {
      console.error('Windows Developer Mode is not enabled.');
      console.error('electron-builder ships Mac dylib symlinks in its winCodeSign cache that');
      console.error('require symlink-creation privileges. Enable it and re-run:');
      console.error('    Settings, Privacy & security, For developers, Developer Mode');
      process.exit(1);
    }
    console.log('Windows Developer Mode enabled');
  } catch {
    console.warn('Could not verify Developer Mode status, continuing anyway');
  }
}

// Step runner

function run(cmd, args, cwd = repoRoot) {
  console.log(`\nRunning: ${cmd} ${args.join(' ')}  (in ${cwd})`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: isWin, cwd, env: process.env });
  if (r.status !== 0) {
    console.error(`Step failed with exit code ${r.status}`);
    process.exit(r.status ?? 1);
  }
}

// Step 3: Install deps if node_modules is missing

const apiDeps = join(repoRoot, 'api', 'node_modules');
const uiDeps = join(repoRoot, 'ui', 'node_modules');

if (!existsSync(apiDeps)) {
  run('npm', ['install'], join(repoRoot, 'api'));
} else {
  console.log('api/node_modules already present, skipping install (delete it for a clean rebuild)');
}
if (!existsSync(uiDeps)) {
  run('npm', ['install'], join(repoRoot, 'ui'));
} else {
  console.log('ui/node_modules already present, skipping install (delete it for a clean rebuild)');
}

// Step 4: Vendor the Node runtimes electron-builder will ship

run('npm', ['run', 'fetch:node-runtimes']);

// Step 5: Build the installer

const npmScript = { current: 'package', win: 'package:win', mac: 'package:mac' }[target];
run('npm', ['run', npmScript]);

console.log(`\nBuild complete. Artifacts in ${join(repoRoot, 'dist-electron')}`);
