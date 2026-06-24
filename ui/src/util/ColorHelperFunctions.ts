// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import tinycolor from 'tinycolor2';

export const GetColorFromGradient = (probability: number, colors: string[]): string => {
    // Ensure the input probability is between 0 and 1
    if (probability < 0 || probability > 1) {
        throw new Error('Probability must be between 0 and 1');
    }

    // Ensure we have between 2 and 5 colors
    if (colors.length < 2 || colors.length > 6) {
        throw new Error('getColorFromGradient requires between 2 and 6 colors.');
    }

    // Calculate the index and ratio
    const scaledProb = probability * (colors.length - 1);
    const index = Math.floor(scaledProb);
    const ratio = scaledProb - index;

    // Parse the colors using tinycolor
    const color1 = tinycolor(colors[index]);
    const color2 = tinycolor(colors[index + 1] || colors[index]);

    // Interpolate between the two nearest colors
    const interpolatedColor = tinycolor.mix(color1, color2, ratio * 100);

    return interpolatedColor.toRgbString();
};

// Helper function to calculate relative luminance
export const GetLuminance = (color: string) => {
    const rgb = color.match(/\d+/g)?.map(Number);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Helper function to calculate contrast ratio
export const GetContrastRatio = (luminance1: number, luminance2: number) => {
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
};

export const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        m=m;
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(0, 0, 0)';
};