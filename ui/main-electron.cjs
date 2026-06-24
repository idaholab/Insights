const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const http = require('http');

const iconFileName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
const iconPath = path.join(
  __dirname,
  // public/ in dev, dist/ in packaged (Vite copies public/* into dist/ at build time)
  process.defaultApp ? 'public' : 'dist',
  iconFileName
);

const sharedWebPreferences = {
  preload: path.join(__dirname, 'main-electron-preload.cjs'),
  nodeIntegration: false,
  contextIsolation: true,
  webSecurity: true,
};

const childWindowOptions = {
  width: 1200,
  height: 800,
  icon: iconPath,
  webPreferences: sharedWebPreferences,
};

const EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function sameOrigin(url, currentUrl) {
  try {
    const a = new URL(url);
    const b = new URL(currentUrl);
    if (a.protocol !== b.protocol) return false;
    if (a.protocol === 'file:') return a.pathname === b.pathname;
    return a.origin === b.origin;
  } catch {
    return false;
  }
}

function openExternalIfSafe(url) {
  try {
    if (EXTERNAL_PROTOCOLS.has(new URL(url).protocol)) {
      shell.openExternal(url);
    }
  } catch {
    // Malformed URL — drop it.
  }
}

// Apply link-handling rules to a webContents. Recursively applies to any child
// window that webContents creates, so the same rules propagate to grandchildren
// without manual setup at each level.
function applyLinkHandling(webContents) {
  webContents.setWindowOpenHandler(({ url }) => {
    if (sameOrigin(url, webContents.getURL())) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: childWindowOptions,
      };
    }
    openExternalIfSafe(url);
    return { action: 'deny' };
  });

  webContents.on('will-navigate', (event, url) => {
    if (sameOrigin(url, webContents.getURL())) return;
    event.preventDefault();
    openExternalIfSafe(url);
  });

  webContents.on('did-create-window', (childWindow) => {
    applyLinkHandling(childWindow.webContents);
  });
}

const API_PORT = 8181;
const API_HOST = '127.0.0.1';
const API_HEALTH_URL = `http://${API_HOST}:${API_PORT}/health`;
const HEALTH_POLL_INTERVAL_MS = 200;
const HEALTH_POLL_TIMEOUT_MS = 30_000;
const DEV_UI_URL = 'http://localhost:4987';

let mainWindow = null;
let apiProcess = null;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function spawnApi() {
  if (!app.isPackaged) {
    console.log('Dev mode, assuming API is started externally via npm run dev:api');
    return;
  }

  const nodeBinary = path.join(
    process.resourcesPath,
    process.platform === 'win32' ? 'node.exe' : 'node'
  );
  const apiCwd = path.join(process.resourcesPath, 'api');
  const apiScript = path.join(apiCwd, 'app.js');
  const logPath = path.join(app.getPath('userData'), 'access.log');

  console.log('Spawning API:', nodeBinary, apiScript);
  console.log('  cwd:', apiCwd);
  console.log('  LOG_PATH:', logPath);

  apiProcess = spawn(nodeBinary, [apiScript], {
    cwd: apiCwd,
    env: {
      ...process.env,
      ADAPTER_PORT: String(API_PORT),
      LOG_PATH: logPath,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  apiProcess.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  apiProcess.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });
  apiProcess.on('exit', (code, signal) => {
    console.log(`API process exited with code ${code}, signal ${signal}`);
    apiProcess = null;
  });
  apiProcess.on('error', (err) => {
    console.error('Failed to spawn API:', err);
  });
}

function pollApiReady() {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const retry = () => {
      if (Date.now() - startedAt > HEALTH_POLL_TIMEOUT_MS) {
        return reject(new Error('Health endpoint did not respond within timeout'));
      }
      setTimeout(attempt, HEALTH_POLL_INTERVAL_MS);
    };

    const attempt = () => {
      const req = http.get(API_HEALTH_URL, { timeout: 2000 }, (res) => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        retry();
      });
      req.on('error', retry);
      req.on('timeout', () => { req.destroy(); retry(); });
    };

    attempt();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    icon: iconPath,
    webPreferences: sharedWebPreferences,
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    mainWindow.loadURL(DEV_UI_URL);
  }

  applyLinkHandling(mainWindow.webContents);

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });
}

function fatalStartupError(err) {
  dialog.showErrorBox(
    'Insights — startup error',
    `The backend API did not respond on port ${API_PORT} within ` +
      `${HEALTH_POLL_TIMEOUT_MS / 1000} seconds.\n\n` +
      `This usually means port ${API_PORT} is already in use. ` +
      `Close the conflicting process and relaunch Insights.\n\n` +
      `Details: ${err.message}`
  );
}

function buildAppMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  buildAppMenu();
  spawnApi();

  try {
    await pollApiReady();
  } catch (err) {
    fatalStartupError(err);
    app.quit();
    return;
  }

  createWindow();
});

function killApi() {
  if (!apiProcess) return;
  const pid = apiProcess.pid;
  apiProcess = null;
  console.log(`Stopping API process pid=${pid}`);
  if (process.platform === 'win32') {
    try {
      spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)], { stdio: 'ignore' });
    } catch (e) {
      console.error('taskkill failed:', e);
    }
  } else {
    try { process.kill(pid, 'SIGKILL'); } catch (e) { console.error(e); }
  }
}

app.on('before-quit', killApi);
app.on('will-quit', killApi);

// process.on('exit') runs synchronously even when other cleanup paths haven't.
// Last line of defense for any quit path that bypasses the app-level hooks.
process.on('exit', killApi);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in Electron main:', err);
  killApi();
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
