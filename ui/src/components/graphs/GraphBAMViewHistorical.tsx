// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState, useMemo } from 'react';
import PlotlyGraph from '../elements/PlotlyGraph';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor, getCssRGBVarColor } from '../../util/helperFunctions';
import { BamAttackResponseType } from '../../types';

type PlotDataType = {
    type: 'scatter';
    x: (number | string)[];
    y: number[];
    mode: 'lines+markers';
    name: string;
    line: { shape: 'hv' };
    marker: { color: string, colorName: string, symbol: any, size: any };
    visible: boolean | 'legendonly';
};

type Props = {
    data: BamAttackResponseType[],
    hiddenItems: number[]
};

type MarkerConfigType = {
    [key: string]: {
        color: string;
        colorName: string;
        plotlySymbol: string;
        svgPath: {
            d: string;
            fill?: string;
            stroke?: string;
            strokeWidth?: string;
        };
        svgViewBox?: string;
    };
};

const GraphBAMViewHistorical: React.FC<Props> = ({ data, hiddenItems }) => {
    const BAMGraph: BamAttackResponseType[] = useMemo(() => data.filter(t => !hiddenItems.includes(+t.StepID)), [data, hiddenItems]);
    const { theme, graphLineColor, graphFontColor } = useTheme();
    const legendDeselectedColor: string = getCssRGBVarColor('--color-neutral-rgb-400');
    const markerColorBlue: string = getCssHexVarColor('--color-graph-blue');
    const markerColorOrange: string = getCssHexVarColor('--color-graph-orange');
    const markerColorGreen: string = getCssHexVarColor('--color-graph-green');
    const markerColorRed: string = getCssHexVarColor('--color-graph-red');

    const xAxisLabel = 'Time & Adversary Behavior';
    const yAxisLabel = 'Adversary Behavior Probability';

    const [plotData, setPlotData] = useState<PlotDataType[]>([]);
    const [layout, setLayout] = useState({
        height: 400,
        showlegend: false,
        font: {
            color: graphFontColor
        },
        yaxis: {
            title: {
                text: yAxisLabel,
                standoff: 15
            },
            automargin: true,
            gridcolor: graphLineColor,
            tickmode: 'linear',
            dtick: 0.2,
            rangemode: 'tozero'
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                standoff: 15
            },
            automargin: true,
            gridcolor: graphLineColor
        },
    });

    const jitterPoints = (points: any[]) => {
        const jitterAmount = 2;
        let lastX: any = null;
        let jitterOffset = 0;

        return points.map(point => {
            if (lastX !== point.Tick) {
                lastX = point.Tick;
                jitterOffset = 0;
            } else {
                jitterOffset += jitterAmount;
            }

            return {
                ...point,
                Tick: point.Tick + jitterOffset,
            };
        });
    };

    const markerConfig: MarkerConfigType = useMemo(() => ({
        'blue': {
            color: markerColorBlue,
            colorName: 'blue',
            plotlySymbol: 'circle',
            svgPath: { d: "M-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0", fill: markerColorBlue },
        },
        'orange': {
            color: markerColorOrange,
            colorName: 'orange',
            plotlySymbol: 'square',
            svgPath: { d: "M-3,-3 L3,-3 L3,3 L-3,3 Z", fill: markerColorOrange },
        },
        'green': {
            color: markerColorGreen,
            colorName: 'green',
            plotlySymbol: 'x',
            svgPath: {
                d: "M-3,-3 L3,3 M3,-3 L-3,3",
                stroke: markerColorGreen,
                strokeWidth: "2.25"
            },
        },
        'red': {
            color: markerColorRed,
            colorName: 'red',
            plotlySymbol: 'triangle-up',
            svgPath: { d: "M-3,2 L0,-3 L3,2 Z", fill: markerColorRed },
            svgViewBox: "-3 -4 6 7"
        },
    }), [markerColorBlue, markerColorGreen, markerColorOrange, markerColorRed]);

    useEffect(() => {
        const jitteredData = jitterPoints(BAMGraph.sort((a, b) => (a.Tick - b.Tick)));

        const createTrace = (name: keyof BamAttackResponseType, markerType: keyof typeof markerConfig): PlotDataType => {
            const config = markerConfig[markerType];
            return {
                type: 'scatter',
                x: jitteredData.map(d => d.Tick),
                y: jitteredData.map(d => d[name] as number),
                mode: 'lines+markers',
                name: name as string,
                line: { shape: 'hv' },
                marker: {
                    color: config.color,
                    colorName: config.colorName,
                    symbol: config.plotlySymbol,
                    size: 9,
                },
                visible: true,
            };
        };

        const traces: PlotDataType[] = [
            createTrace('Early', 'blue'),
            createTrace('Middle', 'orange'),
            createTrace('Late', 'green'),
            createTrace('Impact', 'red'),
        ];

        setPlotData(traces);

        const uniqueTicks = Array.from(new Set(jitteredData.map(d => d.Tick)));
        const filteredJitteredData = uniqueTicks.map(tick => jitteredData.find(d => d.Tick === tick)).filter((d) => !!d);

        setLayout(prevLayout => ({
            ...prevLayout,
            xaxis: {
                ...prevLayout.xaxis,
                tickvals: filteredJitteredData.map(d => d.Tick),
                ticktext: filteredJitteredData.map(d => d["D-notation"] ? d["D-notation"].replace(/\$\\infty\$/g, '∞') : ''),
            },
        }));
    }, [BAMGraph, markerConfig]);

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
    }, [theme, graphFontColor, graphLineColor]);

    const toggleTraceVisibility = (index: number) => {
        setPlotData(currentData =>
            currentData.map((item, i) =>
                i === index ? { ...item, visible: item.visible === 'legendonly' ? true : 'legendonly' } : item
            )
        );
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-11">
                <PlotlyGraph data={plotData} layout={layout} hideLegend={true} />
            </div>
            <div className="custom-plotly-legend col-span-1 mt-12">
                {plotData.map((trace, index) => (
                    <div key={index} className="flex items-center mb-2 cursor-pointer text-sm" onClick={() => toggleTraceVisibility(index)}>
                        {trace.visible !== 'legendonly' ? (
                            <svg width="16" height="16" viewBox="-5 -5 10 10">
                                <line x1="-5" y1="0" x2="5" y2="0" stroke={trace.marker.color} strokeWidth="1.5" />
                                <path {...markerConfig[trace.marker.colorName].svgPath} />
                            </svg>
                        ) : (
                            // TODO: Change this code so that it displays the proper path symbol but the color can be configured to something like gray

                            <svg width="16" height="16" viewBox="-5 -5 10 10">
                                <line x1="-5" y1="0" x2="5" y2="0" stroke={legendDeselectedColor} strokeWidth="1.5" />
                                <path
                                    d={markerConfig[trace.marker.colorName].svgPath.d}
                                    fill={legendDeselectedColor}
                                    stroke={markerConfig[trace.marker.colorName].svgPath.stroke ? legendDeselectedColor : undefined}
                                    strokeWidth={markerConfig[trace.marker.colorName].svgPath.strokeWidth}
                                />
                            </svg>
                        )}

                        <span className='ml-2 text-sm'>{trace.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphBAMViewHistorical;
