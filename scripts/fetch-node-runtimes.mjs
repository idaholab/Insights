#!/usr/bin/env node
// Downloads Node runtimes for each target platform/arch and extracts them into
// vendor/node-{platform-arch}/. electron-builder picks these up at package time.
//
// The pinned NODE_VERSION below must match (ABI-compatible with) the
// better-sqlite3 prebuild that `npm install` downloads in api/. If you bump
// one, bump the other together. Node 24.x = NODE_MODULE_VERSION 137, which
// better-sqlite3 12.x ships prebuilds for.

import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import https from 'node:https';

const NODE_VERSION = '24.16.0';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const vendorRoot = join(repoRoot, 'vendor');

const TARGETS = [
  {
    id: 'win-x64',
    archiveName: `node-v${NODE_VERSION}-win-x64.zip`,
    binaryInArchive: `node-v${NODE_VERSION}-win-x64/node.exe`,
    outputBinary: 'node.exe',
  },
  {
    id: 'mac-x64',
    archiveName: `node-v${NODE_VERSION}-darwin-x64.tar.gz`,
    binaryInArchive: `node-v${NODE_VERSION}-darwin-x64/bin/node`,
    outputBinary: 'node',
  },
  {
    id: 'mac-arm64',
    archiveName: `node-v${NODE_VERSION}-darwin-arm64.tar.gz`,
    binaryInArchive: `node-v${NODE_VERSION}-darwin-arm64/bin/node`,
    outputBinary: 'node',
  },
];

function download(url, dest) {
  return new Promise((res, rej) => {
    const file = createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        rmSync(dest, { force: true });
        return download(response.headers.location, dest).then(res, rej);
      }
      if (response.statusCode !== 200) {
        return rej(new Error(`${url} returned HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(res));
    }).on('error', (err) => {
      rmSync(dest, { force: true });
      rej(err);
    });
  });
}

function extract(archivePath, intoDir, onlyMember) {
  // bsdtar (built into macOS, Linux, and Windows 10+) handles both .tar.gz and .zip.
  // Passing `onlyMember` extracts just one file. The Unix tarballs contain
  // symlinks (npm, npx, corepack pointing to node) that need admin or
  // developer-mode on Windows to materialize, and we only need node anyway.
  const args = ['-xf', archivePath, '-C', intoDir];
  if (onlyMember) args.push(onlyMember);
  const result = spawnSync('tar', args, { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`tar extract failed (status ${result.status})`);
}

async function fetchTarget(target) {
  const outDir = join(vendorRoot, `node-${target.id}`);
  const outBinary = join(outDir, target.outputBinary);

  if (existsSync(outBinary) && statSync(outBinary).size > 0) {
    console.log(`${target.id} already present at ${outBinary}`);
    return;
  }

  await mkdir(outDir, { recursive: true });

  const archiveUrl = `https://nodejs.org/dist/v${NODE_VERSION}/${target.archiveName}`;
  const archivePath = join(outDir, target.archiveName);

  console.log(`Downloading ${target.id} from ${archiveUrl}`);
  await download(archiveUrl, archivePath);

  console.log(`Extracting ${target.id}`);
  extract(archivePath, outDir, target.binaryInArchive);

  const extractedBinary = join(outDir, target.binaryInArchive);
  if (!existsSync(extractedBinary)) {
    throw new Error(`extracted archive did not contain expected file: ${extractedBinary}`);
  }
  renameSync(extractedBinary, outBinary);

  rmSync(archivePath, { force: true });
  const topLevel = join(outDir, target.binaryInArchive.split('/')[0]);
  rmSync(topLevel, { recursive: true, force: true });

  console.log(`${target.id} installed at ${outBinary}`);
}

async function main() {
  if (!existsSync(vendorRoot)) {
    mkdirSync(vendorRoot, { recursive: true });
  }
  for (const target of TARGETS) {
    await fetchTarget(target);
  }
  console.log(`\nDone. Node v${NODE_VERSION} runtimes vendored under ${vendorRoot}`);

}

main().catch((err) => {
  console.error('fetch-node-runtimes failed:', err);
  process.exit(1);
});
