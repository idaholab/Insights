# Insights UI

The Insights UI is a React/Vite frontend for exploring and visualizing cybersecurity Precursor Analysis Report (PAR) data. It connects to the Insights API for its data.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Application Overview](#application-overview)
- [Project Structure](#project-structure)
- [Development](#development)
- [Technologies Used](#technologies-used)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+

## Quick Start

```bash
npm install
npm run dev
```

The UI will be available at `http://localhost:4987`. The API must also be running at `http://localhost:8181` — see [`api/README.md`](../api/README.md).

## Environment Setup

The UI reads environment variables from `.env` at the `ui/` level. The file is pre-configured for local development and requires no changes to get started.

For production deployments, override the API URL in `.env.production`:

```dotenv
REACT_APP_INSIGHTS_API_URL='http://your-deployment-url:8181'
```

## Application Overview

### Section 1: Overview Dashboard

The Overview Dashboard provides high-level statistics across all CyOTE PAR data.

#### 1.1: Threat Analysis Overview
The main landing page. Includes detection capabilities, observable counts, report breakdowns, and attack model summaries.

![Threat Analysis Overview](public/screenshots/Insights-1-1_Main_ThreatAnalysis.png)

#### 1.2: Perceived MITRE Techniques
Displays tactics and techniques present across all PARs, based on the MITRE ATT&CK for ICS framework. Click any technique for a detailed description.
![Perceived MITRE Techniques](public/screenshots/Insights-1-2_Main_MitreMatrix.png)
![Perceived MITRE Techniques](public/screenshots/Insights-1-2_Main_MitreMatrix-Popup.png)

#### 1.3: Financial Summaries Overview
High-level statistics on the estimated financial impacts of OT cyber-attacks, including max/min/average/median loss breakdowns.

![Financial Summaries Overview](public/screenshots/Insights-1-3_Main_FinancialSummaries.png)

---

### Section 2: Attack Library

A searchable, filterable list of all analyzed PAR reports. Sort by year, maximum loss, total duration, or ransomware involvement.

![Attack Library](public/screenshots/Insights-2-1_AttackLibrary.png)

---

### Section 3: Single Attack Analysis

Detailed analysis for a selected attack, broken into four views.

#### 3.1: Overview
High-level breakdown including precursor techniques, observable counts, attack timeline, and financial impact.

![Single Attack Overview](public/screenshots/Insights-3-1-Single_Attack-Triton.png)

#### 3.2: Technical View
MITRE ATT&CK-based view of tactics and techniques used throughout the attack. Click any technique for details on execution, observers, and affected systems.

![Technical View](public/screenshots/Insights-3-2-Single_Attack-Triton.png)

#### 3.3: Comparison View
Compare the selected attack against others across two graphs — financial loss by attack and attack length by attack. Supports logarithmic/linear scale, statistical overlays, and box/scatter plot toggle.

![Comparison View](public/screenshots/Insights-3-3-Single_Attack-Triton.png)

#### 3.4: Bayesian Attack Model
Visualizes attack techniques organized by stage (Early, Middle, Late, Impact). Interactive graph lets users toggle techniques on/off to understand attack progression.

![Bayesian Attack Model](public/screenshots/Insights-3-4-Single_Attack-Triton.png)

---

### Section 4: Observables Database

A searchable, filterable database of all observables across case studies. Features a sidebar for navigating between case studies and filters for perceivability, technique, tactic, observable type, observable level, and attack phase. Each observable links back to its parent attack report.

![CyOTE Observables](public/screenshots/Insights-4-1-Observables.png)

---

### Section 5: Cybersecurity Threat Analysis — PAR Analysis

Five graphs for cross-attack analysis:

- **5.1** Top 5 Impact Techniques by count
- **5.2** Top Tactic & Technique pairs by precursor count
- **5.3** Tactic/Technique occurrence frequency
- **5.4** Ransomware by year of attack
- **5.5** Length of attack by attack (precursor days vs. recovery days)

![PAR Analysis](public/screenshots/Insights-5-1_Main_PARAnalysis.png)

---

### Section 6: Financial Summaries

#### 6.1: Financial Summaries Overview
Same financial statistics as Section 1.3, accessible directly from the nav.

![Financial Summaries Overview](public/screenshots/Insights-6-1-FinancialSummaries.png)

#### 6.2: Financial Loss by Attack
Interactive graph of financial loss across all PARs. Supports logarithmic/linear scale, percentile overlays, and box/scatter plot views.

![Financial Loss by Attack](public/screenshots/Insights-6-2-FinancialSummaries.png)

#### 6.3: Financial Loss by Amount Range
Histogram and KDE visualization of financial loss distribution across incidents from 2000–2022, based on a $5,600/minute disruption cost model.

![Financial Loss by Amount Range](public/screenshots/Insights-6-3-FinancialSummaries.png)

---

### Section 7: CyOTE Methodology

Details the CyOTE methodology used to produce the PAR data.

![CyOTE Methodology](public/screenshots/Insights-7-1-Methodology.png)

---

## Project Structure

```
ui/
├── app/
│   ├── hooks/        # Custom React hooks for data fetching
│   ├── services/     # RTK Query API service definitions
│   └── store/        # Redux store configuration
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts (theme, user)
│   ├── layouts/      # Page layout components
│   ├── pages/        # Top-level page components
│   ├── types/        # TypeScript type definitions
│   ├── util/         # Utility functions
│   └── views/        # Sub-page view components
└── public/           # Static files and screenshots
```

## Development

```bash
npm run dev       # Start dev server at http://localhost:4987
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Technologies Used

- **React** — UI library
- **Vite** — Build tool and dev server
- **React Router** — Client-side routing
- **Redux Toolkit + RTK Query** — State management and API data fetching
- **Tailwind CSS + DaisyUI** — Styling and component library
- **Plotly.js** — Interactive charting
- **AG Grid** — Data grid for tabular views
- **Luxon** — Date/time utilities
- **D3** — Data visualization utilities
