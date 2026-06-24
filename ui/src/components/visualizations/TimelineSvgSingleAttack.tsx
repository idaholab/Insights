// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import { useTheme } from '../../contexts/useTheme';
import * as d3 from 'd3';
import { Selection } from 'd3';

type LabelData = {
  x: number;
  y: number;
  text: string;
};

type Props = {
  dates: Array<{ [key: string]: any; }>;
  dayCounts: Array<{ [key: string]: any; }>;
};

const SVG_DIMENSIONS = { width: 1000, height: 200 };
const MARGIN = 40;
const MIN_WIDTH = 35;
const TRIGGER_RECT_WIDTH = 15;
const ICON_WIDTH = 15;

const TimelineSvgSingleAttack: React.FC<Props> = ({ dates, dayCounts }) => {
  // React hooks and theme setup
  const svgRef = React.useRef(null);
  const { theme } = useTheme();

  // SVG constants and icons
  const diamondIcon = "m20.12,9.16L11.6.63c-.67-.67-1.77-.67-2.44,0L.6,9.18c-.67.67-.67,1.77,0,2.44l8.53,8.53c.67.67,1.77.67,2.44,0l8.55-8.55c.67-.67.67-1.77,0-2.44Zm-10.64-3.71h1.76v7.26h-1.76v-7.26Zm.88,10.54c-.57,0-1.03-.46-1.03-1.03s.46-1.03,1.03-1.03,1.03.46,1.03,1.03-.46,1.03-1.03,1.03Z";
  const squareIcon = "m15.37.13H2.65C1.24.13.1,1.27.1,2.68v12.72c0,1.41,1.14,2.55,2.55,2.55h12.72c1.41,0,2.55-1.14,2.55-2.55V2.68c0-1.41-1.14-2.55-2.55-2.55Zm-7.69,13.24l-4.01-4.02,1.51-1.51,2.51,2.51,5.64-5.64,1.51,1.51-7.16,7.15Z";
  const circularArrowIcon = "m9.74,0C4.67,0,.5,3.85,0,8.79h10.83l-2.6-2.6,1.4-1.4,5,5-5,5-1.4-1.4,2.6-2.6H0c.5,4.94,4.67,8.79,9.74,8.79,5.41,0,9.79-4.38,9.79-9.79h0c.01-5.4-4.38-9.79-9.79-9.79Z";

  // Main useEffect for D3 rendering
  React.useEffect(() => {
    // if (!svgRef.current || !dayCounts[0] || !dayCounts[1] || !dates[0] || !dates[1]) return;
    if (!svgRef.current) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Core SVG setup
    const availableWidth = SVG_DIMENSIONS.width - 2 * MARGIN;

    // Data Parsing and Value Setup
    const parseValue = (value: string) => isNaN(parseInt(value)) ? null : parseInt(value);
    const firstRectDays = parseValue(dayCounts[0].value) || 0;
    const lastRectDays = parseValue(dayCounts[1].value) || 0;

    // Initial width calculations
    const totalDays = firstRectDays + lastRectDays;
    let firstRectWidth = (availableWidth * firstRectDays) / totalDays;
    let lastRectWidth = (availableWidth * lastRectDays) / totalDays;

    // Check if first rectangle should be MIN_WIDTH and adjust the other rectangle accordingly
    if (firstRectDays === 0 || firstRectWidth < MIN_WIDTH) {
      firstRectWidth = MIN_WIDTH;
      lastRectWidth = availableWidth - MIN_WIDTH;
    }

    // Check if last rectangle should be MIN_WIDTH and adjust the other rectangle accordingly
    if (lastRectDays === 0 || lastRectWidth < MIN_WIDTH) {
      lastRectWidth = MIN_WIDTH;
      firstRectWidth = availableWidth - MIN_WIDTH;
    }

    // Ensure neither rectangle exceeds the available width
    firstRectWidth = Math.min(firstRectWidth, availableWidth - MIN_WIDTH);
    lastRectWidth = Math.min(lastRectWidth, availableWidth - MIN_WIDTH);

    // SVG append setup
    const svg = d3.select(svgRef.current);
    const defs = svg.append("defs");
    const g = svg.append('g').attr('id', 'timelineSingleAttack');

    // Rectangle Drawing
    g.append('rect')
      .attr('x', MARGIN)
      .attr('y', 0)
      .attr('width', firstRectWidth)
      .attr('height', 50)
      .attr('fill', 'url(#linear-gradient-1)');

    g.append('rect')
      .attr('x', MARGIN + firstRectWidth)
      .attr('y', 0)
      .attr('width', TRIGGER_RECT_WIDTH)
      .attr('height', 50)
      .attr('fill', 'url(#linear-gradient-2)');

    g.append('rect')
      .attr('x', MARGIN + firstRectWidth + TRIGGER_RECT_WIDTH)
      .attr('y', 0)
      .attr('width', lastRectWidth)
      .attr('height', 50)
      .attr('fill', 'url(#linear-gradient-3)');

    // Icons Drawing
    const desiredWidth = 15;
    const scalingFactor = desiredWidth / ICON_WIDTH;

    // Y offset for centering the icon within a rectangle
    const yOffset = 15;

    // First Icon - circularArrowIcon
    g.append('path')
      .attr('d', circularArrowIcon)
      .attr('transform', `translate(${(MARGIN + 5)}, ${yOffset}) scale(${scalingFactor})`)
      .attr('fill', '#ffffff');

    // Middle Icon - diamondIcon
    g.append('path')
      .attr('d', diamondIcon)
      .attr('transform', `translate(${MARGIN + firstRectWidth - 4}, ${yOffset}) scale(${scalingFactor + .1})`)
      .attr('fill', '#ffffff');

    // Last Icon - squareIcon
    g.append('path')
      .attr('d', squareIcon)
      .attr('transform', `translate(${MARGIN + firstRectWidth + TRIGGER_RECT_WIDTH + lastRectWidth - 24}, ${yOffset}) scale(${scalingFactor})`)
      .attr('fill', '#ffffff');

    // Gradients Setup
    const createLinearGradient = (
      defs: Selection<SVGDefsElement, unknown, HTMLElement, any>,
      id: string,
      colors: string[]
    ) => {
      const gradient = defs.append("linearGradient").attr("id", id);
      gradient.append("stop").attr("offset", "0").attr("stop-color", colors[0]);
      gradient.append("stop").attr("offset", "1").attr("stop-color", colors[1]);
    };

    createLinearGradient(defs, "linear-gradient-1", ["#4989c8", "#4989c8"]);
    createLinearGradient(defs, "linear-gradient-2", ["#ff0000", "#ff0000"]);
    createLinearGradient(defs, "linear-gradient-3", ["#ff0000", "#4989c8"]);

    // Labels Drawing
    const textColor = theme === 'dark' ? 'white' : 'white';
    const labelPadding = 8;
    const labelBoxHeight = 3 * 15 + 5 * labelPadding;
    const labelData: LabelData[] = [
      { x: MARGIN, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2, text: 'Initial Access' },
      { x: MARGIN, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 15, text: `D-${dayCounts[0].value}` },
      { x: MARGIN, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 30, text: dates[0] ? `${dates[0].value}` : "" },

      { x: MARGIN + firstRectWidth + 7.5, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2, text: 'Triggering Event' },
      { x: MARGIN + firstRectWidth + 7.5, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 15, text: 'D-0' },
      { x: MARGIN + firstRectWidth + 7.5, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 30, text: dates[1] ? `${dates[1].value}` : "" },

      { x: MARGIN + firstRectWidth + lastRectWidth, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2, text: 'Recovery' },
      { x: MARGIN + firstRectWidth + lastRectWidth, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 15, text: `D+${dayCounts[1].value}` },
      { x: MARGIN + firstRectWidth + lastRectWidth, y: SVG_DIMENSIONS.height - labelBoxHeight + labelPadding * 2 + 30, text: dates[2] ? `${dates[2].value}` : "" }
    ];

    const iconBoxYOffset = 22; // Adjust this value to align icons and text within the bounding box

    const addBackgroundBox = (group: any) => {
      const bbox = group.node().getBBox();

      // Top rectangle
      group.insert('rect', ':first-child')
        .attr('x', bbox.x - labelPadding)
        .attr('y', bbox.y - labelPadding)
        .attr('width', bbox.width + 2 * labelPadding)
        .attr('height', 40)  // Height for top section
        .attr('fill', '#1D232A')  // Or desired color for the top section
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('clip-path', `polygon(
          0% 0%, 
          100% 0%, 
          100% 35px, 
          0% 35px)`);

      // Bottom rectangle
      group.insert('rect', ':first-child')
        .attr('x', bbox.x - labelPadding)
        .attr('y', bbox.y - labelPadding + 35 - 5) // Start where the top section ends
        .attr('width', bbox.width + 2 * labelPadding)
        .attr('height', bbox.height - 35 + 2 * labelPadding + 5)  // Remaining height
        .attr('fill', '#1F2937')  // Or desired color for the bottom section
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('clip-path', `polygon(
          0% 5px, 
          100% 5px, 
          100% 100%, 
          0% 100%)`);
    };

    // Adjust the text 'y' coordinates to ensure they are below the icons
    const adjustedLabelData: LabelData[] = labelData.map(d => ({
      ...d,
      y: d.y + iconBoxYOffset
    }));

    const firstGroup = g.append('g').attr('id', 'firstGroup');
    const middleGroup = g.append('g').attr('id', 'middleGroup');
    const lastGroup = g.append('g').attr('id', 'lastGroup');

    const iconY = labelData[0].y - iconBoxYOffset;  // This will position the icon above the first label

    firstGroup.append('path')
      .attr('d', circularArrowIcon)
      .attr('transform', `translate(${labelData[0].x - ICON_WIDTH / 2}, ${iconY})`)
      .attr('fill', '#ffffff');
    firstGroup.selectAll('text.first-labels')
      .data(adjustedLabelData.slice(0, 3))
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('fill', d => (d.text === 'Initial Access') ? textColor : '#999999')
      .attr('font-weight', d => (d.text === 'Initial Access') ? 'bold' : 'normal')
      .attr('letter-spacing', '0.25px')
      .style('shape-rendering', 'crispEdges')
      .style('text-rendering', 'optimizeLegibility')
      .style('-webkit-font-smoothing', 'antialiased')
      .style('-moz-osx-font-smoothing', 'grayscale')
      .text(d => d.text);
    addBackgroundBox(firstGroup);
    const firstGroupNode = firstGroup.node();
    if (firstGroupNode) {
      const firstGroupBBox = firstGroupNode.getBBox();
      if (firstGroupBBox.x < 0) {
        firstGroup.attr('transform', `translate(${-firstGroupBBox.x + labelPadding}, 0)`);
      }
    }

    middleGroup.append('path')
      .attr('d', diamondIcon)
      .attr('transform', `translate(${MARGIN + firstRectWidth + TRIGGER_RECT_WIDTH - 20}, ${iconY + .5}) scale(${scalingFactor})`)
      .attr('fill', '#ffffff');

    middleGroup.selectAll('text.middle-labels')
      .data(adjustedLabelData.slice(3, 6))
      .enter()
      .append('text')
      .attr('id', 'middleLabels')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('fill', d => (d.text === 'Triggering Event') ? textColor : '#999999')
      .attr('font-weight', d => (d.text === 'Triggering Event') ? 'bold' : 'normal')
      .attr('letter-spacing', '0.25px')
      .style('shape-rendering', 'crispEdges')
      .style('text-rendering', 'optimizeLegibility')
      .style('-webkit-font-smoothing', 'antialiased')
      .style('-moz-osx-font-smoothing', 'grayscale')
      .text(d => d.text);
    addBackgroundBox(middleGroup);
    const middleGroupNode = middleGroup.node();
    if (middleGroupNode) {
      const middleGroupBBox = middleGroupNode.getBBox();
      middleGroup.attr('transform', `translate(0,${iconY - middleGroupBBox.y})`);
    }

    lastGroup.append('path')
      .attr('d', squareIcon)
      .attr('transform', `translate(${MARGIN + firstRectWidth + TRIGGER_RECT_WIDTH + lastRectWidth - 24}, ${iconY - 1}) scale(${scalingFactor})`)
      .attr('fill', '#ffffff');

    lastGroup.selectAll('text.last-labels')
      .data(adjustedLabelData.slice(6))
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('fill', d => (d.text === 'Recovery') ? textColor : '#999999')
      .attr('font-weight', d => (d.text === 'Recovery') ? 'bold' : 'normal')
      .attr('letter-spacing', '0.25px')
      .style('shape-rendering', 'crispEdges')
      .style('text-rendering', 'optimizeLegibility')
      .style('-webkit-font-smoothing', 'antialiased')
      .style('-moz-osx-font-smoothing', 'grayscale')
      .text(d => d.text);
    addBackgroundBox(lastGroup);
    const lastGroupNode = lastGroup.node();
    if (lastGroupNode) {
      // const lastGroupBBox = lastGroupNode.getBBox();
      lastGroup.attr('transform', `translate(0,0)`);
      // lastGroup.attr('transform', `translate(0,${iconY - lastGroupBBox.y})`);
    }

    const adjustPositionBasedOnOverlap = (targetGroup: any, referenceGroup: any, direction = 1) => {
      const adjustMargin = 15;  // MARGIN to ensure labels don't touch

      const targetBBox = targetGroup.node().getBBox();
      const referenceBBox = referenceGroup.node().getBBox();

      if (direction === 1) { // Adjusting to the right
        if (targetBBox.x < referenceBBox.x + referenceBBox.width + adjustMargin) {
          const deltaX = (referenceBBox.x + referenceBBox.width + adjustMargin) - targetBBox.x;
          targetGroup.attr('transform', `translate(${deltaX},0)`);
        }
      } else { // Adjusting to the left
        if (targetBBox.x + targetBBox.width > referenceBBox.x - adjustMargin) {
          const deltaX = referenceBBox.x - adjustMargin - (targetBBox.x + targetBBox.width);
          targetGroup.attr('transform', `translate(${deltaX},0)`);
        }
      }
    };
    adjustPositionBasedOnOverlap(middleGroup, firstGroup);
    adjustPositionBasedOnOverlap(middleGroup, lastGroup, -1);

  }, [theme, dates, dayCounts]);

  return (
    <div style={{ display: 'flex', width: '100%', flex: 1 }}>
      {/* <svg
        ref={svgRef}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 1000 200"
        preserveAspectRatio="xMinYMin meet"
      /> */}
      <svg ref={svgRef} viewBox={`0 0 ${SVG_DIMENSIONS.width} ${SVG_DIMENSIONS.height}`} width="100%" height="100%"></svg>

    </div>
  );
};

export default TimelineSvgSingleAttack;
