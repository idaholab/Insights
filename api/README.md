# Insights API

The Insights API is a Node.js/Express/TypeScript backend that serves cybersecurity data to the Insights UI. It supports two data sources and is designed to be extended with additional ones.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Data Sources](#data-sources)
- [API Routes](#api-routes)
- [Development](#development)
- [Adding a Data Source](#adding-a-data-source)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://docs.docker.com/) (optional, for containerized deployment)

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:8181`.

## Environment Setup

Copy the example env file and update the values as needed:

```bash
cp .env.example .env
```

Set `DATA_SOURCE` based on how you want to run the API:

| Value | Description |
|-------|-------------|
| `local` | Serves pre-exported JSON files from `/store`. No database required. Best for getting started quickly. |
| `sqlite` | Queries `insights.db` via Drizzle ORM. Full relational dataset with 30+ tables. |

When using `sqlite`, set `DB_PATH` to the location of your `insights.db` file:

```dotenv
DATA_SOURCE=sqlite
DB_PATH=db/insights/insights.db
```

## Data Sources

### Local JSON (`DATA_SOURCE=local`)
Serves static JSON files from the `/store` directory. No database or additional setup required. The JSON files are pre-exported snapshots of the full dataset and are suitable for read-only exploration.

### SQLite (`DATA_SOURCE=sqlite`)
Queries `insights.db` directly via [Drizzle ORM](https://orm.drizzle.team/). The database contains the full relational dataset including observables, case studies, MITRE ATT&CK tactics and techniques, sectors, NAICS codes, campaigns, and more.

## API Routes

| Route | Description |
|-------|-------------|
| `GET /health` | Health check — returns server status and active data source |
| `GET /AllAttacksMetrics/AllAttacksMetrics` | All attacks metrics |
| `GET /AllAttacksMetrics/FinancialLossHistogram` | Financial loss histogram |
| `GET /AllAttacksReports/AllAttacksReportMain` | Case study descriptions |
| `GET /AllAttacksReports/AllAttacksReportTechniques` | Case study techniques |
| `GET /AllAttacksReports/AllAttacksReportTechniquesTiming` | Case study technique timing |
| `GET /AllAttacksReports/AllAttacksReportBam` | BAM report data |
| `GET /AllAttacksStats/AllAttacksStats` | All attacks statistics |
| `GET /AllAttacksStats/AllAttacksBAM` | BAM attack data |
| `GET /AllAttacksStats/PARLosses` | PAR loss data |
| `GET /AllAttacksStats/RansomwarePARS` | Ransomware PAR data |
| `GET /AllAttacksStats/Top5ImpactCounts` | Top 5 impact counts |
| `GET /MitreAttackMatrix/AttackMatrixCategories` | MITRE ATT&CK tactic categories |
| `GET /MitreAttackMatrix/AttackMatrixMapping` | MITRE tactic/technique mappings |
| `GET /MitreAttackMatrix/AttackMatrixTechniques` | MITRE techniques |
| `GET /TacticTechniquesStats/TacticTechniqueObservableCounts` | Observable counts by tactic/technique |
| `GET /TacticTechniquesStats/TacticTechniquePARCounts` | PAR counts by tactic/technique |
| `GET /TacticTechniquesStats/ParLosses` | PAR losses |
| `GET /TacticTechniquesStats/RansomwarePars` | Ransomware PARs |
| `GET /TacticTechniquesStats/Top5ImpactCounts` | Top 5 impact counts |
| `GET /WordCloud/DynamicTopicModel` | Word cloud dynamic topic model |
| `GET /WordCloud/IntertopicDistanceMap` | Word cloud intertopic distance |
| `GET /WordCloud/HierarchicalClustering` | Word cloud hierarchical clustering |
| `GET /WordCloud/TopicSimilarityMatrix` | Word cloud topic similarity |
| `GET /WordCloud/TopicWordScores` | Word cloud topic word scores |
| `GET /Observables/AllObservables` | All observables |

## Development

```bash
npm install
npm run dev
```

The API uses [nodemon](https://nodemon.io/) for hot reloading during development.

To build for production:

```bash
npm run build
```

This compiles the TypeScript source, bundles with esbuild, and copies the SQLite binary and database file to `build/`.

## Adding a Data Source

1. Add your new value to the `DataSource` type in `src/interfaces/IProcessEnv.ts`
2. Add any required connection config variables to `IProcessEnv` and `.env.example`
3. Add a `getDataSource()` branch in `src/helpers/endpoint.ts` and a new endpoint handler alongside `simpleEndpoint` and `drizzleEndpoint`
4. Update any routes in `src/routes/` that should use the new source
