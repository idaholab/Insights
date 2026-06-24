// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import GenericLoadingErrorWrapper from '../wrappers/GenericLoadingErrorWrapper';
import { currencyFormatter } from '../../util/helperFunctions';

type Unit = 'currency' | 'days' | 'hours';

interface OptionsRangeFilterProps {
    isLoading: boolean;
    inputValue: string | undefined;
    inputValueUnit: Unit;
    optionMap: Record<string, string>;
    defaultDisplayText: string,
    handleRangeAndValueChange: (total: string, min?: string, max?: string) => void;
}



const FilterOptionsOrRange: React.FC<OptionsRangeFilterProps> = ({ isLoading, inputValue, inputValueUnit, optionMap, defaultDisplayText, handleRangeAndValueChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [minValue, setMinValue] = useState<string>('');
    const [maxValue, setMaxValue] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string | undefined>(inputValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedValue(inputValue);
        if (inputValue === undefined) {
            setMaxValue('');
            setMinValue('');
        }
    }, [inputValue]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const minValue = e.target.value;
        const convertedMinValue: number = Number(minValue);
        if (convertedMinValue < 0) {
            alert("Min value cannot be less than 0."); // TODO: Swap for something different/better than alert
            e.preventDefault();
            return;
        }
        setMinValue(minValue);
        setSelectedValue('');
        handleRangeAndValueChange('', minValue, maxValue);
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxValue = e.target.value;
        const convertedMaxValue: number = Number(maxValue);
        if (convertedMaxValue < 0) {
            alert("Max value cannot be less than 0."); // TODO: Swap for something different/better than alert
            e.preventDefault();
            return;
        }
        setMaxValue(maxValue);
        setSelectedValue('');
        handleRangeAndValueChange('', minValue, maxValue);
    };

    const handleOutsideClick = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = (/*event: WheelEvent*/) => {
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('wheel', handleScroll);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('wheel', handleScroll);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.addEventListener('wheel', handleScroll);
        };
    }, []);

    const handleValueChange = (value: string) => {
        setMinValue('');
        setMaxValue('');
        setSelectedValue(value);
        handleRangeAndValueChange(value, undefined, undefined);
        setIsOpen(false);
    };

    const getDisplayText = (): string => {
        let formattedMinValue: string | undefined;
        let formattedMaxValue: string | undefined;
        switch (inputValueUnit) {
            case 'currency':
                formattedMinValue = minValue ? currencyFormatter.format(Number(minValue)) : undefined;
                formattedMaxValue = maxValue ? currencyFormatter.format(Number(maxValue)) : undefined;
                break;
            case 'days':
                formattedMinValue = minValue ? `${minValue} Days` : undefined;
                formattedMaxValue = maxValue ? `${maxValue} Days` : undefined;
                break;
            default:
                formattedMinValue = minValue;
                formattedMaxValue = maxValue;
                break;
        }
        let displayText = defaultDisplayText;
        if (formattedMinValue && formattedMaxValue) {
            displayText = `${formattedMinValue} - ${formattedMaxValue}`;
        } else if (formattedMinValue) {
            displayText = formattedMinValue;
        } else if (formattedMaxValue) {
            displayText = formattedMaxValue;
        } else if (selectedValue) {
            displayText = optionMap[selectedValue] || defaultDisplayText;
        }
        return displayText;
    };

    return (
        <GenericLoadingErrorWrapper
            skeletonTypeProps={{
                isLoading: isLoading,
                height: 48,
                containerWidth: '250px',
                count: 1
            }}
            data={'unused'}
            error={null}
            keyIndex='ValueFilter1'
            renderComponent={() => (
                <div className="relative" ref={dropdownRef}>
                    <div className="select w-full max-w-xs min-w-[220px] flex items-center input-select-standard" onClick={toggleDropdown}>
                        {getDisplayText()}
                    </div>
                    {isOpen && (
                        <div className="pt-1 fixed z-50 shadow-lg overflow-y-auto option-menu-standard">
                            <div className="flex flex-col ">
                                {Object.entries(optionMap).sort(([a], [b]) => Number(a) - Number(b)).map(([value, label]) => (
                                    <button
                                        key={value}
                                        className="px-4 cursor-pointer text-sm text-left hover:bg-primary hover:text-white"
                                        onClick={() => handleValueChange(value)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <h1 className='mt-3 px-4 text-md dark:text-neutralc-400 text-neutralc-600'>Range</h1>
                            <div className="mx-4 mb-1 flex flex-col filter-duration ">
                                <input
                                    type="number"
                                    className="mb-2 input input-bordered bg-secondary"
                                    placeholder="Min"
                                    value={minValue}
                                    onChange={handleMinChange}
                                />
                                <input
                                    type="number"
                                    className="input input-bordered bg-secondary"
                                    placeholder="Max"
                                    value={maxValue}
                                    onChange={handleMaxChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        />
    );
};

export default FilterOptionsOrRange;
