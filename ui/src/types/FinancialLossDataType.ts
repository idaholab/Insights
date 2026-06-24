// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type FinancialLossHistogramData = {
    hist: {
        bin_edges_shared: number[];
        counts_max: number[];
        counts_min: number[];
    };
    kde: {
        kde_max: number[];
        kde_min: number[];
        x_shared: number[];
    }
};