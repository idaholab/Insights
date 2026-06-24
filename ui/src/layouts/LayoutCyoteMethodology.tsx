// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

// Hooks
import { useAppSelector } from '../../app/hooks/reduxTypescriptHooks';

// Custom Components
import CardContent from '../components/cards/CardContent';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import PageBanner from '../components/elements/PageBanner';

type Props = object;
const LayoutDashboard: React.FC<Props> = () => {

  // Store State
  const methodologyText = useAppSelector((state: any) => state.appState.methodologyText);

  const formatMethodologyText = (text: string) => {
    // Split by double newlines first
    const blocks = text.split('\n\n');

    // Convert to array of JSX elements
    const jsx = blocks.map((block, index) => {
      // Further split each block by single newline for items in list
      const lines = block.split('\n');

      return (
        <React.Fragment key={index}>
          {lines.map((line, lineIndex) => <div key={lineIndex} className="allow-column-break">{line}</div>)}
          {/* Only add the double-break if not the last block */}
          {index < blocks.length - 1 && <div className="double-break"></div>}
        </React.Fragment>
      );
    });

    return jsx;
  };

  const formattedMethodologyText = formatMethodologyText(methodologyText);

  return (
    <>
      <PageBanner title='Applying the CyOTE Methodology' isLoading={false} />
      <div className="p-10 grid sm:grid-cols-1 xl:grid-cols-1 gap-y-4">
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: !formattedMethodologyText,
            height: 685,
            count: 1
          }}
          data={formattedMethodologyText}
          error={null}
          keyIndex={''}
          renderComponent={(content) =>
            <CardContent>
              <h3 className="text-2xl mb-4">
                How it Works
              </h3>
              <div className="columns-3">
                {content}
              </div>
            </CardContent>
          } />

        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: !formattedMethodologyText,
            height: 535,
            count: 1
          }}
          data={<img className="m-auto w-full max-w-[1400px]" src={"./CyOTE-Methodology-Diagram_72.png"} alt="CyOTE Methodology" />}
          error={null}
          keyIndex={'formattedMethodologyTextKey1'}
          renderComponent={(content) =>
            <CardContent>
              <h3 className="text-2xl mb-4">
                Figure 1: Typical Attack Flow
              </h3>
              <div className="flex">
                {content}
              </div>
            </CardContent>
          } />
      </div>
    </>
  );
}
export default LayoutDashboard;
