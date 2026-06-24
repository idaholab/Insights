// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type AttackFilterCriteria = {
    maxLoss?: number;
    maxLossMin?: number;
    maxLossMax?: number;
    minLoss?: number;
    triggerDate?: Date;
    triggerYears?: number[];
    durationPrecursor?: number;
    durationRecovery?: number;
    durationTotal?: number;
    durationTotalMax?: number;
    durationTotalMin?: number;
    ransomware?: boolean;
    keyword?: string;
};