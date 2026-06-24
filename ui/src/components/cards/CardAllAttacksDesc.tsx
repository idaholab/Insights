// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useNavigate } from 'react-router-dom';
import { SimpleModal } from '../modals/SimpleModal';
import { currencyFormatter } from '../../util/helperFunctions';
import React, { useState, useEffect } from 'react';
import { sortValues } from '../../util/AttackDataSort';

type Props = {
  data: any,
  keyIndex: string,
  sortOrder: sortValues
};

const formatForURL = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/ /g, '-'); // Replace spaces with hyphens
};

const CardAllAttacksDesc: React.FC<Props> = ({
  data,
  keyIndex,
  sortOrder
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [sortLabel, setSortLabel] = useState<string>('D0');
  const [sortDisplay, setSortDisplay] = useState<string>('');

  const navigate = useNavigate();
  const formattedReportName = formatForURL(String(data.caseStudyNameShort));

  const handleClick = () => {
    navigate(`/attack/${formattedReportName}`);
  };

  // Dialog Actions
  const handleOpenDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDialogVisible(true);
  };
  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  useEffect(() => {
    switch (sortOrder) {
      case 'highestMaxLossFirst':
      case 'lowestMaxLossFirst':
        setSortLabel('Max Loss');
        setSortDisplay(data.caseStudyFinancialLoss?.maxLoss ? currencyFormatter.format(data.caseStudyFinancialLoss.maxLoss) : '-');
        break;
      case 'longestTotalDurationFirst':
      case 'shortestTotalDurationFirst':
        setSortLabel('Total Duration');
        setSortDisplay(`${data.caseStudyAttackData?.durations?.total} Days`);
        break;
      default:
        setSortLabel('D0');
        setSortDisplay(`${data.caseStudyAttackData?.dates?.triggerYear}`);
    }
  }, [
    sortOrder,
    data.caseStudyFinancialLoss?.maxLoss,
    data.caseStudyAttackData?.durations?.total,
    data.caseStudyAttackData?.dates?.triggerYear
  ]);

  return (
    <>
      <div key={`card1${keyIndex} `} className="card shadow-md overflow-hidden">
        <div className="relative overflow-hidden card-header">
          <div className="z-10 p-6 relative">
            <h2 className="text-2xl mb-3">
              {data.caseStudyName}
            </h2>
            <div className={'inline-flex align-middle text-xs rounded-lg overflow-hidden text-neutralc-900 dark:text-neutralc-50'}>
              <span className="px-3 py-2 bg-neutralc-300 dark:bg-neutralc-600 ">
                {sortLabel}
              </span>
              <h6 className={'px-3 flex items-center bg-neutralc-50 dark:bg-neutralc-500'}>
                {sortDisplay}
              </h6>
            </div>
          </div>
          <div className="absolute top-0 h-full w-full opacity-10 dark:opacity-5 z-0">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="2.5" x2="10" y2="2.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="7.5" x2="15" y2="7.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="12.5" x2="22" y2="12.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="17.5" x2="35" y2="17.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="22.5" x2="40" y2="22.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="27.5" x2="15" y2="27.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="32.5" x2="20" y2="32.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="37.5" x2="17" y2="37.5" stroke="white" strokeWidth="3" />
              <line x1="0" y1="42.5" x2="5" y2="42.5" stroke="white" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className={'card-body p-6'}>
          <p>
            {data.caseStudyDescTruncated}
          </p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-ghost"
              onClick={handleOpenDialog}
            >
              Full Description
            </button>

            <button className="btn btn-ghost" onClick={handleClick}>
              Analysis
              <span className="material-icons-outlined">
                east
              </span>
            </button>
          </div>
        </div>
      </div>
      <SimpleModal key={`modal1${keyIndex} `} isOpen={isDialogVisible} onCloseClick={handleCloseDialog} title={data.caseStudyName} content={data.caseStudyDesc}></SimpleModal>
    </>
  );
}

export default CardAllAttacksDesc;
