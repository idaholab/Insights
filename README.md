# CyOTE Insights

CyOTE Insights is a web-based dashboard that aggregates and visualizes historical operational technology (OT) cyber attack data through rich, interactive tools. It enables analysts to explore trends, compare incidents, assess financial impacts, and make more informed decisions about ICS/OT cyber threats.

![Threat Analysis Overview](ui/public/screenshots/Insights-1-1_Main_ThreatAnalysis.png)

## Table of Contents

- [Quick Start](#quick-start)
  - [Download & Install](#download--install)
  - [Docker](#docker)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Building for Production](#building-for-production)
  - [Desktop Installer](#desktop-installer)

## Quick Start

### Download & Install

The easiest way to run CyOTE Insights is to download the prebuilt installer for your operating system. No additional software is required — the installer bundles everything you need.

1. Go to the [Releases page](https://github.com/idaholab/Insights/releases).
2. Under the latest release, download the installer for your platform:
   - **Windows:** `CyOTE Insights-Setup-<version>.exe`
   - **macOS:** `CyOTE Insights-Setup-<version>.dmg` (Apple Silicon)
3. Run the installer:
   - **Windows:** double-click the `.exe` and follow the prompts. If Windows SmartScreen warns about an unrecognized app, click **More info → Run anyway**.
   - **macOS:** open the `.dmg` and drag **CyOTE Insights** into your **Applications** folder. The first time you launch it, right-click the app and choose **Open** to bypass Gatekeeper.
4. Launch **CyOTE Insights** from your Start Menu (Windows) or Applications folder (macOS).

The app runs locally on your machine — no internet connection or external services are required after installation.

### Docker

Prefer to run from source with Docker? **Prerequisites:** [Docker](https://docs.docker.com/)

```bash
cp api/.env.example api/.env
docker compose up --build
```

The application will be available at `http://localhost:8080`.

The API will be available at `http://localhost:8181`.

## Development

Each sub-project is managed independently. Run the following from the project root:

```bash
# Install dependencies
cd api && npm install
cd ui && npm install

# Start the API (runs on port 8181)
cd api && npm run dev

# Start the UI (runs on port 4987)
cd ui && npm run dev
```

### Project Structure

```
Insights/
├── api/          # Node.js/Express/TypeScript backend
├── ui/           # React/Vite frontend
└── docker-compose.yml
```

See [`api/README.md`](api/README.md) and [`ui/README.md`](ui/README.md) for sub-project details.

### Building for Production

```bash
# Build both projects
cd api && npm run build
cd ui && npm run build
```

Or use Docker:

```bash
docker compose up --build
```

### Desktop Installer

The app can also be packaged as a standalone desktop installer (Electron). This
bundles the UI, the API, a SQLite database, and a vendored Node runtime into a
single Windows NSIS installer or macOS DMG, with no external dependencies.

**Prerequisites:** Node 24.16.0 (see `.nvmrc`). The build will use the current
process if it's already on Node 24.x, otherwise it looks for the version under
[fnm](https://github.com/Schniz/fnm) and installs it if needed.

- **Windows:** enable Developer Mode (Settings → Privacy & security → For
  developers → Developer Mode). electron-builder ships symlinks in its
  winCodeSign cache that require it.
- **macOS:** must be built on a Mac (arm64 only). The DMG target needs the
  native codesign tooling.

Run from the project root:

```bash
npm run installer       # current platform
npm run installer:win   # Windows NSIS
npm run installer:mac   # macOS DMG (run on a Mac)
```

This installs dependencies if needed, downloads the vendored Node runtimes,
builds the API bundle and UI, then runs electron-builder. Artifacts land in
`dist-electron/`.