// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useState, useEffect, useMemo } from 'react';
import { useGetMitreAttackMatrixCategoriesQuery, useGetMitreAttackMatrixMappingQuery, useGetMitreAttackMatrixTechniquesQuery } from '../services/mitreAttackMatrixApi';

type MitreAttackCategory = {
  MITRE_TactidId: number;
  MITRE_TacticName: string;
  MITRE_TacticDescription: string;
};

type MitreAttackMatrixTechnique = {
  MITRE_TechniqueId: number;
  MITRE_Id: string;
  MITRE_TechniqueName: string;
  MITRE_TechniqueDescription: string;
};

type MergedDataStructure = {
  tactic: MitreAttackCategory;
  techniques: MitreAttackMatrixTechnique[];
};

export const useMitreMatrixData = () => {
  const [mitreAttackMatrixData, setMitreAttackMatrixData] = useState<MergedDataStructure[] | null>(null);
  const { data: categoriesData, isLoading: isLoadingCategories, error: mitreAttackMatrixCategoriesError } = useGetMitreAttackMatrixCategoriesQuery();
  const { data: mappingData, isLoading: isLoadingMapping, error: mitreAttackMatrixMappingError } = useGetMitreAttackMatrixMappingQuery();
  const { data: techniquesData, isLoading: isLoadingTechniques, error: mitreAttackMatrixTechniquesError } = useGetMitreAttackMatrixTechniquesQuery();

  const matrixCategorySortOrder = useMemo(() => [
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Evasion',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command and Control',
    'Inhibit Response Function',
    'Impair Process Control',
    'Impact'
  ], []);

  // Run only when all three data sets have been loaded
  useEffect(() => {
    if (!isLoadingCategories && !isLoadingMapping && !isLoadingTechniques && !mitreAttackMatrixCategoriesError && !mitreAttackMatrixMappingError && !mitreAttackMatrixTechniquesError) {
      if (categoriesData && mappingData && techniquesData) {
        const newMergedData: MergedDataStructure[] = [];

        categoriesData.forEach((category: any) => {
          const relatedMappings = mappingData.filter(
            (mapping: any) => {
              return (mapping.MITRE_TacticId === category.MITRE_TacticId)
            }
          );

          const relatedTechniques: MitreAttackMatrixTechnique[] = relatedMappings.map((mapping: any) => {
            return techniquesData.find(
              (technique: any) => technique.MITRE_TechniqueId === mapping.MITRE_TechniqueId
            );
          }).filter(Boolean) as MitreAttackMatrixTechnique[];

          newMergedData.push({
            tactic: category,
            techniques: relatedTechniques
          });
        });

        // Sort newMergedData based on matrixCategorySortOrder
        newMergedData.sort((a, b) => {
          const categoryA = a.tactic.MITRE_TacticName;
          const categoryB = b.tactic.MITRE_TacticName;
          const indexA = matrixCategorySortOrder.indexOf(categoryA);
          const indexB = matrixCategorySortOrder.indexOf(categoryB);

          return indexA - indexB;
        });

        setMitreAttackMatrixData(newMergedData);
      }
    }
  }, [isLoadingCategories, isLoadingMapping, isLoadingTechniques, categoriesData, mappingData, techniquesData, matrixCategorySortOrder, mitreAttackMatrixCategoriesError, mitreAttackMatrixMappingError, mitreAttackMatrixTechniquesError]);

  return {
    mitreAttackMatrixData,
    isLoading: isLoadingCategories || isLoadingMapping || isLoadingTechniques,
    error: mitreAttackMatrixCategoriesError || mitreAttackMatrixMappingError || mitreAttackMatrixTechniquesError
    // Include other states and errors if needed
  };
};
