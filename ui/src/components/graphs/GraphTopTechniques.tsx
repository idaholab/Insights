// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/useTheme';
import { TacticTechniqueCountsResponse } from '../../types';
import { getCssHexVarColor } from '../../util/helperFunctions';
import PlotlyGraph from '../elements/PlotlyGraph';

interface Props {
    chartData: TacticTechniqueCountsResponse[] | undefined;
}

type PlotDataType = {
    name?: string;
    x: number[] | undefined;
    y?: string[] | undefined;
    type: 'bar';
    orientation: 'h' | 'v';
    marker?: {
        color: string;
        opacity?: number;
    };
    hoverinfo: string;
    visible?: boolean | "legendonly";
};

const BarGraphTopTechniques: React.FC<Props> = ({ chartData }) => {
    const { theme, graphLineColor, graphFontColor } = useTheme();

    let markerColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-blue') : getCssHexVarColor('--color-graph-blue');

    const [plotData, setPlotData] = useState<PlotDataType[]>([]);
    const xAxisLabel = 'Technique';
    const yAxisLabel = 'Count';

    const initialLayout = {
        xaxis: {
            title: {
                text: yAxisLabel,
                standoff: 15,
                color: graphFontColor,
            },
            side: 'top',
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        yaxis: {
            title: {
                text: xAxisLabel,
                standoff: 15,
                color: graphFontColor,
            },

            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        shapes: [],
        barmode: 'group',
        height: 300,
        legend: false
    };
    const [layout, setLayout] = useState(initialLayout);

    // Update Graph with Data
    useEffect(() => {
        if (chartData && chartData.length > 0) {
            let top5 = chartData.slice(-5);
            const tmpPlotData: PlotDataType[] = chartData.map((record: TacticTechniqueCountsResponse) => {
                return {
                    name: record.technique,
                    x: [record.count],
                    y: [record.technique + '     '],
                    type: 'bar',
                    orientation: 'h',
                    marker: {
                        color: markerColorBlue, // Blue
                        opacity: 1
                    },
                    hoverinfo: 'x',
                    visible: (top5.some(x => x.technique === record.technique)) ? true : false
                }
            });
            setLayout(prevLayout => ({
                ...prevLayout
            }));
            setPlotData(tmpPlotData);
        }
    }, [chartData]);

    // Graph height calculation
    useEffect(() => {
        if (plotData && plotData.length > 0) {
            let count = plotData.filter(record => record.visible === true).length;
            setLayout(prevLayout => ({
                ...prevLayout,
                height: count * 60,
            }));
        }
    }, [plotData]);

    const toggleTraceVisibility = (traceName: string) => {
        setPlotData(prevData =>
            prevData.map(trace =>
                trace.name === traceName ? { ...trace, visible: !trace.visible } : trace
            )
        );
    };

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
        }));
    }, [theme]);

    return (
        <div className="grid grid-cols-12 gap-4 pt-4">
            <div className="col-span-10">
                <PlotlyGraph
                    data={plotData.map((trace: any) => ({ ...trace, showlegend: false, visible: trace.visible ? 'true' : 'legendonly' }))}
                    layout={layout}
                    xAxisLabel={xAxisLabel}
                    yAxisLabel={yAxisLabel}
                />
            </div>
            <div className="col-span-2">
                {[...plotData].reverse().map((trace: any) => (
                    <div className="flex items-center cursor-pointer text-neutralc-600 hover:text-black dark:text-neutralc-300 dark:hover:text-white" key={trace.name} onClick={() => toggleTraceVisibility(trace.name)}>
                        <span className="material-icons !text-base mr-2 ">
                            {trace.visible ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className='text-sm'>
                            {trace.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
};
export default BarGraphTopTechniques;