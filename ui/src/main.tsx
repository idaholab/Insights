// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

import PageMainLanding from './pages/PageMainLanding';
import PageAllAttacksListing from "./pages/PageAllAttacksListing";
import PageCyoteMethodology from './pages/PageCyoteMethodology';
import PageFinancialSummaries from './pages/PageFinancialSummaries';
import PageCyberAttackThreatParAnalysis from './pages/PageCyberAttackThreatParAnalysis.tsx';
import PageSingleAttackAnalysis from "./pages/PageSingleAttackAnalysis";
import LayoutObservables from './layouts/LayoutObservables.tsx';
import PageObservablesList from './pages/PageObservablesList.tsx';

import ViewSingleAttackOverview from './views/ViewSingleAttackOverview';
import ViewSingleAttackTechnical from './views/ViewSingleAttackTechnical';
import ViewSingleAttackComparison from './views/ViewSingleAttackComparison';
import ViewSingleAttackBAM from './views/ViewSingleAttackBAM.tsx';

import 'material-icons';
import 'material-symbols';
import "@fontsource/source-sans-pro/400.css"; // Specify weight
import "@fontsource/source-sans-pro/400-italic.css"; // Specify weight and style
import "@fontsource/source-sans-pro/600.css"; // Specify weight
import "@fontsource/source-sans-pro/700.css"; // Specify weight
import "@fontsource/source-sans-pro/900.css"; // Specify weight

// Import Store
import { store } from '../app/store/index';
import { UserProvider } from './contexts/userContext.tsx';
import ViewThreatAnalysisOverview from './views/ViewThreatAnalysisOverview.tsx';
import ViewMitreAttackMatrixOverview from './views/ViewMitreAttackMatrix.tsx';
import ViewFinancialSummariesOverview from './views/ViewFinancialSummariesOverview.tsx';
import ViewFinancialLossByAttack from './views/ViewFinancialLossByAttack.tsx';
import ViewFinancialLossByAmountRange from './views/ViewFinancialLossByAmountRange.tsx';

export const UnauthorizedPage: React.FC = () => {
  return <div className="h-screen flex justify-center items-center">
    <div className="text-6xl text-center p-8">
      You are unauthorized to access this page.
    </div>
  </div>
};

// Route guard examples
// This is an example wrapper that can be duplicated and updated for route guard restriction 
// based on the user role when we have specific requirements for what needs  to be restricted
// const RoleRestrictedViewSingleAttackBAM: React.FC = () => {
//   const { user } = useUser();
//   if (!['SuperUser'].includes(user.Role)) {
//     return <Navigate to="/unauthorized" />;
//   }
//   return <ViewSingleAttackBAM />;
// };
// const RoleRestrictedPageCyoteMethodology: React.FC = () => {
//   const { user } = useUser();
//   if (!['SuperUser'].includes(user.Role)) {
//     return <Navigate to="/unauthorized" />;
//   }
//   return <PageCyoteMethodology />;
// };

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <Provider store={store}>
        <HashRouter>
          <App>
            <Routes>
              <Route path="unauthorized" element={<UnauthorizedPage />} />
              <Route path="/reports" element={<PageAllAttacksListing />} />
              <Route path="/cyote-methodology" element={<PageCyoteMethodology />} />
              <Route path="/observables" element={<LayoutObservables />} >
                <Route index element={<Navigate to="maroochy" replace />} />
                <Route path=":caseAlias" element={<PageObservablesList />} />
              </Route>
              <Route path="/" element={<Navigate to='/overview' />} />
              <Route path="/financial-summaries" element={<PageFinancialSummaries />} >
                <Route path="" element={<ViewFinancialSummariesOverview />} />
                <Route path="financial-summaries-overview" element={<ViewFinancialSummariesOverview />} />
                <Route path="financial-loss-by-attack" element={<ViewFinancialLossByAttack />} />
                <Route path="financial-loss-by-amount-range" element={<ViewFinancialLossByAmountRange />} />
              </Route>
              <Route path="/overview" element={<PageMainLanding />} >
                <Route path="" element={<ViewThreatAnalysisOverview />} />
                <Route path="threat-analysis-overview" element={<ViewThreatAnalysisOverview />} />
                <Route path="perceived-techniques" element={<ViewMitreAttackMatrixOverview />} />
                <Route path="financial-summaries-overview" element={<ViewFinancialSummariesOverview />} />
              </Route>
              <Route path="/quantatative-attack-analysis" element={<PageCyberAttackThreatParAnalysis />} />
              <Route path="/attack/:reportName" element={<PageSingleAttackAnalysis />} >
                <Route path="" element={<ViewSingleAttackOverview />} />
                <Route path="overview" element={<ViewSingleAttackOverview />} />
                <Route path="technical" element={<ViewSingleAttackTechnical />} />
                <Route path="comparison" element={<ViewSingleAttackComparison />} />
                <Route path="bam" element={<ViewSingleAttackBAM />} />
              </Route>
            </Routes>
          </App>
        </HashRouter>
      </Provider>
    </UserProvider>
  </React.StrictMode>
)
