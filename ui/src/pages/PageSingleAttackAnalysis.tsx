// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Hooks
import { useAppDispatch } from '../../app/hooks/reduxTypescriptHooks';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';

// Import Redux Actions
import { appStateActions } from '../../app/store/index';

// Custom Components
import { useMitreMatrixData } from '../../app/hooks/useMitreMatrixData';
import { AttackInfoContextType, VM_AllAttackData } from '../types';
import LayoutSingleAttackAnalysis from '../layouts/LayoutSingleAttackAnalysis';

export const AttackInfoContext = React.createContext<AttackInfoContextType>({ isLoading: false });

type Props = object;

const formatForURL = (str?: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/ /g, '-'); // Replace spaces with hyphens
};

const PageSingleAttackAnalysis: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { reportName } = useParams();
  const { allAttacksData, isLoadingAllAttacksData, errorAllAttacksData } = useAllAttacksData();
  const { mitreAttackMatrixData, isLoading: mitreMatrixIsLoading, error: mitreMatrixError } = useMitreMatrixData();

  const [selectedReport, setSelectedReport] = useState<VM_AllAttackData | undefined>(undefined);

  useEffect(() => {
    // Check if allAttacksData is not null before calling `find`
    if (allAttacksData) {
      const foundReport = allAttacksData.find(report => formatForURL(report?.caseStudyNameShort) === reportName);

      // Update local state
      setSelectedReport(foundReport);
      // Dispatch the selectedReport to Redux store
      if (foundReport) {
        dispatch(appStateActions.setSelectedReport(foundReport));
      }
    }
  }, [allAttacksData, reportName, dispatch]);


  useEffect(() => {
    const segments = location.pathname.split('/');
    const lastSegment = segments[segments.length - 1];

    // Redirect if last segment is empty (ends with a slash) or matches the report name
    if (lastSegment === '' || lastSegment === reportName) {
      navigate(`./overview`);
    }
  }, [navigate, location, reportName]);

  return (
    <div className="page-component">
      <AttackInfoContext.Provider
        value={{
          allAttacks: allAttacksData,
          singleAttack: selectedReport,
          isLoading: isLoadingAllAttacksData || mitreMatrixIsLoading,
          errorAttacks: errorAllAttacksData,
          mitreMatrix: mitreAttackMatrixData,
          errorMitreMatrix: mitreMatrixError,
        }}
      >
        <LayoutSingleAttackAnalysis />
      </AttackInfoContext.Provider>
    </div>
  );
}

export default PageSingleAttackAnalysis;
