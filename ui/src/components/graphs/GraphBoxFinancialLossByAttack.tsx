// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState } from 'react';
import PlotlyGraph from '../elements/PlotlyGraph';
import { useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { useTheme } from '../../contexts/useTheme';
import { getCssRGBVarColor } from '../../util/helperFunctions';

type Props = {
  allAttacksData: any[] | null
};

type PlotDataType = {
  type: 'box' | 'scatter';
  x: number[];
  y?: string[];
  name?: string;
  boxpoints?: 'all' | 'outliers' | 'suspectedoutliers' | false;
  jitter?: number;
  pointpos?: number;
  mode?: 'markers';
  opacity?: number,
  marker?: {
    color: string;
    size?: number;
    opacity?: number;
    line?: {
      color?: string;
      width?: number;
      opacity?: number;
    }
  };
  visible?: boolean;
  hoverinfo: string;
};

const GraphFinancialLossByAttack: React.FC<Props> = ({ allAttacksData }) => {
  const storeSelectedReport: any = useAppSelector((state: any) => state.appState.selectedReport);
  const xAxisLabel = 'Attack Name';
  const yAxisLabel = 'Financial Loss (in dollars)';

  const [plotData, setPlotData] = useState<PlotDataType[]>([]);
  const [q1Value, setQ1Value] = useState<number>(0);
  const [medianValue, setMedianValue] = useState<number>(0);
  const [q3Value, setQ3Value] = useState<number>(0);
  const [isQ1Visible, setQ1Visible] = useState(false);
  const [isMedianVisible, setMedianVisible] = useState(false);
  const [isQ3Visible, setQ3Visible] = useState(false);
  const [scaleType, setScaleType] = useState<'linear' | 'log'>('log');
  const [chartType, setChartType] = useState<'box' | 'scatter'>('box');

  const { theme, graphLineColor, graphFontColor } = useTheme();
  const markerColor: string = theme === 'dark' ? getCssRGBVarColor('--color-primary-rgb-500') : getCssRGBVarColor('--color-primary-rgb-800');
  const selectedMarkerColor: string = theme === 'dark' ? getCssRGBVarColor('--color-error-dark-rgb') : getCssRGBVarColor('--color-error-light-rgb');

  const [filteredAttacks, setFilteredAttacks] = useState<any[]>([]);
  const [missingDataRecords, setMissingDataRecords] = useState<string[]>([]); // NEW: State to track records with missing data

  const initialLayout = {
    height: 800,
    yaxis: {
      tickpadding: 20,
      title: {
        text: xAxisLabel,
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
      side: 'top',
      type: 'log',
      automargin: true,
      title: {
        text: yAxisLabel,
        standoff: 15,
        font: {
          color: graphFontColor,
        }
      },
      gridcolor: graphLineColor,
      tickfont: {
        color: graphFontColor,
      },
    },
    shapes: [],
  };

  const [layout, setLayout] = useState(initialLayout);

  const computePercentile = (data: number[], percentile: number) => {
    data.sort((a, b) => a - b);
    const index = (percentile / 100) * data.length;

    if (Number.isInteger(index)) {
      return (data[index - 1] + data[index]) / 2;
    } else {
      return data[Math.floor(index)];
    }
  };

  const toggleTraceVisibility = (traceName: string) => {
    setPlotData(prevData =>
      prevData.map(trace =>
        trace.name === traceName ? { ...trace, visible: !trace.visible } : trace
      )
    );
  };

  function titleNameRemoveAnalysis(str: string) {
    // Remove the word "Analysis" from the end if it exists
    if (str.endsWith(" Analysis")) {
        str = str.slice(0, -9);
    }

    return str;
  }

  useEffect(() => {
    if (allAttacksData && allAttacksData.length > 0) {

      // NEW: Filter out records with null minLoss or maxLoss
      const filteredData = allAttacksData.filter((attack) =>
        attack.caseStudyFinancialLoss.minLoss !== null &&
        attack.caseStudyFinancialLoss.maxLoss !== null
      );
      // NEW: Collect records with missing data
      const missingData = allAttacksData.filter((attack) =>
        attack.caseStudyFinancialLoss.minLoss === null ||
        attack.caseStudyFinancialLoss.maxLoss === null
      )
        .map((attack) => attack.caseStudyNameShort);

      setFilteredAttacks(filteredData);

      // NEW: Set the missing data records in the state
      setMissingDataRecords(missingData);

      // Sort allAttacksData based on InitialAccess date
      const sortedAttacksData = [...filteredData].sort((a, b) => { // NEW: was allAttacksData
        const dateA = new Date(a.caseStudyAttackData.dates.triggerDate);
        const dateB = new Date(b.caseStudyAttackData.dates.triggerDate);
        return dateA.getTime() - dateB.getTime();  // For descending order
      });

      const plotData: PlotDataType[] = sortedAttacksData.map((attack: any, index: number) => {
        const isSelectedReport = attack?.caseStudyNameShort === storeSelectedReport?.caseStudyNameShort;
        if (chartType === 'scatter') {
          return {
            type: 'scatter',
            x: [attack.caseStudyFinancialLoss.minLoss, attack.caseStudyFinancialLoss.maxLoss],
            y: [`${attack.caseStudyNameShort}\u00A0\u00A0`],
            name: attack.caseStudyNameShort,
            mode: 'markers',
            marker: {
              color: isSelectedReport ? selectedMarkerColor : markerColor, // Using red for selected and a faded gray for others.
              size: isSelectedReport ? 10 : 6,  // Optional: You can even make the selected point slightly bigger.
              opacity: 1,
              // line: {
              //   color: 'rgba(0,0,0,0)',
              //   width: 0,
              //   opacity: 0
              // }
            },
            visible: true,
            hoverinfo: 'x+y'
          };
        } else {
          return {
            type: 'box',
            x: [attack.caseStudyFinancialLoss.minLoss, attack.caseStudyFinancialLoss.maxLoss],
            x0: index,  // this is the position
            name: `${titleNameRemoveAnalysis(attack.caseStudyBAMParentId)}\u00A0\u00A0`, // this is the label
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,

            opacity: 1,
            marker: {
              color: isSelectedReport ? selectedMarkerColor : markerColor, // Using red for selected and a faded gray for others.
              opacity: 1,
              line: {
                color: 'rgba(0,0,0,0)',
                width: 0,
                opacity: 0,
              }
            },
            visible: true,
            hoverinfo: 'x+y'
          };
        }
      });

      const shapes: any = [];

      if (isQ1Visible) {
        shapes.push({
          type: 'line',
          yref: 'paper',
          y0: 0,
          y1: 1,
          x0: q1Value,
          x1: q1Value,
          line: {
            color: 'blue',
            width: 2,
            opacity: 0.01
          }
        });
      }

      if (isMedianVisible) {
        shapes.push({
          type: 'line',
          yref: 'paper',
          y0: 0,
          y1: 1,
          x0: medianValue,
          x1: medianValue,
          line: {
            color: 'green',
            width: 2,
            opacity: 0.2
          }
        });
      }

      if (isQ3Visible) {
        shapes.push({
          type: 'line',
          yref: 'paper',
          y0: 0,
          y1: 1,
          x0: q3Value,
          x1: q3Value,
          line: {
            color: 'red',
            width: 2,
            opacity: 0.2
          }
        });
      }

      setLayout(prevLayout => ({
        ...prevLayout,
        shapes: shapes
      }));
      setPlotData(plotData);
    }
  }, [allAttacksData, q1Value, medianValue, q3Value, isQ1Visible, isMedianVisible, isQ3Visible, chartType, storeSelectedReport?.caseStudyNameShort, markerColor, selectedMarkerColor]);


  useEffect(() => {
    const attackData = filteredAttacks?.flatMap(attack => [Number(attack.caseStudyFinancialLoss.minLoss), Number(attack.caseStudyFinancialLoss.maxLoss)]);

    if (attackData?.every(value => typeof value === 'number' && !isNaN(value))) {
      const computedQ1 = computePercentile(attackData, 25);
      const computedMedian = computePercentile(attackData, 50);
      const computedQ3 = computePercentile(attackData, 75);

      setQ1Value(computedQ1);
      setMedianValue(computedMedian);
      setQ3Value(computedQ3);
    }
  }, [filteredAttacks]);


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
          color: graphFontColor, // Change the color here
        },
      },
    }));
  }, [theme, graphFontColor, graphLineColor]);

  useEffect(() => {
    setLayout(prevLayout => ({
      ...prevLayout,
      xaxis: {
        ...prevLayout.xaxis,
        type: scaleType
      }
    }));
  }, [scaleType]);

  // NEW: Function to render records with missing data
  const renderMissingDataRecords = () => {
    return missingDataRecords.map((record, index) => (
      <span key={index} className="badge badge-accent m-1 text-xs">{record}</span>
    ));
  };

  return (
    <>
      <div className="flex space-x-4 ">
        <div className={'inline-flex align-middle text-xs text-neutralc-900 bg-neutralc-300 dark:text-neutralc-200 dark:bg-neutralc-800 rounded-lg overflow-hidden'}>
          <span className="px-3 py-2">Chart Type</span>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'box' | 'scatter')}
            className="select rounded-none focus:outline-none font-normal dark:bg-neutralc-500 select-sm text-xs overflow-hidden"
          >
            <option value="box">Box Plot</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>

        <div className={'inline-flex align-middle text-xs bg-neutralc-300 dark:bg-neutralc-800 rounded-lg overflow-hidden'}>
          <span className="px-3 py-2">
            Scale
          </span>
          <select
            value={scaleType}
            onChange={(e) => setScaleType(e.target.value as 'linear' | 'log')}
            className="select rounded-none focus:outline-none font-normal dark:bg-neutralc-500 select-sm text-xs overflow-hidden"
          >
            <option value="log">Logarithmic</option>
            <option value="linear">Linear</option>
          </select>
        </div>

        <div className="flex items-center bg-neutralc-300 text-xs dark:bg-neutralc-800 rounded-lg overflow-hidden">
          <div className="px-3">Annotation Legend (Toggle)</div>
          <div className="bg-neutralc-100 dark:bg-neutralc-500 px-3 flex h-full space-x-4">
            <div className="flex items-center" onClick={() => setQ1Visible(!isQ1Visible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer  dark:bg-neutralc-600 ${isQ1Visible ? 'bg-neutralc-200 dark:bg-neutralc-700' : ''}`}>
                <div style={{ background: 'blue', height: '2px', width: '20px' }}></div>
              </div>
              <div>25th percentile</div>
            </div>
            <div className="flex items-center" onClick={() => setMedianVisible(!isMedianVisible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer dark:bg-neutralc-600 ${isMedianVisible ? 'bg-neutralc-200 dark:bg-neutralc-700' : ''}`}>
                <div style={{ background: 'green', height: '2px', width: '20px' }}></div>
              </div>
              <div>Median</div>
            </div>
            <div className="flex items-center" onClick={() => setQ3Visible(!isQ3Visible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer dark:bg-neutralc-600 ${isQ3Visible ? 'bg-neutralc-200 dark:bg-neutralc-700' : ''}`}>
                <div style={{ background: 'red', height: '2px', width: '20px' }}></div>
              </div>
              <div>75th percentile</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 pt-4">
        <div className="col-span-10">
          <PlotlyGraph
            data={plotData.map((trace: any) => ({ ...trace, showlegend: false, visible: trace.visible ? 'true' : 'legendonly' }))}
            layout={layout}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
          />
        </div>

        <div className="col-span-2 mt-12">
          {[...plotData].reverse().map((trace: any) => (
            <div className="flex items-center" key={trace.name} onClick={() => toggleTraceVisibility(trace.name)}>
              <span className="material-icons !text-sm mr-3 cursor-pointer">
                {trace.visible ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span className='text-sm'>
                {trace.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Rendering the list of records with missing data */}
      {missingDataRecords.length > 0 && (
        <div className="w-full mb-6 p-2 ">
          <h3 className="font-semibold text-sm">Attacks not displayed due to incomplete data:</h3>
          <span className="flex flex-wrap">{renderMissingDataRecords()}</span>
        </div>
      )}
    </>
  );
}

export default GraphFinancialLossByAttack;