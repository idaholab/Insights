// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import GenericLoadingErrorWrapper from '../wrappers/GenericLoadingErrorWrapper';
import { useState } from 'react';
import CheckboxMenuFilter, { CheckboxFilterOption } from './CheckboxMenuFilter';
import FilterOptionsOrRange from './FilterByOptionsOrRange';
import { currencyFormatter } from '../../util/helperFunctions';

type BadgeType = 'keyword' | 'year' | 'maxLoss' | 'totalDuration' | 'ransomware';

type Badge = {
    name: string;
    type: BadgeType;
    value: string | CheckboxFilterOption | boolean | number;
}

type Props = {
    yearsAndCounts: CheckboxFilterOption[];
    isLoading: boolean;
    onKeywordChange: (newKeyword: string) => void;
    onYearChange: (newYears: CheckboxFilterOption[]) => void;
    onMaxLossChange: (value: number | undefined, min: number | undefined, max: number | undefined) => void;
    onTotalDurationChange: (total: number | undefined, min: number | undefined, max: number | undefined) => void;
    onRansomwareChange: (value: boolean) => void;
    //onSortChange: (sortValue: sortValues) => void;
};

const CaseStudyFilterContainer: React.FC<Props> = React.memo(({
    yearsAndCounts,
    isLoading,
    onKeywordChange,
    onYearChange,
    onMaxLossChange,
    onTotalDurationChange,
    onRansomwareChange,
    //onSortChange
}) => {
    const [keyword, setKeyword] = useState<string>('');
    const [selectedYears, setSelectedYears] = useState<CheckboxFilterOption[]>([]);
    const [selectedMaxLoss, setSelectedMaxLoss] = useState<string | undefined>('');
    const [selectedTotalDuration, setSelectedTotalDuration] = useState<string | undefined>('');
    const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
    const [isRansomwareChecked, setIsRansomwareChecked] = useState(false);
    //const [sortOrder, setSortOrder] = useState<sortValues>('');

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        onKeywordChange(e.target.value);
        setSelectedBadges(badgeCUD(`Keyword Filter: ${e.target.value}`, e.target.value, 'keyword'));
    };

    const clearKeywordInput = () => {
        setKeyword('');
        onKeywordChange('');
    };

    const handleYearSelectionChange = (selectedValues: CheckboxFilterOption[]) => {
        setSelectedYears(selectedValues);
        onYearChange(selectedValues);

        // Update badges
        const yearBadges: Badge[] = selectedValues.map(year => ({
            name: 'Year Filter: ' + year.value.toString(),
            type: 'year',
            value: year
        }));
        const nonYearBadges = selectedBadges.filter(badge => badge.type !== 'year');
        setSelectedBadges([...nonYearBadges, ...yearBadges]);
    };

    const handleMaxLossSelectionChange = (selectedValue: string | undefined, min?: string, max?: string) => {
        let value: number | undefined = selectedValue ? Number(selectedValue) : undefined;
        if (min && !max || max && !min) { // One range
            value = (min) ? Number(min) : Number(max);
            setSelectedMaxLoss(value.toString());
            onMaxLossChange(undefined, (min) ? Number(min) : undefined, (max) ? Number(max) : undefined);
            setSelectedBadges(badgeCUD(`Max Loss: ${`${currencyFormatter.format(Number(value))}`}`, value, 'maxLoss'));
        }
        else if (min && max) { // Both ranges
            setSelectedMaxLoss(min.toString());
            onMaxLossChange(undefined, Number(min), Number(max));
            setSelectedBadges(badgeCUD(`Max Loss: ${`${currencyFormatter.format(Number(min))}`} - ${`${currencyFormatter.format(Number(max))}`}`, min, 'maxLoss'));
        }
        else { // no range
            setSelectedMaxLoss(selectedValue);
            onMaxLossChange(value, undefined, undefined);
            setSelectedBadges(badgeCUD(`Max Loss: ${currencyFormatter.format(Number(selectedValue))}`, selectedValue, 'maxLoss'));
        }
    }

    const handleTotalDurationSelectionChange = (total: string | undefined, min?: string, max?: string) => {
        let value: number | undefined = total ? Number(total) : undefined;
        if (min && !max || max && !min) { // One range
            value = (min) ? Number(min) : Number(max);
            setSelectedTotalDuration(value.toString());
            onTotalDurationChange(undefined, (min) ? Number(min) : undefined, (max) ? Number(max) : undefined);
            setSelectedBadges(badgeCUD(`Total Duration: ${value}`, value, 'totalDuration'));
        }
        else if (min && max) { // Both ranges
            setSelectedTotalDuration(min.toString());
            onTotalDurationChange(undefined, Number(min), Number(max));
            setSelectedBadges(badgeCUD(`Total Duration: ${min} - ${max}`, min, 'totalDuration'));
        }
        else { // no range
            setSelectedTotalDuration(total);
            onTotalDurationChange(value, undefined, undefined);
            setSelectedBadges(badgeCUD(`Total Duration: ${total}`, total, 'totalDuration'));
        }
    }

    const badgeCUD = (name: string, value: any, badgeType: BadgeType) => {
        const existingBadgeIndex = selectedBadges.findIndex(badge => badge.type === badgeType);
        const newBadges = [...selectedBadges];
        if (existingBadgeIndex > -1) {
            if (value) {
                newBadges[existingBadgeIndex] = { name: name, type: badgeType, value: value }; // Update
            } else {
                newBadges.splice(existingBadgeIndex, 1); // Delete
            }
        } else if (value) {
            newBadges.push({ name: name, type: badgeType, value: value }); // Add
        }
        return newBadges;
    }

    const handleBadgeRemove = (badge: Badge) => {
        if (badge.type === 'keyword') {
            clearKeywordInput();
        } else if (badge.type === 'year') {
            const year = badge.value as CheckboxFilterOption;
            const years = selectedYears.filter(y => y !== year);
            setSelectedYears(years);
            onYearChange(years);
        }
        else if (badge.type === 'ransomware') {
            setIsRansomwareChecked(false);
            onRansomwareChange(false);
        }
        else if (badge.type === 'totalDuration') {
            handleTotalDurationSelectionChange(undefined);
        }
        else if (badge.type === 'maxLoss') {
            handleMaxLossSelectionChange(undefined);
        }
        setSelectedBadges(selectedBadges.filter(b => b !== badge)); // Remove the badge
    };

    const handleClearAllFilters = () => {
        handleYearSelectionChange([]);
        handleMaxLossSelectionChange(undefined)
        handleTotalDurationSelectionChange(undefined);
        clearKeywordInput();
        setSelectedYears([]);
        setSelectedBadges([]);
        setIsRansomwareChecked(false);
        onRansomwareChange(false);
    }

    const handleRansomwareToggle = () => {
        setIsRansomwareChecked((prev) => {
            const newVal = !prev;
            onRansomwareChange(newVal);
            setSelectedBadges((newVal) ? badgeCUD('Filter by Ransomware', newVal, 'ransomware') : selectedBadges.filter(b => b.type !== 'ransomware'));
            return newVal;
        });
    };

    // const handleSortChange = (sort: sortValues) => {
    //     setSortOrder(sort);
    //     onSortChange(sort);
    // }

    const durationMap: Record<string, string> = {
        "": "-None-",
        "10": "10 Days",
        "50": "50 Days",
        "100": "100 Days",
        "365": "1 Year",
        "730": "2 Years",
        "1825": "5 Years"
    };

    const maxLossMap: Record<string, string> = {
        "": "-None-",
        "1000": "$1 Thousand",
        "10000": "$10 Thousand",
        "50000": "$50 Thousand",
        "100000": "$100 Thousand",
        "1000000": "$1 Million",
        "10000000": "$10 Million",
        "50000000": "$50 Million",
        "100000000": "$100 Million",
        "1000000000": "$1 Billion",
        "10000000000": "$10 Billion",
        "5000000000": "$50 Billion",
        "100000000000": "$100 Billion",
    };

    return (
        // <CardStatusNested title="Filter" type={'normal'}>

        <div className="card space-y-4 mb-8 p-5 flex flex-col align-middle shadow-md overflow-hidden card-standard ">
            <h4 className={'text-xl'}>
                Filter
            </h4>

            <div className="flex items-center flex-wrap justify-between gap-4">
                <div className="flex items-center gap-4 flex-grow">
                    {/* Keyword */}
                    <GenericLoadingErrorWrapper
                        skeletonTypeProps={{
                            isLoading: isLoading,
                            height: 48,
                            containerWidth: '250px',
                            count: 1
                        }}
                        data={'Not used here'}
                        error={null}
                        keyIndex='FilterByRansomware1'
                        renderComponent={() =>
                            <div className="flex items-center flex-grow">
                                <div className="relative w-full min-w-[250px]">
                                    <input
                                        type="text"
                                        placeholder="FILTER BY KEYWORD"
                                        className="input w-full pr-10  
                                        		input-select-standard"
                                        value={keyword}
                                        onChange={handleKeywordChange}
                                    />
                                    {keyword && (
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutralc-800 dark:text-neutralc-200"
                                            onClick={clearKeywordInput}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        } />

                    <div className="flex items-center gap-1">
                        {/* Filter by Year */}
                        <GenericLoadingErrorWrapper
                            skeletonTypeProps={{
                                isLoading: isLoading,
                                height: 48,
                                containerWidth: '147px',
                                count: 1
                            }}
                            data={'Not used here'}
                            error={null}
                            keyIndex='YearFilter1'
                            renderComponent={() =>
                                <CheckboxMenuFilter isDisabled={false} placeholderLabel={'FILTER BY YEAR'} options={yearsAndCounts} selected={selectedYears} onChange={handleYearSelectionChange}></CheckboxMenuFilter>
                            } />

                        <FilterOptionsOrRange isLoading={isLoading} inputValue={selectedMaxLoss} inputValueUnit={'currency'} optionMap={maxLossMap} defaultDisplayText='FILTER BY MAX LOSS' handleRangeAndValueChange={handleMaxLossSelectionChange}></FilterOptionsOrRange>

                        <FilterOptionsOrRange isLoading={isLoading} inputValue={selectedTotalDuration} inputValueUnit={'days'} optionMap={durationMap} defaultDisplayText='FILTER BY TOTAL DURATION' handleRangeAndValueChange={handleTotalDurationSelectionChange}></FilterOptionsOrRange>

                        <GenericLoadingErrorWrapper
                            skeletonTypeProps={{
                                isLoading: isLoading,
                                height: 48,
                                containerWidth: '220px',
                                count: 1
                            }}
                            data={'FILTER BY RANSOMWARE'}
                            error={null}
                            keyIndex='FilterByRansomware1'
                            renderComponent={(content) =>
                                <button className={`btn flex items-center justify-between border-0 text-neutralc-700 hover:text-black dark:text-neutralc-300 dark:hover:text-white`}>
                                    <input
                                        type="checkbox"
                                        checked={isRansomwareChecked}
                                        onChange={handleRansomwareToggle}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="ml-2">{content}</span>
                                </button>
                            } />
                    </div>
                </div>
            </div >

            {selectedBadges && selectedBadges?.length > 0 &&
                <div className="flex flex-wrap space-x-2">
                    {selectedBadges?.map(badge => (
                        <div key={badge.name} className={`badge badge-secondary py-3 flex items-center space-x-1 text-neutralc-900 dark:text-neutralc-100`}>
                            <span>{badge.name}</span>
                            <button onClick={() => handleBadgeRemove(badge)}>✕</button>
                        </div>
                    ))}
                    <button
                        className={`btn btn-xs bg-secondary`}
                        onClick={handleClearAllFilters}
                    >
                        <span className="">CLEAR ALL</span>
                    </button>
                </div>
            }

        </div >
    )
})
export default CaseStudyFilterContainer;