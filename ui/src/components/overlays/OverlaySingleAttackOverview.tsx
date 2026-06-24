// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

// Custom Components
import CardSingleAttackSequence from '../cards/CardSingleAttackSequence';
import TimelineSingleAttack from '../elements/TimelineSingleAttack';
import ButtonBasic from '../elements/ButtonBasic';

// Define the Technique interface
interface Technique {
  CaseStudyId: number;
  D_Notation: string;
  CaseStudyObservableTimingId?: number;
  CaseStudyTechniqueId?: number;
  MITRE_TacticId?: number;
  MITRE_TechniqueId?: number;
  Tactic_Name?: string;
  Technique_Name?: string;
  Technique_Narratives?: string;
  TimingOrder?: number;
  UTC_Time?: string;
}

type Props = {
  techniqueList: Technique[];
  initialActiveSlide?: number;
  isDialogVisible: boolean;
  onCloseDialog: () => void;
};

const OverlaySingleAttackOverview: React.FC<Props> = ({ techniqueList, initialActiveSlide = 0, isDialogVisible, onCloseDialog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewportRef, emblaApi] = useEmblaCarousel();
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialActiveSlide);
  const emblaRef = useRef<any>(null);

  useEffect(() => {
    setIsOpen(prevIsOpen => {
      if (prevIsOpen !== isDialogVisible && emblaApi) {
        emblaApi.reInit();
      }
      return isDialogVisible;
    });
  }, [isDialogVisible, emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    setActiveSlideIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on('init', onScroll);
    emblaApi.on('scroll', onScroll);
  }, [emblaApi, onScroll]);

  useEffect(() => {
    if (isOpen && emblaApi) {
      emblaApi.scrollTo(initialActiveSlide);
    }
  }, [isOpen, emblaApi, initialActiveSlide]);

  const handleSetActiveSlide = useCallback((index: number) => {
    setActiveSlideIndex(index);
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  const prevSlide = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const nextSlide = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <>
      {isOpen && (
        <dialog className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box w-full max-w-full max-h-screen h-screen flex flex-col rounded-none bg-neutralc-100 dark:bg-neutralc-900">
              <div className="flex-grow p-10">
                <div className="mb-16">
                  <h3 className="text-3xl dark:text-neutralc-200">Intrusion Attack Sequence</h3>
                </div>
                <div className="embla-wrapper relative opacity-100">
                  <div ref={isOpen ? emblaRef : null} className="embla">
                    <div className="embla__viewport" ref={viewportRef}>
                      <div className="embla__container" style={{ height: 'calc(100vh - 456px)' }}>
                        {techniqueList.map((technique: any, index: number) => (
                          <div
                            className="embla__slide overflow-hidden"
                            key={index}
                            style={{
                              opacity: activeSlideIndex === index ? 1 : 0.5,
                            }}
                          >
                            <CardSingleAttackSequence sequenceNumber={index + 1} attackInfo={technique} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="embla-arrows absolute top-1/2 -left-12 -right-12 flex justify-between">
                    <button className="btn btn-ghost text-neutralc-500 dark:text-neutralc-400 pl-4 pr-2" onClick={prevSlide}>
                      <span className="material-icons">
                        arrow_back_ios
                      </span>
                    </button>
                    <button className="btn btn-ghost text-neutralc-500 dark:text-neutralc-400 pl-3 pr-3" onClick={nextSlide}>
                      <span className="material-icons">
                        arrow_forward_ios
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex mx-6">
                <div className="mx-auto max-w-[95%]">
                  <TimelineSingleAttack techniqueList={techniqueList} handleSetActiveSlide={handleSetActiveSlide} activeSlideIndex={activeSlideIndex} />
                </div>
              </div>

              <div className="modal-action pb-10 flex justify-center flex-shrink-0">
                <ButtonBasic
                  label={'Close'}
                  type={'btn-primary'}
                  onClick={onCloseDialog}
                />
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default OverlaySingleAttackOverview;
