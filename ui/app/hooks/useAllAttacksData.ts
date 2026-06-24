// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useGetAllAttacksReportMainQuery, useGetAllAttacksReportTechniquesQuery, useGetAllAttacksReportTechniquesTimingQuery } from '../services/allAttacksReportDataApi';
import { useGetAllAttacksMetricsQuery } from '../services/allAttacksMetricsDataApi';
import { getValueCaseInsensitive } from '../../src/util/helperFunctions';
import { AttackResponse, AttackMetrics, VM_AllAttackData } from '../../src/types';

const convertDateFormat = (dateStr: string) => {
  if (!dateStr) return null;

  const dt = DateTime.fromISO(dateStr);
  if (dt.isValid) {
    return dt.toFormat('M/d/yyyy');
  }

  console.error("Failed to convert date:", dateStr);
  return null;
};

export const useAllAttacksData = () => {
  const [processedDataTiming, setProcessedDataTiming] = useState<any[] | null>(null);
  const [processedDataMetrics, setProcessedDataMetrics] = useState<any[] | null>(null);
  const [processedDataTechniques, setProcessedDataTechniques] = useState<any[] | null>(null);
  const [allAttacksData, setAllAttacksData] = useState<VM_AllAttackData[] | undefined>(undefined);
  const { data: allAttacksReportMainResponse, isLoading: allAttacksReportMainIsLoading, error: allAttacksReportMainError } = useGetAllAttacksReportMainQuery();
  const { data: allAttacksReportTechniquesResponse, isLoading: allAttacksReportTechniquesIsLoading, error: allAttacksReportTechniquesError } = useGetAllAttacksReportTechniquesQuery();
  const { data: allAttacksReportTechniquesTimingResponse, isLoading: allAttacksReportTechniquesTimingIsLoading, error: allAttacksReportTechniquesTimingError } = useGetAllAttacksReportTechniquesTimingQuery();
  const { data: allAttacksMetricsResponse, isLoading: allAttacksMetricsIsLoading, error: allAttacksMetricsError } = useGetAllAttacksMetricsQuery();

  const allAttacksReportMain = useMemo(() => {
    if (allAttacksReportMainResponse) {
      return allAttacksReportMainResponse as AttackResponse[];
    }
    return [];
  }, [allAttacksReportMainResponse]);

  const allAttacksMetrics = useMemo(() => {
    if (allAttacksMetricsResponse && ('value' in allAttacksMetricsResponse)) {
      return allAttacksMetricsResponse.value as AttackMetrics[];
    }
    return [];
  }, [allAttacksMetricsResponse]);

  useEffect(() => {
    if (!allAttacksReportMainIsLoading && !allAttacksReportTechniquesTimingIsLoading) {
      if (allAttacksReportMainResponse && allAttacksReportTechniquesTimingResponse) {
        const processDescriptionData = (data: AttackResponse[]) => {
          const relevantData = data.slice(1, 28);
          const maxDescriptionLength = 400;
          return relevantData.map(item => {
            const truncatedDesc = (item?.CaseStudyDescription ?? "").substring(0, maxDescriptionLength) + "...";
            return { ...item, truncatedDesc };
          });
        };

        const getUtcTimeForCaseStudyID = (targetCaseStudyID: string) => {
          const matchingAttack = allAttacksReportTechniquesTimingResponse.find((ttr: any) =>
            ttr.CaseStudyID === targetCaseStudyID && ttr.D_Notation.trim() === 'D-0'
          );
          return matchingAttack ? convertDateFormat(matchingAttack.UTC_Time) : null;
        };

        const dataWithTriggerDates = processDescriptionData(allAttacksReportMain).map(item => {
          const triggerDate = getUtcTimeForCaseStudyID(item.CaseStudyId);
          return { ...item, triggerDate };
        });
        setProcessedDataTiming(dataWithTriggerDates);
      }
    }
  }, [allAttacksReportMainIsLoading, allAttacksReportTechniquesTimingIsLoading, allAttacksReportMainResponse, allAttacksReportTechniquesTimingResponse, allAttacksReportMain]);

  useEffect(() => {
    // FIX: Removed the inner `if (allAttacksMetricsResponse)` gate so the pipeline
    // continues even when metrics data is unavailable. Techniques without a matching
    // stat entry are passed through as-is, so the matrix and timeline still render.
    if (!allAttacksMetricsIsLoading && processedDataTiming) {
      const result = processedDataTiming.map((dataItem) => {
        const matchingStat = allAttacksMetrics.find(t => t.properties.sql_name === dataItem.ShortName);
        return matchingStat ? { ...dataItem, ...matchingStat } : dataItem;
      });
      setProcessedDataMetrics(result);
    }
  }, [allAttacksMetricsIsLoading, processedDataTiming, allAttacksMetrics, allAttacksMetricsResponse]);

  useEffect(() => {
    const transformMergedObject = (obj: any): any => {
      const newObj: any = {};
      for (const key in obj) {
        if (key.endsWith('ID')) {
          const newKey = key.slice(0, -2) + 'Id';
          if (!obj[newKey]) {
            newObj[newKey] = obj[key];
          }
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    };

    if (processedDataMetrics && allAttacksReportTechniquesResponse && allAttacksReportTechniquesTimingResponse) {
      const mergedTechniques: any[] = [];

      for (const tech2 of allAttacksReportTechniquesTimingResponse) {
        const tech1 = allAttacksReportTechniquesResponse.find(t =>
          getValueCaseInsensitive(t, "CaseStudyId") === getValueCaseInsensitive(tech2, "CaseStudyId") &&
          getValueCaseInsensitive(t, "MITRE_TechniqueID") === getValueCaseInsensitive(tech2, "MITRE_TechniqueID") &&
          getValueCaseInsensitive(t, "MITRE_TacticID") === getValueCaseInsensitive(tech2, "MITRE_TacticID")
        );

        if (tech1) {
          const mergedTech = transformMergedObject({ ...tech1, ...tech2 });
          mergedTechniques.push(mergedTech);
        } else {
          mergedTechniques.push(tech2);
        }
      }

      const processedDataStatsWithTechniques = processedDataMetrics?.map((dataItem) => {
        const techniquesForCurrentCaseStudy = mergedTechniques.filter(
          technique => getValueCaseInsensitive(technique, "CaseStudyId") === getValueCaseInsensitive(dataItem, "CaseStudyId")
        ).sort((a, b) => {
          return a.TimingOrder - b.TimingOrder;
        });

        return { ...dataItem, Techniques: techniquesForCurrentCaseStudy };
      });

      setProcessedDataTechniques(processedDataStatsWithTechniques);
    }
  }, [allAttacksReportTechniquesResponse, allAttacksReportTechniquesTimingResponse, allAttacksReportTechniquesIsLoading, processedDataMetrics]);

  useEffect(() => {
    if (processedDataTechniques) {
      const remappedData: VM_AllAttackData[] = processedDataTechniques.map(dataItem => {
        const updatedDataItem = {
          caseStudyId: dataItem?.CaseStudyId,
          caseStudyName: dataItem?.CaseStudyName,
          caseStudyNameShort: dataItem?.ShortName,
          caseStudyBAMParentId: dataItem?.BAMParentId,
          caseStudyDesc: dataItem?.CaseStudyDescription,
          caseStudyDescTruncated: dataItem?.truncatedDesc,
          caseStudyFinancialLoss: {
            maxLoss: dataItem?.properties?.max_financial_loss ?? 0,
            minLoss: dataItem?.properties?.min_financial_loss ?? 0,
          },
          caseStudyAttackData: {
            dates: {
              initialAccess: dataItem?.properties?.initial_access_date,
              triggerDate: dataItem?.properties?.triggering_event_date,
              triggerYear: dataItem?.properties?.year_of_trigger,
              recovery: dataItem?.properties?.recovery_date,
            },
            durations: {
              precursor: dataItem?.properties?.precursor_duration ?? 0,
              recovery: dataItem?.properties?.recovery_duration ?? 0,
              total: dataItem?.properties?.total_attack_duration ?? 0,
            },
            totals: {
              precursorTechniques: dataItem?.properties?.precursor_techniques,
              icsTechniques: dataItem?.properties?.ics_techniques,
              observables: dataItem?.properties?.total_observables,
              hpObservables: dataItem?.properties?.hp_observables,
              techniqueObservables: dataItem?.properties?.technique_observables
            },
            ransomware: dataItem?.properties?.ransomware_involved,
            techniques: dataItem?.Techniques,
          },
        };

        return updatedDataItem;
      });

      setAllAttacksData(remappedData);
    }
  }, [processedDataTechniques]);

  return {
    allAttacksData,
    isLoadingAllAttacksData: allAttacksMetricsIsLoading || allAttacksReportMainIsLoading || allAttacksReportTechniquesIsLoading || allAttacksReportTechniquesTimingIsLoading,
    errorAllAttacksData: allAttacksMetricsError || allAttacksReportMainError || allAttacksReportTechniquesError || allAttacksReportTechniquesTimingError
  };
};
