// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import React, { useEffect, useMemo, useState } from 'react';

// Hooks
import { useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';

// Plugins
import isEqual from 'lodash.isequal';
import { useTheme } from '../../contexts/useTheme';
import { getCssHexVarColor } from '../../util/helperFunctions';
import PlotlyGraph from '../elements/PlotlyGraph';

type Props = {
  allAttacksData: any,
  barsAreOpaque: boolean
};

type PlotDataType = {
  type: string;
  x: number[];
  y?: string[];
  name?: string;
  boxpoints?: 'all' | 'outliers' | 'suspectedoutliers' | false;
  jitter?: number;
  pointpos?: number;
  mode?: 'markers';
  marker?: {
    color: string;
    size?: number;
    opacity?: number;
  };
  visible?: boolean;
};

const GraphLengthOfAttackByAttack: React.FC<Props> = ({ allAttacksData, barsAreOpaque }) => {
  const storeSelectedReport: any = useAppSelector((state: any) => state.appState.selectedReport);

  const { theme, graphLineColor, graphFontColor } = useTheme();

  let markerColorRed: string = theme === 'dark' ? getCssHexVarColor('--color-graph-red') : getCssHexVarColor('--color-graph-red');
  let markerColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-blue') : getCssHexVarColor('--color-graph-blue');
  let thresholdColorBlue: string = theme === 'dark' ? getCssHexVarColor('--color-graph-blue') : getCssHexVarColor('--color-graph-blue');
  let thresholdColorGreen: string = theme === 'dark' ? getCssHexVarColor('--color-graph-green') : getCssHexVarColor('--color-graph-green');
  let thresholdColorRed: string = theme === 'dark' ? getCssHexVarColor('--color-graph-red') : getCssHexVarColor('--color-graph-red');

  const xAxisLabel = `Attack Name`;
  const yAxisLabel = `Length of Attack`;
  const [plotData, setPlotData] = useState<PlotDataType[]>([]);
  const [sortedAttacks, setSortedAttacks] = useState<any[]>([]);
  const [avgTotalTime, setAvgTotalTime] = useState<number>(0);
  const [meanTimeToTrigger, setMeanTimeToTrigger] = useState<number>(0);
  const [meanTimeToRecovery, setMeanTimeToRecovery] = useState<number>(0);
  const [isAvgTotalTimeVisible, setAvgTotalTimeVisible] = useState(false);
  const [isMeanTimeToTriggerVisible, setMeanTimeToTriggerVisible] = useState(false);
  const [isMeanTimeToRecoveryVisible, setMeanTimeToRecoveryVisible] = useState(false);

  const [traceVisibility, setTraceVisibility] = useState<Record<string, boolean>>({});
  const uniqueAttacks = Array.from(new Set(plotData.map(trace => trace.name)));
  const [isPrecursorVisible, setIsPrecursorVisible] = useState(true);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(true);

  const [missingDataRecords, setMissingDataRecords] = useState<string[]>([]); // NEW: State to track records with missing data

  function titleNameRemoveAnalysis(str: string) {
    // Remove the word "Analysis" from the end if it exists
    if (str.endsWith(" Analysis")) {
        str = str.slice(0, -9);
    }

    return str;
  }

  useEffect(() => {
    if (sortedAttacks && sortedAttacks.length > 0) {
      // Assuming that DurationInDays.Precursor and DurationInDays.Recovery are the relevant times
      const totalTime = sortedAttacks?.reduce((acc, curr) => acc + curr.caseStudyAttackData.durations.precursor + curr.caseStudyAttackData.durations.recovery, 0);
      const timeToTrigger = sortedAttacks?.reduce((acc, curr) => acc + curr.caseStudyAttackData.durations.precursor, 0);
      const timeToRecovery = sortedAttacks?.reduce((acc, curr) => acc + curr.caseStudyAttackData.durations.recovery, 0);

      setAvgTotalTime(totalTime / sortedAttacks?.length);
      setMeanTimeToTrigger(timeToTrigger / sortedAttacks?.length);
      setMeanTimeToRecovery(timeToRecovery / sortedAttacks?.length);
    }
  }, [sortedAttacks]);

  useEffect(() => {
    if (sortedAttacks && sortedAttacks.length > 0) {
      const visibility: Record<string, boolean> = {};
      sortedAttacks.forEach((attack: any) => {
        visibility[attack.caseStudyNameShort] = true;
      });
      setTraceVisibility(visibility);
    }
  }, [sortedAttacks]);

  useEffect(() => {
    if (allAttacksData && allAttacksData.length > 0) {
      // NEW: Filter out records with null minLoss or maxLoss
      const filteredData = allAttacksData.filter((attack: any) =>
        attack.caseStudyAttackData?.dates?.triggerDate !== null &&
        attack.caseStudyAttackData?.dates?.triggerDate !== undefined
      );
      // NEW: Collect records with missing data
      const missingData = allAttacksData.filter((attack: any) =>
        attack.caseStudyAttackData?.dates?.triggerDate === null ||
        attack.caseStudyAttackData?.dates?.triggerDate === undefined
      ).map((attack: any) => titleNameRemoveAnalysis(attack.caseStudyBAMParentId));

      // NEW: Set the missing data records in the state
      setMissingDataRecords(missingData);

      const sorted = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.caseStudyAttackData?.dates?.triggerDate);
        const dateB = new Date(b.caseStudyAttackData?.dates?.triggerDate);
        return dateA.getTime() - dateB.getTime();  // For descending order
      });
      setSortedAttacks(sorted);
    }
  }, [allAttacksData]);

  useEffect(() => {
    if (sortedAttacks && sortedAttacks.length > 0) {
      const data = sortedAttacks.map((attack: any) => {
        const shouldFade = (barsAreOpaque) ? false : attack.caseStudyNameShort !== storeSelectedReport.caseStudyNameShort; // Check if the current attack's ReportName matches the storeSelectedReport's ReportName
        const precursorVisible = traceVisibility[attack.caseStudyNameShort] && isPrecursorVisible;
        const recoveryVisible = traceVisibility[attack.caseStudyNameShort] && isRecoveryVisible;
        return [
          {
            x: [attack.caseStudyAttackData.durations.precursor], // Swap x and y
            y: [`${titleNameRemoveAnalysis(attack.caseStudyBAMParentId)}\u00A0\u00A0`],
            name: titleNameRemoveAnalysis(attack.caseStudyBAMParentId),
            type: 'bar',
            orientation: 'h',  // Set orientation to horizontal
            marker: { color: markerColorBlue },  // Color for Precursor
            visible: precursorVisible,
            opacity: shouldFade ? 0.5 : 1
          },
          {
            x: [attack.caseStudyAttackData.durations.recovery], // Swap x and y
            y: [`${titleNameRemoveAnalysis(attack.caseStudyBAMParentId)}\u00A0\u00A0`],
            name: titleNameRemoveAnalysis(attack.caseStudyBAMParentId),
            type: 'bar',
            orientation: 'h',  // Set orientation to horizontal
            marker: { color: markerColorRed },  // Color for Recovery
            visible: recoveryVisible,
            opacity: shouldFade ? 0.5 : 1
          }
        ];
      }).flat();
      setPlotData(data);
    }
  }, [sortedAttacks, storeSelectedReport?.caseStudyNameShort, barsAreOpaque, isPrecursorVisible, isRecoveryVisible, traceVisibility]);

  const shapes = useMemo(() => {
    const newShapes: any = [];
    if (isAvgTotalTimeVisible) {
      newShapes.push({
        type: 'line',
        x0: avgTotalTime,
        y0: 0,
        x1: avgTotalTime,
        y1: sortedAttacks?.length,
        line: {
          color: thresholdColorBlue,
          width: 2,
        }
      });
    }
    if (isMeanTimeToTriggerVisible) {
      newShapes.push({
        type: 'line',
        x0: meanTimeToTrigger,
        y0: 0,
        x1: meanTimeToTrigger,
        y1: sortedAttacks?.length,
        line: {
          color: thresholdColorGreen,
          width: 2,
        }
      });
    }
    if (isMeanTimeToRecoveryVisible) {
      newShapes.push({
        type: 'line',
        x0: meanTimeToRecovery,
        y0: 0,
        x1: meanTimeToRecovery,
        y1: sortedAttacks?.length,
        line: {
          color: thresholdColorRed,
          width: 2,
        }
      });
    }

    return newShapes;
  }, [isAvgTotalTimeVisible, isMeanTimeToTriggerVisible, isMeanTimeToRecoveryVisible, avgTotalTime, meanTimeToTrigger, meanTimeToRecovery, sortedAttacks?.length]);


  const [layout, setLayout] = useState({
    height: 800,
    barmode: 'stack',
    yaxis: {
      title: {
        text: xAxisLabel,
        standoff: 15
      },
      automargin: true,
      gridcolor: graphLineColor
    },
    xaxis: {
      side: 'top',
      automargin: true,
      title: {
        text: yAxisLabel,
        standoff: 15
      },
      gridcolor: graphLineColor
    },
    shapes: shapes,
  });

  useEffect(() => {
    if (!isEqual(layout.shapes, shapes)) {
      setLayout(prevLayout => ({ ...prevLayout, shapes: shapes }));
    }
  }, [shapes, layout.shapes]);

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

  const toggleTraceVisibility = (traceName: string) => {
    setTraceVisibility(prevVisibility => ({
      ...prevVisibility,
      [traceName]: !prevVisibility[traceName]
    }));
  };

  const togglePrecursorVisibility = () => {
    setIsPrecursorVisible(prev => !prev);
  };

  const toggleRecoveryVisibility = () => {
    setIsRecoveryVisible(prev => !prev);
  };

  // NEW: Function to render records with missing data
  const renderMissingDataRecords = () => {
    return missingDataRecords.map((record, index) => (
      <span key={index} className="badge badge-accent m-1 text-xs">{record}</span>
    ));
  };

  return (
    <>
      <div className="flex space-x-4">
        <div className="flex items-center text-xs bg-neutralc-300 dark:bg-neutralc-800 rounded-lg overflow-hidden">
          <div className="py-2 px-3">Annotation Legend (Toggle)</div>
          <div className="bg-neutralc-100 dark:bg-neutralc-500 px-3 flex h-full space-x-4">

            {/* Precursor Toggle */}
            <div className="flex items-center relative" onClick={togglePrecursorVisibility}>
              <div className={`p-1.5 mr-2 rounded cursor-pointer  ${isPrecursorVisible ? 'bg-neutralc-200 dark:bg-neutralc-800' : 'bg-neutralc-400 dark:bg-neutralc-600'}`}>
                <div style={{ background: markerColorBlue, height: '10px', width: '20px' }}></div>
              </div>
              <div>Precursor Days</div>
            </div>

            {/* Recovery Toggle */}
            <div className="flex items-center relative overflow-visible" onClick={toggleRecoveryVisibility}>
              <div className={`p-1.5 mr-2 rounded cursor-pointer  ${isRecoveryVisible ? 'bg-neutralc-200 dark:bg-neutralc-800' : 'bg-neutralc-400 dark:bg-neutralc-600'}`}>
                <div style={{ background: markerColorRed, height: '10px', width: '20px' }}></div>
              </div>
              <div>Recovery Days</div>
            </div>
          </div>
        </div>

        <div className="flex items-center text-xs bg-neutralc-300 dark:bg-neutralc-800 rounded-lg overflow-hidden">
          <div className="px-3">Averages (Toggle)</div>
          <div className="bg-neutralc-100 dark:bg-neutralc-500 px-3 flex h-full space-x-4">
            <div className="flex items-center" onClick={() => setAvgTotalTimeVisible(!isAvgTotalTimeVisible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer bg-neutralc-200 dark:bg-neutralc-600 ${isAvgTotalTimeVisible ? 'bg-neutralc-400 dark:bg-neutralc-800' : ''}`}>
                <div style={{ background: thresholdColorBlue, height: '2px', width: '20px' }}></div>
              </div>
              <div>Mean Total Time</div>
            </div>
            <div className="flex items-center" onClick={() => setMeanTimeToTriggerVisible(!isMeanTimeToTriggerVisible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer bg-neutralc-200 dark:bg-neutralc-600 ${isMeanTimeToTriggerVisible ? 'bg-neutralc-400 dark:bg-neutralc-800' : ''}`}>
                <div style={{ background: thresholdColorGreen, height: '2px', width: '20px' }}></div>
              </div>
              <div>Mean Time to Trigger</div>
            </div>
            <div className="flex items-center" onClick={() => setMeanTimeToRecoveryVisible(!isMeanTimeToRecoveryVisible)}>
              <div className={`p-2 mr-2 rounded cursor-pointer bg-neutralc-200 dark:bg-neutralc-600 ${isMeanTimeToRecoveryVisible ? 'bg-neutralc-400 dark:bg-neutralc-800' : ''}`}>
                <div style={{ background: thresholdColorRed, height: '2px', width: '20px' }}></div>
              </div>
              <div>Mean Time to Recovery</div>
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
          {uniqueAttacks.filter((attackName): attackName is string => attackName !== undefined).reverse().map((attackName) => {
            const isVisible = plotData.find(trace => trace.name === attackName && trace.visible)?.visible || false;
            return (
              <div className="flex items-center" key={attackName} onClick={() => toggleTraceVisibility(attackName)}>
                <span className="material-icons !text-sm mr-3 cursor-pointer">
                  {isVisible ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span className='text-sm'>
                  {attackName}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {/* Rendering the list of records with missing data */}
      {missingDataRecords.length > 0 && (
        <div className="w-full mb-6 p-4 shadow-lg">
          <h3 className="font-semibold text-sm">Attacks not displayed due to incomplete data:</h3>
          <span className="flex flex-wrap">{renderMissingDataRecords()}</span>
        </div>
      )}
    </>
  );
}

export default GraphLengthOfAttackByAttack;
