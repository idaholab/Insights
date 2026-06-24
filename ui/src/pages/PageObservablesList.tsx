// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useObservablesData } from '../../app/hooks/useObservablesData';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';
import { CheckboxFilterOption } from '../../app/hooks/useObservablesData';
import { filterObservables, isCriteriaEmpty, ObservableFilterCriteria } from '../util/ObservableFilter';
import ObservablesFilterContainer from '../components/elements/ObservablesFilterContainer';
import ObservableTreeGroup from '../components/cards/ObservableTreeGroup';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../contexts/useTheme';

const PageObservablesList: React.FC = () => {
  const { caseAlias } = useParams<{ caseAlias: string }>();
  const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
  const { observablesData, isLoading, error } = useObservablesData();
  const { allAttacksData } = useAllAttacksData();

  const [criteria, setCriteria] = useState<ObservableFilterCriteria>({
    keyword: '',
    perceivability: [],
    techniques: [],
    tactics: [],
    caseStudies: [],
    observableTypes: [],
    observableLevels: [],
    phases: [],
  });

  // Filter by case alias first
  const caseObservables = useMemo(() => {
    if (!observablesData || !caseAlias) return [];
    return observablesData.filter(obs => obs.case_alias === caseAlias);
  }, [observablesData, caseAlias]);

  // Look up the medium-length attack name from allAttacksData
  const caseStudyName = useMemo(() => {
    const matchedAttack = allAttacksData?.find(
      attack => attack.caseStudyNameShort?.toLowerCase() === caseAlias?.toLowerCase()
    );
    return matchedAttack?.caseStudyName ?? caseAlias;
  }, [allAttacksData, caseAlias]);

  // Calculate filter counts based on current case only
  const filterCounts = useMemo(() => {
    const getCountMap = (data: any[], key: string): Record<string, number> => {
      return data.reduce((acc, item) => {
        const value = item[key] as string;
        if (value && value.trim() !== '') {
          acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
    };

    const convertToOptions = (countMap: Record<string, number>): CheckboxFilterOption[] => {
      return Object.entries(countMap)
        .map(([value, count]) => ({ value, label: value, recordCount: count }))
        .sort((a, b) => a.label.localeCompare(b.label));
    };

    if (!caseObservables.length) {
      return {
        perceivabilities: [],
        techniques: [],
        tactics: [],
        types: [],
        levels: [],
        phases: [],
      };
    }

    return {
      perceivabilities: convertToOptions(getCountMap(caseObservables, 'perceivability')),
      techniques: (() => {
        const techMap: Record<string, { id: string; name: string; count: number }> = {};
        caseObservables.forEach(obs => {
          const key = obs.tech_ics_id;
          if (key && key.trim() !== '') {
            if (!techMap[key]) {
              techMap[key] = { id: key, name: obs.tech_ics_name, count: 0 };
            }
            techMap[key].count++;
          }
        });
        return Object.entries(techMap)
          .map(([id, data]) => ({ value: id, label: `${id} - ${data.name}`, recordCount: data.count }))
          .sort((a, b) => a.value.localeCompare(b.value));
      })(),
      tactics: (() => {
        const tacticMap: Record<string, { id: string; name: string; count: number }> = {};
        caseObservables.forEach(obs => {
          const key = obs.tact_ics_id;
          if (key && key.trim() !== '') {
            if (!tacticMap[key]) {
              tacticMap[key] = { id: key, name: obs.tact_ics_name, count: 0 };
            }
            tacticMap[key].count++;
          }
        });
        return Object.entries(tacticMap)
          .map(([id, data]) => ({ value: id, label: data.name, recordCount: data.count }))
          .sort((a, b) => a.label.localeCompare(b.label));
      })(),
      types: convertToOptions(getCountMap(caseObservables, 'obs_type')),
      levels: convertToOptions(getCountMap(caseObservables, 'obs_lvl')),
      phases: convertToOptions(getCountMap(caseObservables, 'tact_tech_phase')),
    };
  }, [caseObservables]);

  const [filteredData, setFilteredData] = useState<any[]>(caseObservables);

  useEffect(() => {
    if (caseObservables) {
      if (isCriteriaEmpty(criteria)) {
        setFilteredData(caseObservables);
      } else {
        const filtered = filterObservables(caseObservables, criteria);
        setFilteredData(filtered);
      }
    }
  }, [caseObservables, criteria]);

  // Group observables by tact_tech_combined_seq_id
  const groupedObservables = useMemo(() => {
    const groups = new Map<string, any[]>();
    
    filteredData.forEach(obs => {
      const groupId = obs.tact_tech_combined_seq_id;
      if (!groups.has(groupId)) {
        groups.set(groupId, []);
      }
      const group = groups.get(groupId);
      if (group) {
        group.push(obs);
      }
    });

    groups.forEach((group) => {
      group.sort((a, b) => parseInt(a.case_obs_seq) - parseInt(b.case_obs_seq));
    });

    return Array.from(groups.values());
  }, [filteredData]);

  const handleKeywordFilter = (keyword: string) => {
    setCriteria((prev) => ({ ...prev, keyword }));
  };

  const handlePerceivabilityFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, perceivability: values.map(v => v.value) }));
  };

  const handleTechniqueFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, techniques: values.map(v => v.value) }));
  };

  const handleTacticFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, tactics: values.map(v => v.value) }));
  };

  const handleObservableTypeFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, observableTypes: values.map(v => v.value) }));
  };

  const handleObservableLevelFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, observableLevels: values.map(v => v.value) }));
  };

  const handlePhaseFilter = (values: CheckboxFilterOption[]) => {
    setCriteria((prev) => ({ ...prev, phases: values.map(v => v.value) }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-neutralc-200 mb-2">{caseStudyName}</h1>
      </div>

      <ObservablesFilterContainer
        onKeywordChange={handleKeywordFilter}
        onPerceivabilityChange={handlePerceivabilityFilter}
        onTechniqueChange={handleTechniqueFilter}
        onTacticChange={handleTacticFilter}
        onCaseStudyChange={() => { /* Not needed - filtering by case */ }}
        onObservableTypeChange={handleObservableTypeFilter}
        onObservableLevelChange={handleObservableLevelFilter}
        onPhaseChange={handlePhaseFilter}
        perceivabilitiesAndCounts={filterCounts.perceivabilities}
        techniquesAndCounts={filterCounts.techniques}
        tacticsAndCounts={filterCounts.tactics}
        caseStudiesAndCounts={[]}
        observableTypesAndCounts={filterCounts.types}
        observableLevelsAndCounts={filterCounts.levels}
        phasesAndCounts={filterCounts.phases}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl dark:text-neutralc-300">
          {groupedObservables.length === 1 
            ? '1 Observable Group' 
            : `${groupedObservables.length} Observable Groups`}
        </h2>
      </div>

      <GenericLoadingErrorWrapper
        skeletonTypeProps={{
          isLoading: isLoading,
          template: (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={`skeleton-${index}`}
                  height={100}
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                />
              ))}
            </div>
          ),
        }}
        data={groupedObservables}
        error={error}
        keyIndex="observables-list"
        renderComponent={(data) => (
          <div className="space-y-4">
            {data.map((group: any[], index: number) => (
              <ObservableTreeGroup 
                key={`group-${group[0]?.tact_tech_combined_seq_id}-${index}`}
                observables={group}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default PageObservablesList;
