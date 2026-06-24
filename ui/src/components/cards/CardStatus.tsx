// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  statusNumberLabel: string;
  statusNumberValue: number | string;
  textColor?: string;
};

const CardStatus: React.FC<Props> = ({ statusNumberLabel, statusNumberValue, textColor }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeTextToFit = () => {
      const container = textRef.current?.parentElement;
      const textWrapper = textRef.current;

      if (!container || !textWrapper) return;

      // Temporarily reset font size to 100% to get the accurate text width
      textWrapper.style.fontSize = '100%';

      const containerWidth = container.getBoundingClientRect().width;
      const textWidth = textWrapper.getBoundingClientRect().width;

      if (textWidth > containerWidth) {
        const scaleFactor = containerWidth / textWidth;

        // Set the font size based on the scaling factor
        textWrapper.style.fontSize = `${100 * scaleFactor}%`;
      } else {
        // Reset the font size to 100% if the text fits within the container
        textWrapper.style.fontSize = '100%';
      }
    };

    const handleResize = () => {
      resizeTextToFit();
    };

    resizeTextToFit(); // Call it initially to set the font size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [statusNumberValue]);

  return (
    <div className="card shadow-md overflow-hidden flex align-middle" style={{ minHeight: '15rem' }}>
      <div className={`flex flex-grow px-6 text-center overflow-hidden card-header `}>
        <div className="text-center card-responsive-value">
          <h2 style={textColor ? { color: textColor } : {}} ref={textRef}>{statusNumberValue}</h2>
        </div>
      </div>
      <div className="card-body p-4 flex align-center justify-center text-center bg-neutralc-50 dark:bg-neutralc-700 text-neutralc-700 dark:text-neutralc-300" style={{ maxHeight: '4rem' }}>
        <span className="text-md">{statusNumberLabel}</span>
      </div>
    </div>
  );
};

export default CardStatus;
