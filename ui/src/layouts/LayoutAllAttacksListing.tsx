// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState, useEffect, useMemo } from 'react';
import CardAllAttacksDesc from '../components/cards/CardAllAttacksDesc';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import PageBanner from '../components/elements/PageBanner';
import { filterAttackData } from '../util/AttackFilter';
import { AttackFilterCriteria, VM_AllAttackData } from '../types';
import { CheckboxFilterOption } from '../components/elements/CheckboxMenuFilter';
import CaseStudyFilterContainer from '../components/elements/CaseStudyFilterContainer';
import { sortData, sortValues } from '../util/AttackDataSort';
import { useTheme } from '../contexts/useTheme';

type Props = object;

const AllAttacks: React.FC<Props> = () => {
  const [sortOrder, setSortOrder] = useState<sortValues>('newest');
  const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
  const { allAttacksData, isLoadingAllAttacksData, errorAllAttacksData } = useAllAttacksData(); // NOTE: allAttacksData is the data structure we want for the filter
  const [criteria, setCriteria] = useState<AttackFilterCriteria>({
    maxLoss: undefined,
    maxLossMin: undefined,
    maxLossMax: undefined,
    minLoss: undefined,
    triggerDate: undefined,
    triggerYears: [],
    durationTotal: undefined,
    durationTotalMin: undefined,
    durationTotalMax: undefined,
    ransomware: undefined,
    keyword: '',
  });
  const [filteredData, setFilteredData] = useState<VM_AllAttackData[] | undefined>(allAttacksData);


  const isCriteriaEmpty = (criteria: AttackFilterCriteria) => {
    return !criteria.maxLoss &&
      !criteria.maxLossMin &&
      !criteria.maxLossMax &&
      !criteria.minLoss &&
      !criteria.triggerDate &&
      criteria?.triggerYears?.length === 0 &&
      !criteria.durationTotal &&
      !criteria.durationTotalMin &&
      !criteria.durationTotalMax &&
      !criteria.ransomware &&
      !criteria.keyword;
  };

  useEffect(() => {
    if (allAttacksData) {
      if (isCriteriaEmpty(criteria)) {
        setFilteredData(allAttacksData);
      } else {
        const filtered = filterAttackData(allAttacksData, criteria);
        setFilteredData(filtered);
      }
    }
  }, [allAttacksData, criteria]);

  const sortedAndFilteredData = useMemo(() => {
    const allData = filteredData || allAttacksData;
    if (!allData) {
      return [];
    }
    return sortData(allData, sortOrder);
  }, [allAttacksData, sortOrder, filteredData]);


  const getYearCounts = (data: any[]): CheckboxFilterOption[] => {
    const yearMap = data.reduce((acc, item) => {
      const year = item.caseStudyAttackData.dates.triggerYear;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(yearMap)
      .map(([year, count]) => ({
        value: year,
        label: `${year}`,
        recordCount: count as number,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  };


  // Compute available years from the sorted data
  const availableYears: CheckboxFilterOption[] = useMemo(() => {
    if (!allAttacksData) return [];
    const yearCounts = getYearCounts(allAttacksData);
    return yearCounts;
  }, [allAttacksData]);

  const handleKeywordFilter = (key: string) => {
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      keyword: key
    }));
  }

  const handleYearFilter = (selectedYears: CheckboxFilterOption[]) => {
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      triggerYears: selectedYears.map(str => Number(str.value))
    }));
  }

  const handleRansomwareFilter = (value: boolean) => {
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      ransomware: value
    }));
  }

  const handleMaxLossFilter = (value: number | undefined, min: number | undefined, max: number | undefined) => {
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      maxLoss: value,
      maxLossMin: min,
      maxLossMax: max
    }));
  }

  const handleTotalDurationFilter = (total: number | undefined, min: number | undefined, max: number | undefined) => {
    setCriteria((prevCriteria) => ({
      ...prevCriteria,
      durationTotal: total,
      durationTotalMin: min,
      durationTotalMax: max
    }));
  }

  const handleSortChange = (sort: sortValues) => {
    setSortOrder(sort);
  }

  return (
    <>
      <PageBanner isLoading={false} title='Attack Library - All Precursor Attacks' baseRoute='/single-attack-analysis' />

      <div className="p-10">

        {/* onSortChange={handleSortChange} */}
        <CaseStudyFilterContainer yearsAndCounts={availableYears} isLoading={isLoadingAllAttacksData} onKeywordChange={handleKeywordFilter} onYearChange={handleYearFilter} onRansomwareChange={handleRansomwareFilter} onMaxLossChange={handleMaxLossFilter} onTotalDurationChange={handleTotalDurationFilter}></CaseStudyFilterContainer>

        <div className="flex align-middle justify-between items-center mb-2">
          <h2 className={'text-2xl ml-5 dark:text-neutralc-300'}>
            {filteredData ? (filteredData?.length === 1) ? '1 Result' : `${filteredData?.length} Results` : ''}
          </h2>

          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: false,
              height: 48,
              containerWidth: '220px',
              count: 1
            }}
            data={'Unused here'}
            error={null}
            keyIndex='attacksSortOrderKey1'
            renderComponent={() =>
              <select
                className="select select-bordered max-w-xs bg-neutralc-100 dark:bg-neutralc-900"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as sortValues)}
              >
                <option disabled value="">SORT BY</option>
                <option key={'newest'} value="newest">NEWEST FIRST</option>
                <option key={'oldest'} value="oldest">OLDEST FIRST</option>
                <option key={'highestMaxLossFirst'} value="highestMaxLossFirst">HIGHEST MAX LOSS FIRST</option>
                <option key={'lowestMaxLossFirst'} value="lowestMaxLossFirst">LOWEST MAX LOSS FIRST</option>
                <option key={'longestTotalDurationFirst'} value="longestTotalDurationFirst">LONGEST TOTAL DURATION FIRST</option>
                <option key={'shortestTotalDurationFirst'} value="shortestTotalDurationFirst">SHORTEST TOTAL DURATION FIRST</option>
                <option key={'nameAsc'} value="nameAsc">NAME (A-Z) ASC</option>
                <option key={'nameDesc'} value="nameDesc">NAME (A-Z) DESC</option>
              </select>
            } />
        </div>

        {/* Card List */}
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoadingAllAttacksData,
            template: (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <div key={`skeletonSortedDataKey${index}`} className="p-4 bg-neutralc-200 dark:bg-neutralc-800 rounded-lg">
                    <Skeleton key={`skeleton1${index}`} className='mb-3' height={130} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    <Skeleton key={`skeleton2${index}`} className='mb-3' height={32} width={90} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    <Skeleton key={`skeleton3${index}`} className="mt-1" height={440} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  </div>
                ))}
              </div>
            )
          }}
          data={sortedAndFilteredData}
          error={errorAllAttacksData}
          keyIndex='attacksSortedDataKey'
          renderComponent={(content) => {
            return (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                {
                  content.map((object: any, index: number) => {
                    const key = `${object.caseStudyDesc}${index}`;
                    return (
                      <CardAllAttacksDesc key={key} data={object} keyIndex={key} sortOrder={sortOrder} />
                    );
                  })
                }
              </div>
            )
          }}
        />
      </div>
    </>
  );
}

export default AllAttacks;
