// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import PlotlyGraph from '../elements/PlotlyGraph';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor } from '../../util/helperFunctions';
import { TacticTechniqueCountsResponse } from '../../types';

interface Props {
    data: TacticTechniqueCountsResponse[] | undefined;
}

type PlotDataType = {
    name?: string;
    mode: string;
    x: number[] | undefined;
    y?: string[] | undefined;
    type: string;
    marker?: {
        color: string;
        opacity?: number;
        size: number;
    };
    hoverinfo: string;
    visible?: boolean | "legendonly";
};

const GraphTacticTechniqueFrequency: React.FC<Props> = ({ data }) => {
    const [plotData, setPlotData] = useState<any>(null);
    const { theme, graphLineColor, graphFontColor } = useTheme();
    let markerColorOrange: string = theme === 'dark' ? getCssHexVarColor('--color-graph-light-orange') : getCssHexVarColor('--color-graph-orange');
    let markerColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-light-blue') : getCssHexVarColor('--color-graph-blue');

    const initialLayout = {
        shapes: [],
        barmode: 'group',
        layout: {
            font: {
                color: graphFontColor
            }
        },
        yaxis: {
            title: {
                text: "Tactic/Technique",
                standoff: 15
            },
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        xaxis: {
            title: {
                text: "Frequency",
                standoff: 15
            },
            side: 'top',
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        legend: {
            font: {
                color: '#ffffff'
            }
        },
        height: 1500
    };
    const [layout, setLayout] = useState(initialLayout);

    useEffect(() => {
        if (data && data.length) {
            let tacticTechniqueParCountsData = [...data]?.sort((a, b) => a?.count - b?.count);
            const labels = tacticTechniqueParCountsData.map(row => `${row.tactic}: ${row.technique}`);
            const frequencies = tacticTechniqueParCountsData.map(row => row.count);
            const newPlotData: PlotDataType[] = [{
                x: frequencies,
                y: labels,
                type: 'scatter',
                mode: 'markers',
                name: 'Technique Frequencies',
                marker: {
                    color: markerColorBlue,
                    size: 8
                },
                hoverinfo: 'x+y'
            },
            {
                x: frequencies.slice(-5),
                y: labels.slice(-5),
                type: 'scatter',
                mode: 'markers',
                name: '5 Most Frequent Tactic-Technique Combinations',
                marker: {
                    color: markerColorOrange,
                    size: 8
                },
                hoverinfo: 'x+y'
            }
            ];

            setPlotData(newPlotData);
        }
    }, [data, theme]);

    useEffect(() => {
        setLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                gridcolor: graphLineColor,
                title: {
                    ...prevLayout.xaxis.title,
                    font: {
                        color: graphFontColor,
                    }
                },
                tickfont: {
                    color: graphFontColor,
                },
            },
            yaxis: {
                ...prevLayout.yaxis,
                gridcolor: graphLineColor,
                title: {
                    ...prevLayout.yaxis.title,
                    font: {
                        color: graphFontColor,
                    }
                },
                tickfont: {
                    color: graphFontColor,
                },
            },
            legend: {
                font: {
                    color: '#ffffff'
                }
            }
        }));
    }, [theme]);

    return (
        <>
            {plotData && <PlotlyGraph data={plotData} layout={layout} />}
        </>
    );
}

export default GraphTacticTechniqueFrequency;
