// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { useState } from 'react';

//Custom Components
import ButtonBasic from '../elements/ButtonBasic';
import 'react-loading-skeleton/dist/skeleton.css'

type Props = {
  data: any
};

const CardCyoteTool: React.FC<Props> = ({
  data
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // Dialog Actions
  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };
  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  return (
    <>
      <div className="card shadow-md overflow-hidden">
        <div className="relative bg-neutralc-300 dark:bg-neutralc-700 text-white overflow-hidden">
          <div className="z-10 p-6 relative">
            <h4 className="text-2xl inline text-neutralc-800 dark:text-neutralc-200">
              {data.title}
            </h4>
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
        <div className="bg-contain h-[175px]">
          <img src={import.meta.env.BASE_URL + data.images[0]} />
        </div>

        <div className={'card-body p-6 text-neutralc-800 bg-neutralc-200 dark:text-neutralc-200  dark:bg-neutralc-600'}>
          <div className="card-actions justify-center">
            <ButtonBasic
              label={data.button}
              type={'btn-primary'}
              onClick={handleOpenDialog}
            />
          </div>
          {isDialogVisible && (
            <div className="fixed inset-0 bg-black opacity-60 z-50"></div>
          )}
          <dialog
            id="attack-full-desc-modal" className="modal"
            open={isDialogVisible}
          >
            <div className="modal-box max-w-none min-w-none p-0 overflow-hidden flex flex-col">
              <h2 className="text-3xl px-12 py-8 sticky top-0 left-0 w-full bg-neutralc-300 dark:bg-neutralc-700 z-10 flex-shrink-0">
                {data.titleDialog}
              </h2>
              <div className="flex-grow overflow-y-auto">
                <div className="relative grid sm:grid-cols-1 gap-6 p-10">
                  {data.images.map((imagePath: string, index: number) => (
                    <img src={import.meta.env.BASE_URL + imagePath} alt={`image-${index}`} key={index} className="h-auto w-full" />
                  ))}
                </div>
              </div>
              <div className="modal-action px-12 py-8 sticky bottom-0 left-0 bg-neutralc-300 dark:bg-neutralc-700 z-10 flex-shrink-0 -mt-[1px]">
                <form method="dialog">
                  <ButtonBasic
                    label={"Close"}
                    type={'btn-primary'}
                    onClick={handleCloseDialog}
                  />
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
}
export default CardCyoteTool;
