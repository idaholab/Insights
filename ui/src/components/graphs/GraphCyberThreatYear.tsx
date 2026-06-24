// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor } from '../../util/helperFunctions';
import PlotlyGraph from '../elements/PlotlyGraph';

interface Props {
    data: any[] | undefined;
}

const GraphCyberThreatYear: React.FC<Props> = ({ data }) => {
    const [plotData, setPlotData] = useState<any>(null);
    const [ransomwareVisible, setRansomwareVisible] = useState(true);
    const [nonRansomwareVisible, setNonRansomwareVisible] = useState(true);
    const { theme, graphLineColor, graphFontColor } = useTheme();

    const markerColorOrange: string = theme === 'dark' ? getCssHexVarColor('--color-graph-light-orange') : getCssHexVarColor('--color-graph-orange');
    const markerColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-light-blue') : getCssHexVarColor('--color-graph-blue');

    function titleNameRemoveAnalysis(str: string) {
        // Remove the word "Analysis" from the end if it exists
        if (str.endsWith(" Analysis")) {
            str = str.slice(0, -9);
        }
    
        return str;
    }

    useEffect(() => {
        if (data && data.length > 0) {
            const sortedData = [...data].sort((a, b) => {
                const dateA = new Date(a.caseStudyAttackData.dates.triggerDate);
                const dateB = new Date(b.caseStudyAttackData.dates.triggerDate);
                return dateA.getTime() - dateB.getTime(); // For ascending order
            });

            const plotPoints = sortedData.map(d => ({
                x: d.caseStudyAttackData.dates.triggerYear,
                y: titleNameRemoveAnalysis(d.caseStudyBAMParentId),
                isRansomware: d.caseStudyAttackData.ransomware
            }));

            const colors = plotPoints.map(d => {
                if (d.isRansomware && ransomwareVisible) {
                    return markerColorOrange;
                } else if (!d.isRansomware && nonRansomwareVisible) {
                    return markerColorBlue;
                } else {
                    return 'rgba(0,0,0,0)'; // Transparent color for hidden points
                }
            });

            const newData = [
                {
                    x: plotPoints.map(d => d.x),
                    y: plotPoints.map(d => d.y),
                    mode: 'markers',
                    type: 'scatter',
                    name: 'All Attacks',
                    marker: {
                        color: colors,
                        size: 8
                    },
                    hoverinfo: 'x+y'
                }
            ];

            setPlotData(newData);
        }
    }, [data, theme, ransomwareVisible, nonRansomwareVisible]);

    const [layout, setLayout] = useState({
        barmode: 'group',
        layout: {
            font: {
                color: graphFontColor
            }
        },
        yaxis: {
            title: {
                text: "Case Study",
                standoff: 15
            },
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        xaxis: {
            title: {
                text: "Year",
                standoff: 15
            },
            side: 'top',
            automargin: true,
            showgrid: true,
            gridcolor: graphLineColor,
        },
        height: 800
    });

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

    const toggleVisibility = (type: 'ransomware' | 'nonRansomware') => {
        if (type === 'ransomware') {
            setRansomwareVisible(!ransomwareVisible);
        } else {
            setNonRansomwareVisible(!nonRansomwareVisible);
        }
    };

    const renderCustomLegend = () => (
        <>
            <div className="flex items-center" onClick={() => toggleVisibility('ransomware')}>
                {ransomwareVisible ?
                    <span className="material-icons !text-sm mr-3 cursor-pointer" style={{ color: markerColorOrange }}>
                        circle
                    </span>
                    :
                    <span className="material-icons !text-sm mr-3 cursor-pointer text-neutralc-600 dark:text-neutralc-300 ">
                        radio_button_unchecked
                    </span>
                }
                <span className='text-sm'>Ransomware</span>
            </div>

            <div className="flex items-center" onClick={() => toggleVisibility('nonRansomware')}>
                {nonRansomwareVisible ?
                    <span className="material-icons !text-sm mr-3 cursor-pointer" style={{ color: markerColorBlue }}>
                        circle
                    </span>
                    :
                    <span className="material-icons !text-sm mr-3 cursor-pointer text-neutralc-600 dark:text-neutralc-300">
                        radio_button_unchecked
                    </span>
                }
                <span className='text-sm'>Non-Ransomware</span>
            </div>
        </>
    );
    return (
        <div className="grid grid-cols-12 gap-4 pt-4">
            <div className="col-span-10">
                {plotData && (
                    <PlotlyGraph
                        data={plotData}
                        layout={layout}
                        hideLegend={true}
                    />
                )}
            </div>
            <div className="col-span-2 mt-10">
                {renderCustomLegend()}
            </div>
        </div>
    );
}

export default GraphCyberThreatYear;
