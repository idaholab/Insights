// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export const getCssHexVarColor = (cssColor: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(cssColor);
}

export const getCssRGBVarColor = (cssColor: string): string => {
    const rootParts = getComputedStyle(document.documentElement).getPropertyValue(cssColor).split(' ');
    let rgbString = `rgb(${rootParts.join(', ')})`;
    let hexValue = rgbToHex(rgbString);
    return hexValue;
}

function rgbToHex(rgb: string): string {
    const componentToHex = (component: number): string => {
        const hex = component.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const result = rgb.match(/\d+/g);

    if (!result || result.length !== 3) {
        throw new Error('Invalid RGB format');
    }

    const r = parseInt(result[0], 10);
    const g = parseInt(result[1], 10);
    const b = parseInt(result[2], 10);

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// Utility function to get value from an object regardless of key's case
export const getValueCaseInsensitive = (obj: any, key: string) => {
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    return foundKey ? obj[foundKey] : undefined;
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});