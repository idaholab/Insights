// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { DateTime } from 'luxon';

export const convertDateFormat = (dateStr?: string, format?: string): string | null => {
    if (!dateStr) return null;

    //format should be string like d-LLL-yy, d-MMM-yy
    let f = format || 'd-LLL-yy'

    // Try to parse the date string as ISO 8601 format first
    let dt = DateTime.fromISO(dateStr);
    if (dt.isValid) {
        return dt.toFormat(f);
    }

    dt = DateTime.fromFormat(dateStr, f);
    if (dt.isValid) {
        return dt.toFormat(f);
    }

    // If not ISO, try potential formats
    // const potentialFormats = ['d-LLL-yy', 'dd-LLL-yy'];

    // for (const format of potentialFormats) {
    //     dt = DateTime.fromFormat(dateStr, format);
    //     if (dt.isValid) {
    //         return dt.toFormat('d-LLL-yy');
    //     }
    // }

    console.error("Failed to convert date with all potential formats:", dateStr);
    return null;
};