// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState, useEffect, useRef } from 'react';
import 'material-icons/iconfont/material-icons.css';

export type CheckboxFilterOption = {
    value: string;
    label: string;
    recordCount?: number
}

type CheckboxSelectProps = {
    placeholderLabel: string;
    options: CheckboxFilterOption[];
    selected: CheckboxFilterOption[];
    isDisabled?: boolean;
    onChange: (selectedValues: CheckboxFilterOption[]) => void;
};

const CheckboxMenuFilter: React.FC<CheckboxSelectProps> = ({ placeholderLabel, options, selected, isDisabled = false, onChange }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValues, setSelectedValues] = useState<CheckboxFilterOption[]>(selected);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [displayedText, setDisplayedText] = useState<string>(placeholderLabel);

    useEffect(() => {
        setSelectedValues(selected);
    }, [selected]);

    useEffect(() => {
        setDisplayedText(placeholderLabel);
    }, [placeholderLabel]);

    useEffect(() => {
        const count = selectedValues?.length || 0;

        if (count === 0) {
            setDisplayedText(placeholderLabel);
        } else if (count === 1) {
            setDisplayedText(selectedValues[0].label);
        } else {
            setDisplayedText(`${selectedValues[0].label} + ${count - 1}`);
        }
    }, [selectedValues]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

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
            document.removeEventListener('wheel', handleScroll);
        };
    }, [isOpen]);

    useEffect(() => {
        if (dropdownRef.current) {
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            if (containerRef.current && buttonRef.current) {
                //containerRef.current.style.width = `${dropdownRect.width}px`;
                buttonRef.current.style.width = `${dropdownRect.width + 10}px`;
            }
        }
        if (isOpen && containerRef.current && dropdownRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            dropdownRef.current.style.top = `${containerRect.bottom}px`;
            dropdownRef.current.style.left = `${containerRect.left}px`;
            dropdownRef.current.style.width = `${dropdownRect.width + 10}px`;
        }
    }, [isOpen, containerRef.current, dropdownRef.current, buttonRef.current]);

    const handleCheckboxChange = (value: CheckboxFilterOption) => {
        const index = selectedValues.indexOf(value);
        let values = [...selectedValues];
        if (index !== -1) { // Remove
            values = [...values.slice(0, index), ...values.slice(index + 1)];
            setSelectedValues(values);
        } else { // Add 
            values = [...values, value];
            setSelectedValues(values);
        }
        onChange(values);
    };

    const selectAll = () => {
        const allValues = options.map(option => option);
        setSelectedValues(allValues);
        onChange(allValues);
    };

    const selectNone = () => {
        setSelectedValues([]);
        onChange([]);
    };

    return (
        <div className="relative flex w-max" ref={containerRef}>
            <button className={`select w-full flex items-center w-max input-select-standard ${selectedValues?.length > 0 ? '!border-warning' : ''}`} onClick={toggleDropdown} ref={buttonRef} disabled={isDisabled}>
                <span className='whitespace-nowrap'>{displayedText}</span>
            </button>
            {isOpen && (
                <div ref={dropdownRef} className="p-1 fixed w-max z-50 shadow-lg overflow-y-auto option-menu-standard">
                    <div className="flex flex-col p-2 ">
                        <div className="flex mb-2">
                            <button className="btn btn-xs px-2 py-1 h-6 mr-2 btn-outline dark:hover:text-black" onClick={selectAll}>All</button>
                            <button className="btn btn-xs px-2 py-1 h-6 btn-outline dark:hover:text-black" onClick={selectNone}>None</button>
                        </div>
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center mb-2 whitespace-nowrap ">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 checkbox checkbox-primary"
                                    value={option.value}
                                    checked={selectedValues.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                                <span className='flex ml-3'>
                                    <span className='text-sm text-neutralc-900 dark:text-neutralc-100'>{option.label}</span>
                                    {option?.recordCount &&
                                        <span className='text-sm ml-2 text-neutralc-500 dark:text-neutralc-400'>({option?.recordCount})</span>
                                    }
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckboxMenuFilter;