import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: './',
    server: {
      host: true,
      port: 4987,
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.REACT_APP_INSIGHTS_API_URL':            JSON.stringify(env.REACT_APP_INSIGHTS_API_URL),
      'process.env.REACT_APP_ALL_ATTACKS_METRICS_API_URL': JSON.stringify(env.REACT_APP_ALL_ATTACKS_METRICS_API_URL),
      'process.env.REACT_APP_FINANCIAL_LOSS_HISTOGRAM':    JSON.stringify(env.REACT_APP_FINANCIAL_LOSS_HISTOGRAM),
      'process.env.REACT_APP_REPORT_DATA_MAIN_API_URL':    JSON.stringify(env.REACT_APP_REPORT_DATA_MAIN_API_URL),
      'process.env.REACT_APP_REPORT_DATA_TEC_API_URL':     JSON.stringify(env.REACT_APP_REPORT_DATA_TEC_API_URL),
      'process.env.REACT_APP_REPORT_DATA_TEC_TIMING_API_URL': JSON.stringify(env.REACT_APP_REPORT_DATA_TEC_TIMING_API_URL),
      'process.env.REACT_APP_REPORT_BAM':                  JSON.stringify(env.REACT_APP_REPORT_BAM),
      'process.env.REACT_APP_PAR_COUNTS_API_URL':          JSON.stringify(env.REACT_APP_PAR_COUNTS_API_URL),
      'process.env.REACT_APP_TOP_5_IMPACT_COUNTS_API_URL': JSON.stringify(env.REACT_APP_TOP_5_IMPACT_COUNTS_API_URL),
      'process.env.REACT_APP_RANSOMWARE_PARS_API_URL':     JSON.stringify(env.REACT_APP_RANSOMWARE_PARS_API_URL),
      'process.env.REACT_APP_TAC_TECH_OBS_CNT_API_URL':   JSON.stringify(env.REACT_APP_TAC_TECH_OBS_CNT_API_URL),
      'process.env.REACT_APP_PAR_LOSSES_API_URL':          JSON.stringify(env.REACT_APP_PAR_LOSSES_API_URL),
      'process.env.REACT_APP_REPORT_DATA_MITRE_CAT_API_URL': JSON.stringify(env.REACT_APP_REPORT_DATA_MITRE_CAT_API_URL),
      'process.env.REACT_APP_REPORT_DATA_MITRE_MAP_API_URL': JSON.stringify(env.REACT_APP_REPORT_DATA_MITRE_MAP_API_URL),
      'process.env.REACT_APP_REPORT_DATA_MITRE_TEC_API_URL': JSON.stringify(env.REACT_APP_REPORT_DATA_MITRE_TEC_API_URL),
      'process.env.REACT_APP_ALL_ATTACK_BASE_API_URL':     JSON.stringify(env.REACT_APP_ALL_ATTACK_BASE_API_URL),
      'process.env.REACT_APP_ALL_ATTACK_STATS_API_URL':    JSON.stringify(env.REACT_APP_ALL_ATTACK_STATS_API_URL),
      'process.env.REACT_APP_ALL_ATTACK_TECH_API_URL':     JSON.stringify(env.REACT_APP_ALL_ATTACK_TECH_API_URL),
      'process.env.REACT_APP_WORD_CLOUD_DYN_TOPIC_API_URL': JSON.stringify(env.REACT_APP_WORD_CLOUD_DYN_TOPIC_API_URL),
      'process.env.REACT_APP_WORD_CLOUD_INTER_DIST_API_URL': JSON.stringify(env.REACT_APP_WORD_CLOUD_INTER_DIST_API_URL),
      'process.env.REACT_APP_WORD_CLOUD_HIER_CLUST_API_URL': JSON.stringify(env.REACT_APP_WORD_CLOUD_HIER_CLUST_API_URL),
      'process.env.REACT_APP_WORD_CLOUD_SIM_MATRIX_API_URL': JSON.stringify(env.REACT_APP_WORD_CLOUD_SIM_MATRIX_API_URL),
      'process.env.REACT_APP_WORD_CLOUD_WORD_SCORES_API_URL': JSON.stringify(env.REACT_APP_WORD_CLOUD_WORD_SCORES_API_URL),
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    build: {
      outDir: './dist',
      emptyOutDir: true,
    },
  };
});
