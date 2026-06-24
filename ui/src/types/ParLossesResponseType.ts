// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type ParLossesResponse = {
    Maximum: {
        Minimum: number,
        Maximum: number,
        Average: number,
        Median: number
    },
    Minimum: {
        Minimum: number,
        Maximum: number,
        Average: number,
        Median: number
    }
}