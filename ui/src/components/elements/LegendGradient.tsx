// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState, useEffect, useCallback } from 'react';
import { GetContrastRatio, GetLuminance, hexToRgb } from '../../util/ColorHelperFunctions';

interface GradientLegendProps {
    title: string;
    className?: string;
    initialColors: string[],
    onColorsChange: (colors: string[]) => void; // Callback to report selected colors
}

const GradientLegend: React.FC<GradientLegendProps> = ({ title, className, initialColors, onColorsChange }) => {
    const tickMarks = [1, 20, 40, 60, 80, 99];
    const [colors, setColors] = useState<string[]>(initialColors);
    const [initialColorsState] = useState<string[]>(initialColors);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const handleColorChange = (index: number, color: string) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
    };

    const handleRefresh = useCallback(() => {
        setColors([...initialColorsState]); // Reset to initial colors
    }, [initialColorsState]);

    useEffect(() => {
        onColorsChange(colors);
    }, [colors, onColorsChange]);

    const gradient = colors.join(', ');

    const getGradientColorAtTick = (percentage: number): string => {
        const idx = Math.floor((percentage / 100) * (colors.length - 1));
        return colors[idx];
    };

    const getTextColorClass = (backgroundColor: string): string => {
        const rgbColor = hexToRgb(backgroundColor);
        const luminance = GetLuminance(rgbColor);
        const contrastWithWhite = GetContrastRatio(luminance, GetLuminance("rgb(255, 255, 255)"));
        const contrastWithBlack = GetContrastRatio(luminance, GetLuminance("rgb(0, 0, 0)"));
        return contrastWithWhite >= 4.5 ? "text-white" : contrastWithBlack >= 4.5 ? "text-black" : "";
    };

    return (
        <div className={`relative flex items-end ${className}`}>
            <div className="flex items-center w-full">
                <h2 className="text-lg mr-3 text-left dark:text-neutralc-100">{title}</h2>
                <div className={`flex flex-col `}>
                    <div className="flex items-center w-full">
                        {/* <h2 className="mb-2 text-left">{title}</h2> */}
                        <div
                            className="p-2 flex justify-between w-96 h-10 rounded shadow-lg"
                            style={{ background: `linear-gradient(to right, ${gradient})` }}>

                            {tickMarks.map((tick) => {
                                const tickColor = getGradientColorAtTick(tick);
                                const textColorClass = getTextColorClass(tickColor);
                                return (
                                    <div key={tick} className="relative flex items-center">
                                        <span className={`font-medium ${textColorClass}`}>{tick}%</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="ml-2 btn btn-xs text-xs  border-transparent hover:border-transparent dark:hover:text-white text-neutralc-400 hover:text-black" title={isAccordionOpen ? 'Hide Color Selection' : 'Choose Colors'}
                            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        >
                            <span className="material-icons" style={{ fontSize: '20px' }} >
                                {isAccordionOpen ? 'expand_less' : 'colorize'}
                            </span>
                        </button>
                    </div>
                    {isAccordionOpen && (
                        <div className="absolute flex top-full left-[60px] w-full mt-1 bg-white dark:bg-neutralc-800 p-2 rounded">
                            <div className="flex justify-between w-96">
                                {tickMarks.map((tick, index) => (
                                    <div key={tick} className="relative z-20 flex flex-col items-center">
                                        <input
                                            title="Select a color"
                                            type="color"
                                            value={colors[index]}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                className="ml-1 btn btn-xs z-20 border-transparent hover:border-transparent dark:hover:text-white text-neutralc-400 hover:text-black shadow-none"
                                title="Reset Colors"
                                onClick={handleRefresh}
                            >
                                <span className="material-icons">
                                    {'restart_alt'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default GradientLegend;
