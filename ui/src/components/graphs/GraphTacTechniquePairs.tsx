// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import PlotlyGraph from '../elements/PlotlyGraph';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor } from '../../util/helperFunctions';
import { TacticTechniqueCountsResponse } from '../../types';

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

const BarGraphTopTechniquePairs: React.FC<Props> = ({ chartData }) => {
    const { theme, graphLineColor, graphFontColor } = useTheme();
    let markerColorOrange: string = theme === 'dark' ? getCssHexVarColor('--color-graph-light-orange') : getCssHexVarColor('--color-graph-orange');

    const [plotData, setPlotData] = useState<PlotDataType[]>([]);
    const [showTraceCount, setShowTraceCount] = useState<number>(5);
    const xAxisLabel = 'Technique';
    const yAxisLabel = 'Count';
    const initialLayout = {
        xaxis: {
            title: {
                text: yAxisLabel,
                standoff: 15
            },
            side: 'top',
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        yaxis: {
            title: {
                text: xAxisLabel,
                standoff: 15
            },
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        shapes: [],
        barmode: 'group',
        height: 300,
    };
    const [layout, setLayout] = useState(initialLayout);

    useEffect(() => {
        if (chartData && chartData.length > 0) {
            let reversedData = [...chartData].reverse();
            let top5 = reversedData.slice(-5);
            const tmpPlotData: PlotDataType[] = reversedData.map((record: TacticTechniqueCountsResponse) => {
                return {
                    name: record.tactic + ': ' + record.technique,
                    x: [record.count],
                    y: [record.tactic + ': ' + record.technique + '     '],
                    type: 'bar',
                    orientation: 'h',
                    marker: {
                        color: markerColorOrange, // Blue
                        opacity: 1
                    },
                    hoverinfo: 'x',
                    visible: (top5.some(x => x.technique === record.technique)) ? true : false
                }
            });
            setPlotData(tmpPlotData);

            setLayout(prevLayout => ({
                ...prevLayout
            }));
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

    // Record visibility toggle
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
                {[...plotData].reverse().map((trace: any, index: number) => (
                    index < showTraceCount &&
                    <div className="flex items-center" key={trace.name} onClick={() => toggleTraceVisibility(trace.name)}>
                        <span className="material-icons !text-sm mr-3 cursor-pointer text-neutralc-600 hover:text-neutralc-950 dark:text-neutralc-300 dark:hover:text-neutralc-50 ">
                            {trace.visible ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className='text-sm'>
                            {trace.name}
                        </span>
                    </div>
                ))}
                <div className='flex justify-between mt-4'>
                    {plotData.length > showTraceCount &&
                        <div className='flex cursor-pointer text-primary-600 hover:text-primary-950 dark:text-primary-300 dark:hover:text-primary-50 hover:underline' style={{ fontSize: '12px' }} onClick={() => setShowTraceCount(showTraceCount + 5)}>
                            <span>Show More</span>
                        </div>
                    }
                    {showTraceCount > 5 &&
                        <div className='flex cursor-pointer text-primary-600 hover:text-primary-950 dark:text-primary-300 dark:hover:text-primary-50 hover:underline' style={{ fontSize: '12px' }} onClick={() => setShowTraceCount(showTraceCount - 5)}>
                            <span>Show Less</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};
export default BarGraphTopTechniquePairs;






