// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import Plot from 'react-plotly.js';

type Props = {
  data: any[];
  layout: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xPadding?: number;
  yPadding?: number;
  hideTitle?: boolean;
  hideLegend?: boolean;
  yAxisStandoff?: number;
};

const PlotlyGraph: React.FC<Props> = ({
  data,
  layout,
  xAxisLabel,
  yAxisLabel,
  xPadding = 20,
  yPadding = 70,
  hideTitle = false,
  hideLegend = false,
  yAxisStandoff
}) => {

  const combinedLayout = React.useMemo(() => ({
    ...layout,
    autosize: true,
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    font: {
      family: 'Source Sans Pro, sans-serif',
    },
    responsive: true,
    margin: {
      t: 20,
      l: yPadding,
      b: xPadding,
      r: 40,
    },
    xaxis: {
      ...layout.xaxis,
      autorange: true,
      title: {
        text: xAxisLabel || layout.xaxis?.title?.text || '',
        ...layout.xaxis?.title,
      },
    },
    yaxis: {
      ...layout.yaxis,
      autorange: true,
      title: {
        text: yAxisLabel || layout.yaxis?.title?.text || '',
        ...layout.yaxis?.title,
        ...(yAxisStandoff !== undefined && { standoff: yAxisStandoff })
      },
    },
    title: hideTitle ? '' : layout.title,
    showlegend: !hideLegend,
  }), [layout, xPadding, yPadding, hideTitle, hideLegend, xAxisLabel, yAxisLabel, yAxisStandoff]);

  return (
    <>
      {data ?
        <Plot
          data={data}
          layout={combinedLayout}
          useResizeHandler={true}
          className="w-full"
        />
        :
        <div key={"no-data-TimelineOfAttack"} role="alert" className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Warning! This chart has no data to display.</span>
        </div>
      }
    </>
  );
};

export default PlotlyGraph;
