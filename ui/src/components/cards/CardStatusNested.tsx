// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { GetContrastRatio, GetLuminance } from '../../util/ColorHelperFunctions';

type Props = {
  children: any
  title: string,
  optionalDescription?: string;
  type: string,
  titleAlignment?: string,
  className?: string,
  mitreColProbability?: number;
  backgroundColor?: string;
  mitreId?: string;

};

const CardStatusNested: React.FC<Props> = ({
  children,
  title,
  mitreColProbability,
  backgroundColor,
  mitreId,
  optionalDescription,
  type,
  titleAlignment,
  className,

}) => {
  const probDisplay = (mitreColProbability && mitreColProbability >= 0) ? Number(mitreColProbability).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 }) : '!!!';
  let textColorClass = '';
  if (backgroundColor) {
    const luminance = GetLuminance(backgroundColor);
    const contrastWithWhite = GetContrastRatio(luminance, GetLuminance("rgb(255, 255, 255)"));
    const contrastWithBlack = GetContrastRatio(luminance, GetLuminance("rgb(0, 0, 0)"));
    textColorClass = (contrastWithWhite >= 4.5 ? "text-white" : contrastWithBlack >= 4.5 ? "text-black" : "");
  }
  return (
    <>
      {type === 'normal' &&
        <div className={`card p-4 card-container shadow-md  overflow-hidden ${className}`}>
          <div className='mb-4 flex justify-left'>
            <h4 className={`text-xl ${titleAlignment === 'center' ? 'text-center' : ''}`}>
              {title}
            </h4>
            <span>{optionalDescription}</span>
          </div>
          {children}
        </div>
      }
      {type === 'mitre-col' &&
        <div className={`card p-2 overflow-hidden ${className} bg-neutralc-100 text-neutralc-900 dark:bg-neutralc-900 dark:text-neutralc-200`}>
          <div className={`mb-4 flex flex-col justify-between h-24 rounded-md border-2 border-neutralc-300 dark:border-neutralc-950`} style={{ borderColor: backgroundColor }}>
            <div className='flex grow items-center justify-center'>
              <h4 className={`p-1 h-18 flex text-sm font-semibold ${titleAlignment === 'center' ? 'text-center' : ''}`}>
                {title}
              </h4>
            </div>
            {probDisplay !== undefined && backgroundColor !== undefined &&
              <h5 className={`flex mt-1.5 w-full p-0.5 text-xs  font-medium justify-between ${textColorClass} }`}
                style={{ backgroundColor: backgroundColor }}>
                <span>{mitreId}</span>
                <span title={probDisplay === '!!!' ? 'The techniques for this tactic iare still being investigated.' : 'The overall probability of an observable event for all techniques of this tactic'}>{probDisplay}</span>
              </h5>
            }
          </div>
          {children}
        </div>
      }
    </>
  );
}

export default CardStatusNested;
