// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { VM_AllAttackData } from "../types";

export type sortValues = '' | "oldest" | "newest" | 'highestMaxLossFirst' | 'lowestMaxLossFirst' | 'longestTotalDurationFirst' | 'shortestTotalDurationFirst' | 'nameAsc' | 'nameDesc';

// Define the sort functions
const sortFunctions: { [key in sortValues]?: (a: VM_AllAttackData, b: VM_AllAttackData) => number } = {
    'oldest': (a, b) => {
        const dateA = a.caseStudyAttackData?.dates?.triggerDate ?? a.caseStudyAttackData?.dates?.triggerYear?.toString() ?? '';
        const dateB = b.caseStudyAttackData?.dates?.triggerDate ?? b.caseStudyAttackData?.dates?.triggerYear?.toString() ?? '';
        return dateA.localeCompare(dateB);
    },
    'newest': (a, b) => {
        const dateA = a.caseStudyAttackData?.dates?.triggerDate ?? a.caseStudyAttackData?.dates?.triggerYear?.toString() ?? '';
        const dateB = b.caseStudyAttackData?.dates?.triggerDate ?? b.caseStudyAttackData?.dates?.triggerYear?.toString() ?? '';
        return dateB.localeCompare(dateA);
    },
    'highestMaxLossFirst': (a, b) => (b.caseStudyFinancialLoss?.maxLoss || 0) - (a.caseStudyFinancialLoss?.maxLoss || 0),
    'lowestMaxLossFirst': (a, b) => (a.caseStudyFinancialLoss?.maxLoss || 0) - (b.caseStudyFinancialLoss?.maxLoss || 0),
    'longestTotalDurationFirst': (a, b) => (b.caseStudyAttackData?.durations?.total || 0) - (a.caseStudyAttackData?.durations?.total || 0),
    'shortestTotalDurationFirst': (a, b) => (a.caseStudyAttackData?.durations?.total || 0) - (b.caseStudyAttackData?.durations?.total || 0),
    'nameAsc': (a, b) => a.caseStudyName.localeCompare(b.caseStudyName),
    'nameDesc': (a, b) => b.caseStudyName.localeCompare(a.caseStudyName),
};

export const sortData = (data: VM_AllAttackData[], sortValue: sortValues): VM_AllAttackData[] => {
    const sortFunction = sortFunctions[sortValue];
    if (sortFunction) {
        return [...data].sort(sortFunction);
    }
    return data;
};
