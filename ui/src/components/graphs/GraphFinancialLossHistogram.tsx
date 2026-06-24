// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import PlotlyGraph from '../elements/PlotlyGraph';
import { FinancialLossHistogramData } from '../../types';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor } from '../../util/helperFunctions';

type PlotDataType = {
  type: 'bar' | 'scatter';
  histnorm?: 'percent' | 'probability' | 'density' | 'probability density';
  x: number[] | null | undefined;
  y: number[] | null | undefined;
  name?: string;
  boxpoints?: 'all' | 'outliers' | 'suspectedoutliers' | false;
  jitter?: number;
  pointpos?: number;
  mode?: 'markers' | 'lines';
  marker?: {
    color: string;
    size?: number;
    opacity?: number;
  };
  line?: {
    color: string;
    width?: number;
  };
  visible?: boolean;
  yaxis?: string;
};

type Props = {
  financialLossHistogramData: FinancialLossHistogramData | null
};

const GraphFinancialLossHistogram: React.FC<Props> = ({ financialLossHistogramData }) => {
  const yAxisLabel = 'Count';
  const xAxisLabel = 'Millions ($)';

  const [plotData, setPlotData] = useState<PlotDataType[]>([]);
  const [midpoints, setMidpoints] = useState<number[]>([]);

  const { theme, graphLineColor, graphFontColor } = useTheme();

  let markerColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-blue') : getCssHexVarColor('--color-graph-blue');
  let markerColorRed: string = theme === 'dark' ? getCssHexVarColor('--color-graph-red') : getCssHexVarColor('--color-graph-red');
  let markerColorGreen: string = theme === 'dark' ? getCssHexVarColor('--color-graph-green') : getCssHexVarColor('--color-graph-green');
  let markerColorOrange: string = theme === 'dark' ? getCssHexVarColor('--color-graph-orange') : getCssHexVarColor('--color-graph-orange');

  const initialLayout = {
    height: 650,
    bargap: 0,
    barmode: 'group',
    yaxis: {
      tickpadding: 20,
      title: {
        text: yAxisLabel,
        standoff: 15,
        font: {
          color: graphFontColor,
        }
      },
      automargin: true,
      gridcolor: graphLineColor,
      tickfont: {
        color: graphFontColor,
      },
    },
    xaxis: {
      automargin: true,
      title: {
        text: xAxisLabel,
        standoff: 15,
        font: {
          color: graphFontColor,
        }
      },
      tickvals: financialLossHistogramData?.hist?.bin_edges_shared,
      ticktext: financialLossHistogramData?.hist?.bin_edges_shared?.map(value => `$${Math.round(value).toLocaleString()}`),
      gridcolor: graphLineColor,
      tickfont: {
        color: graphFontColor,
      },
    },

    yaxis2: {
      showgrid: false,
      showline: false,
      showticklabels: false,
      zeroline: false,
      overlaying: 'y',
    },
  };


  const [layout, setLayout] = useState(() => initialLayout);

  const toggleTraceVisibility = (traceName: string) => {
    setPlotData((prevData) =>
      prevData.map((trace) =>
        trace.name === traceName ? { ...trace, visible: !trace.visible } : trace,
      ),
    );
  };

  useEffect(() => {
    if (financialLossHistogramData !== null) {
      const getMidpoints = (binEdges: any) => {
        const midpoints = [];
        for (let i = 0; i < binEdges.length - 1; i++) {
          midpoints.push((binEdges[i] + binEdges[i + 1]) / 2);
        }
        return midpoints;
      }
      const calculatedMidpoints = getMidpoints(financialLossHistogramData?.hist?.bin_edges_shared);
      setMidpoints(calculatedMidpoints);
    }
  }, [financialLossHistogramData]);

  useEffect(() => {
    if (midpoints && midpoints.length) {

      const countsMaxData: PlotDataType = {
        type: 'bar',
        marker: {
          color: markerColorBlue
        },
        x: midpoints,
        y: financialLossHistogramData?.hist?.counts_max,
        name: 'Counts Max',
        visible: true,
      };

      const countsMinData: PlotDataType = {
        type: 'bar',
        marker: {
          color: markerColorRed
        },
        x: midpoints,
        y: financialLossHistogramData?.hist?.counts_min,
        name: 'Counts Min',
        visible: true,
      };

      const kdeMaxData: PlotDataType = {
        type: 'scatter',
        mode: 'lines',
        x: financialLossHistogramData?.kde?.x_shared,
        y: financialLossHistogramData?.kde?.kde_max,
        name: 'KDE Max',
        line: {
          color: markerColorGreen,
          width: 2,
        },
        visible: true,
        yaxis: 'y2',
      };

      const kdeMinData: PlotDataType = {
        type: 'scatter',
        mode: 'lines',
        x: financialLossHistogramData?.kde?.x_shared,
        y: financialLossHistogramData?.kde?.kde_min,
        name: 'KDE Min',
        line: {
          color: markerColorOrange,
          width: 2,
        },
        visible: true,
        yaxis: 'y2',
      };
      setPlotData([countsMaxData, countsMinData, kdeMaxData, kdeMinData]);
    }
  }, [midpoints, financialLossHistogramData?.hist?.counts_max, financialLossHistogramData?.hist?.counts_min, financialLossHistogramData?.kde?.kde_max, financialLossHistogramData?.kde?.kde_min, financialLossHistogramData?.kde?.x_shared]);

  useEffect(() => {
    if (midpoints && midpoints.length) {
      setLayout(prevLayout => {
        const currentTickvals = prevLayout.xaxis.tickvals;
        if (JSON.stringify(currentTickvals) !== JSON.stringify(midpoints)) {
          return {
            ...prevLayout,
            height: 650,
            xaxis: {
              ...prevLayout.xaxis,
              tickvals: financialLossHistogramData?.hist?.bin_edges_shared,
              ticktext: financialLossHistogramData?.hist?.bin_edges_shared.map(value => `$${Math.round(value).toLocaleString()}`),
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
          };
        }
        return prevLayout;
      });
    }
  }, [midpoints, financialLossHistogramData?.hist?.bin_edges_shared, theme]);

  return (
    <>
      <div className="grid grid-cols-12 gap-4 pt-4">
        <div className="col-span-10">
          <PlotlyGraph
            data={plotData.map((trace: any) => ({
              ...trace,
              showlegend: false,
              visible: trace.visible ? true : 'legendonly',
            }))}
            layout={layout}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
          />
        </div>

        <div className="col-span-2 mt-12">
          {[...plotData].map((trace: any) => (
            <div className="flex items-center" key={trace.name} onClick={() => toggleTraceVisibility(trace.name)}>
              <span className="material-icons !text-sm mr-3 cursor-pointer" style={{
                color: trace.visible ?
                  (trace.name === 'Counts Min' ? markerColorRed :
                    trace.name === 'Counts Max' ? markerColorBlue :
                      trace.type === 'scatter' ? trace.line?.color :
                        'transparent')
                  : 'text-neutralc-900 dark:text-neutralc-100'
              }}>
                {trace.visible ? 'square' : 'check_box_outline_blank'}
              </span>
              <span className='text-sm'>
                {trace.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GraphFinancialLossHistogram;
