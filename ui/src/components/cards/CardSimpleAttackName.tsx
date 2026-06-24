// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { GetContrastRatio, GetLuminance } from '../../util/ColorHelperFunctions';

type Props = {
  disabled: boolean;
  title: string;
  isMultiple?: boolean;
  onClick?: () => void;
  onMouseEnter?: (event: any) => void;
  onMouseLeave?: (event: any) => void;
  probability?: number,
  backgroundColor?: string,
  mitreId?: string;
  isFiltered?: boolean;
};

const CardSimpleAttackName: React.FC<Props> = ({ title, onClick, onMouseEnter, onMouseLeave, disabled, isMultiple, backgroundColor, probability, mitreId, isFiltered }) => {
  // bg-neutralc-200 dark: bg-neutralc-700 text-neutralc-900 dark:text-neutralc-100
  //const baseStyles = "hover:bg-white hover:text-black hover:dark:bg-neutralc-950 hover:dark:text-neutralc-100";
  const defaultBackground = "bg-neutralc-200 dark:bg-neutralc-700";
  const defaultText = "text-neutralc-900 dark:text-neutralc-100";
  const disabledStyles = "cursor-not-allowed opacity-40 dark:opacity-40";
  const clickableStyles = "cursor-pointer";
  let bgStyle = {};
  let textColorClass = "";

  if (backgroundColor) {
    const luminance = GetLuminance(backgroundColor);
    const contrastWithWhite = GetContrastRatio(luminance, GetLuminance("rgb(255, 255, 255)"));
    const contrastWithBlack = GetContrastRatio(luminance, GetLuminance("rgb(0, 0, 0)"));

    textColorClass = contrastWithWhite >= 4.5 ? "text-white" : contrastWithBlack >= 4.5 ? "text-black" : "";
    textColorClass = (isFiltered) ? 'text-neutralc-500' : contrastWithWhite >= 4.5 ? "text-white" : contrastWithBlack >= 4.5 ? "text-black" : "";
    bgStyle = { backgroundColor };
  } else {
    textColorClass = (isFiltered) ? 'text-neutralc-500' : defaultText;
  }

  const finalStyles = disabled ? disabledStyles : isMultiple ? `${textColorClass}`
    : `${clickableStyles} ${textColorClass}`;

  const probDisplay = probability === undefined ? '!!!' : Number(probability).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 });
  return (
    <div
      className={`card flex rounded-md shadow-md overflow-hidden
        min-h-[3.5rem]
        ${defaultBackground} ${textColorClass}
        ${finalStyles}
      `}
      style={bgStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={probDisplay === '!!!' ? 'This technique is still being investigated.' : 'The probability of an observable event on this technique'}
    >
      <div className="flex flex-col grow px-1 items-center hover:bg-white hover:text-black hover:dark:bg-neutralc-950 hover:dark:text-neutralc-100  ">
        <h6 className="text-xs flex text-center justify-center p-2 font-semibold ">
          {title}
        </h6>

        {mitreId &&
          <h5 className={`flex p-0.5 grow w-full text-xs justify-between font-medium`}>
            <span>{mitreId}</span>
            <span >{probDisplay}</span>
          </h5>
        }
      </div>
    </div>
  );
};

export default CardSimpleAttackName;
