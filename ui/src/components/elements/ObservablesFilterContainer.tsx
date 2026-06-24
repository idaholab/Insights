// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import CheckboxMenuFilter from './CheckboxMenuFilter';
import { CheckboxFilterOption } from './CheckboxMenuFilter';
import GenericLoadingErrorWrapper from '../wrappers/GenericLoadingErrorWrapper';

interface ObservablesFilterContainerProps {
  onKeywordChange: (keyword: string) => void;
  onPerceivabilityChange: (values: CheckboxFilterOption[]) => void;
  onTechniqueChange: (values: CheckboxFilterOption[]) => void;
  onTacticChange: (values: CheckboxFilterOption[]) => void;
  onCaseStudyChange: (values: CheckboxFilterOption[]) => void;
  onObservableTypeChange: (values: CheckboxFilterOption[]) => void;
  onObservableLevelChange: (values: CheckboxFilterOption[]) => void;
  onPhaseChange: (values: CheckboxFilterOption[]) => void;
  perceivabilitiesAndCounts: CheckboxFilterOption[];
  techniquesAndCounts: CheckboxFilterOption[];
  tacticsAndCounts: CheckboxFilterOption[];
  caseStudiesAndCounts: CheckboxFilterOption[];
  observableTypesAndCounts: CheckboxFilterOption[];
  observableLevelsAndCounts: CheckboxFilterOption[];
  phasesAndCounts: CheckboxFilterOption[];
  isLoading: boolean;
}

const ObservablesFilterContainer: React.FC<ObservablesFilterContainerProps> = ({
  onKeywordChange,
  onPerceivabilityChange,
  onTechniqueChange,
  onTacticChange,
  onCaseStudyChange,
  onObservableTypeChange,
  onObservableLevelChange,
  onPhaseChange,
  techniquesAndCounts,
  tacticsAndCounts,
  observableTypesAndCounts,
  observableLevelsAndCounts,
  phasesAndCounts,
  isLoading
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedPerceivabilities, setSelectedPerceivabilities] = useState<CheckboxFilterOption[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<CheckboxFilterOption[]>([]);
  const [selectedTactics, setSelectedTactics] = useState<CheckboxFilterOption[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<CheckboxFilterOption[]>([]);
  const [selectedObservableTypes, setSelectedObservableTypes] = useState<CheckboxFilterOption[]>([]);
  const [selectedObservableLevels, setSelectedObservableLevels] = useState<CheckboxFilterOption[]>([]);
  const [selectedPhases, setSelectedPhases] = useState<CheckboxFilterOption[]>([]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onKeywordChange(value);
  };

  const handleTechniqueChange = (values: CheckboxFilterOption[]) => {
    setSelectedTechniques(values);
    onTechniqueChange(values);
  };

  const handleTacticChange = (values: CheckboxFilterOption[]) => {
    setSelectedTactics(values);
    onTacticChange(values);
  };

  const handleObservableTypeChange = (values: CheckboxFilterOption[]) => {
    setSelectedObservableTypes(values);
    onObservableTypeChange(values);
  };

  const handleObservableLevelChange = (values: CheckboxFilterOption[]) => {
    setSelectedObservableLevels(values);
    onObservableLevelChange(values);
  };

  const handlePhaseChange = (values: CheckboxFilterOption[]) => {
    setSelectedPhases(values);
    onPhaseChange(values);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedPerceivabilities([]);
    setSelectedTechniques([]);
    setSelectedTactics([]);
    setSelectedCaseStudies([]);
    setSelectedObservableTypes([]);
    setSelectedObservableLevels([]);
    setSelectedPhases([]);
    onKeywordChange('');
    onPerceivabilityChange([]);
    onTechniqueChange([]);
    onTacticChange([]);
    onCaseStudyChange([]);
    onObservableTypeChange([]);
    onObservableLevelChange([]);
    onPhaseChange([]);
  };

  const hasActiveFilters = 
    keyword !== '' ||
    selectedPerceivabilities.length > 0 ||
    selectedTechniques.length > 0 ||
    selectedTactics.length > 0 ||
    selectedCaseStudies.length > 0 ||
    selectedObservableTypes.length > 0 ||
    selectedObservableLevels.length > 0 ||
    selectedPhases.length > 0;

  return (
    <div className="card bg-neutralc-100 dark:bg-neutralc-800 shadow-md mb-6 overflow-hidden">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-neutralc-200">Filter Observables</h2>
          {hasActiveFilters && (
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
        
        {/* Search Bar */}
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            height: 48,
            containerWidth: '100%',
            count: 1
          }}
          data={'unused'}
          error={null}
          keyIndex='observablesSearchBar'
          renderComponent={() => (
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="Search by description, technique, tactic, case study, or source..."
                className="input input-bordered w-full bg-neutralc-50 dark:bg-neutralc-900"
                value={keyword}
                onChange={handleKeywordChange}
              />
            </div>
          )}
        />

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3">
          {/* Tactic Filter */}
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              containerWidth: '200px',
              count: 1
            }}
            data={tacticsAndCounts}
            error={null}
            keyIndex='tacticFilter'
            renderComponent={() => (
              <CheckboxMenuFilter
                placeholderLabel="Tactics"
                options={tacticsAndCounts}
                selected={selectedTactics}
                onChange={handleTacticChange}
              />
            )}
          />

          {/* Technique Filter */}
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              containerWidth: '200px',
              count: 1
            }}
            data={techniquesAndCounts}
            error={null}
            keyIndex='techniqueFilter'
            renderComponent={() => (
              <CheckboxMenuFilter
                placeholderLabel="Techniques"
                options={techniquesAndCounts}
                selected={selectedTechniques}
                onChange={handleTechniqueChange}
              />
            )}
          />

          {/* Phase Filter */}
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              containerWidth: '150px',
              count: 1
            }}
            data={phasesAndCounts}
            error={null}
            keyIndex='phaseFilter'
            renderComponent={() => (
              <CheckboxMenuFilter
                placeholderLabel="Phase"
                options={phasesAndCounts}
                selected={selectedPhases}
                onChange={handlePhaseChange}
              />
            )}
          />

          {/* Observable Type Filter */}
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              containerWidth: '180px',
              count: 1
            }}
            data={observableTypesAndCounts}
            error={null}
            keyIndex='observableTypeFilter'
            renderComponent={() => (
              <CheckboxMenuFilter
                placeholderLabel="Observable Type"
                options={observableTypesAndCounts}
                selected={selectedObservableTypes}
                onChange={handleObservableTypeChange}
              />
            )}
          />

          {/* Observable Level Filter */}
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              containerWidth: '180px',
              count: 1
            }}
            data={observableLevelsAndCounts}
            error={null}
            keyIndex='observableLevelFilter'
            renderComponent={() => (
              <CheckboxMenuFilter
                placeholderLabel="Observable Level"
                options={observableLevelsAndCounts}
                selected={selectedObservableLevels}
                onChange={handleObservableLevelChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ObservablesFilterContainer;
