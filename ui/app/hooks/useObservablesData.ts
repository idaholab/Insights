// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useState, useEffect, useMemo } from 'react';
import { useGetAllObservablesQuery } from '../services/observablesDataApi';

// Use the same CheckboxFilterOption type from your existing code
export type CheckboxFilterOption = {
  value: string;
  label: string;
  recordCount?: number;
}

const getCountMap = (data: any[], key: string): Record<string, number> => {
  return data.reduce((acc, item) => {
    const value = item[key] as string;
    if (value && value.trim() !== '') {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
};

const convertToCheckboxOptions = (
  countMap: Record<string, number>,
  sortByCount = false
): CheckboxFilterOption[] => {
  const options = Object.entries(countMap).map(([value, count]) => ({
    value,
    label: value,
    recordCount: count,
  }));

  if (sortByCount) {
    return options.sort((a, b) => (b.recordCount ?? 0) - (a.recordCount ?? 0));
  }
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

export const useObservablesData = () => {
  const [observablesData, setObservablesData] = useState<any[] | undefined>(undefined);
  const { data: observablesResponse, isLoading, error } = useGetAllObservablesQuery();

  useEffect(() => {
    if (observablesResponse) {
      setObservablesData([...observablesResponse]);
    }
  }, [observablesResponse]);

  // Get counts for filters
  const perceivabilitiesAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const countMap = getCountMap(observablesData, 'perceivability');
    // Sort by perceivability level: High, Medium, Low
    const order: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return convertToCheckboxOptions(countMap).sort((a, b) => 
      (order[a.value] || 999) - (order[b.value] || 999)
    );
  }, [observablesData]);

  const techniquesAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    // Combine technique ID and name for better display
    const techniqueMap: Record<string, { id: string; name: string; count: number }> = {};
    observablesData.forEach(obs => {
      const key = obs.tech_ics_id;
      if (key && key.trim() !== '') {
        if (!techniqueMap[key]) {
          techniqueMap[key] = { id: key, name: obs.tech_ics_name, count: 0 };
        }
        techniqueMap[key].count++;
      }
    });
    return Object.entries(techniqueMap)
      .map(([id, data]) => ({
        value: id,
        label: `${id} - ${data.name}`,
        recordCount: data.count,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [observablesData]);

  const tacticsAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const tacticMap: Record<string, { id: string; name: string; count: number }> = {};
    observablesData.forEach(obs => {
      const key = obs.tact_ics_id;
      if (key && key.trim() !== '') {
        if (!tacticMap[key]) {
          tacticMap[key] = { id: key, name: obs.tact_ics_name, count: 0 };
        }
        tacticMap[key].count++;
      }
    });
    return Object.entries(tacticMap)
      .map(([id, data]) => ({
        value: id,
        label: `${data.name}`,
        recordCount: data.count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [observablesData]);

  const caseStudiesAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const caseMap: Record<string, { alias: string; name: string; count: number }> = {};
    observablesData.forEach(obs => {
      const key = obs.case_alias;
      if (key && key.trim() !== '') {
        if (!caseMap[key]) {
          caseMap[key] = { alias: key, name: obs.case_name, count: 0 };
        }
        caseMap[key].count++;
      }
    });
    return Object.entries(caseMap)
      .map(([alias, data]) => ({
        value: alias,
        label: alias.charAt(0).toUpperCase() + alias.slice(1),
        recordCount: data.count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [observablesData]);

  const observableTypesAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const countMap = getCountMap(observablesData, 'obs_type');
    return convertToCheckboxOptions(countMap);
  }, [observablesData]);

  const observableLevelsAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const countMap = getCountMap(observablesData, 'obs_lvl');
    return convertToCheckboxOptions(countMap).sort((a, b) => a.value.localeCompare(b.value));
  }, [observablesData]);

  const phasesAndCounts = useMemo<CheckboxFilterOption[]>(() => {
    if (!observablesData) return [];
    const countMap = getCountMap(observablesData, 'tact_tech_phase');
    // Sort by phase: Early, Middle, Late, Impact
    const order: Record<string, number> = { 'Early': 0, 'Middle': 1, 'Late': 2, 'Impact': 3 };
    return convertToCheckboxOptions(countMap).sort((a, b) => 
      (order[a.value] || 999) - (order[b.value] || 999)
    );
  }, [observablesData]);

  return {
    observablesData,
    isLoading,
    error,
    perceivabilitiesAndCounts,
    techniquesAndCounts,
    tacticsAndCounts,
    caseStudiesAndCounts,
    observableTypesAndCounts,
    observableLevelsAndCounts,
    phasesAndCounts,
  };
};
