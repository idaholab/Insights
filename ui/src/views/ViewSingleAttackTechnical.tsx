// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { Suspense, useState, useCallback, useContext } from 'react';
import { useAppSelector } from '../../app/hooks/reduxTypescriptHooks';
import { AttackInfoContext } from '../pages/PageSingleAttackAnalysis';
import CardSimpleAttackName from '../components/cards/CardSimpleAttackName';
import CardStatusNested from '../components/cards/CardStatusNested';
import ButtonBasic from '../components/elements/ButtonBasic';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import { useTheme } from '../contexts/useTheme';

// Lazy load the OverlaySingleAttackOverview component
const OverlaySingleAttackOverview = React.lazy(() => import('../components/overlays/OverlaySingleAttackOverview'));

type Technique = {
  MITRE_TechniqueId: number;
  MITRE_Id?: string;
  MITRE_TechniqueName: string;
};

type TechniqueCategoryProps = {
  techniqueCategory: {
    tactic: {
      MITRE_TacticId: number;
      MITRE_TacticName: string;
    };
    techniques: Technique[];
  };
  observedList: Array<{
    MITRE_TacticId: number;
    MITRE_TechniqueId: number;
    MITRE_Id?: string;
  }>;
  onTechniqueClick: (techniqueId: number, tacticId: number) => void;
};

type MatchingTechniquesDropdownProps = {
  techniqueName: string;
  matchingTechniques: any[];
  matchingTechniquesIndexes: number[]; // New prop
  observedList: any[];
  onTechniqueClick: (index: number) => void; // Modified to accept only index
};

type Props = object;

const ViewSingleAttackTechnical: React.FC<Props> = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [initialActiveSlide, setInitialActiveSlide] = useState(0);
  const { mitreMatrix, isLoading, errorAttacks } = useContext(AttackInfoContext);
  const observedAttackTechniqueList = useAppSelector((state: any) => state?.appState?.selectedReport?.caseStudyAttackData?.techniques);
  const { skeletonBaseColor, skeletonHighlightColor } = useTheme();

  // Check if mitreMatrix is available and each techniqueCategory has techniques
  const isMitreMatrixAvailable = mitreMatrix && mitreMatrix.every((techniqueCategory: any) => techniqueCategory.techniques);

  const enhancedObservedTechniqueList = observedAttackTechniqueList?.map((observed: any) => {
    const matchedTechnique = isMitreMatrixAvailable && mitreMatrix.flatMap((techniqueCategory: any) => {
      // For each technique in techniques, add the MITRE_TacticId from the parent techniqueCategory
      return techniqueCategory.techniques.map((technique: any) => ({
        ...technique,
        MITRE_TacticId: techniqueCategory.tactic.MITRE_TacticId
      }));
    }).find((technique: any) => {
      // Now each technique has a MITRE_TacticId, and you can use it directly
      return (
        observed.MITRE_TechniqueId === technique.MITRE_TechniqueId &&
        observed.MITRE_TacticId === technique.MITRE_TacticId
      );
    });

    return matchedTechnique ? { ...observed, MITRE_Id: matchedTechnique.MITRE_Id } : observed;
  });

  // Dropdown for showing multiple matching techniques
  const MatchingTechniquesDropdown: React.FC<MatchingTechniquesDropdownProps> = ({
    techniqueName,
    matchingTechniquesIndexes,
    onTechniqueClick
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let closeDropdownTimeout: NodeJS.Timeout;

    return (
      <div
        className="relative group"
        onMouseEnter={() => {
          if (closeDropdownTimeout) clearTimeout(closeDropdownTimeout); // Clear timeout if one exists
          setIsDropdownOpen(true);
        }}
        onMouseLeave={() => {
          closeDropdownTimeout = setTimeout(() => setIsDropdownOpen(false), 200); // Delay the dropdown closure by 200ms
        }}
      >
        <CardSimpleAttackName
          disabled={false}
          title={techniqueName}
          isMultiple={true}
          isFiltered={false}
        />
        <div className={`absolute left-0 mt-2 w-[85px] bg-white border border-neutralc-200 shadow-xl z-20 ${isDropdownOpen ? 'block' : 'hidden'}`}>
          {matchingTechniquesIndexes.map((index, idx) => (
            <button key={`simpleAttackButton-${idx}`} className="block text-[12px] hover:bg-neutralc-300 w-full px-4 py-2 text-left text-black" onClick={() => {
              onTechniqueClick(index);
            }}>
              {`Instance ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const TechniqueCategory: React.FC<TechniqueCategoryProps> = ({ techniqueCategory, observedList, onTechniqueClick }) => {
    if (!techniqueCategory || !techniqueCategory.techniques) {
      return null;
    }

    return (
      <CardStatusNested
        title={techniqueCategory.tactic.MITRE_TacticName}
        className="w-1/12 h-fit mx-1 overflow-visible"
        type="mitre-col"
        titleAlignment="center"
      >
        <div className="grid sm:grid-cols-1 gap-2">
          {techniqueCategory.techniques.map((technique: any) => {
            // Get all matching techniques based on both TechniqueId and TacticId
            const matchingTechniques = observedList?.filter(observed =>
              observed.MITRE_TechniqueId === technique.MITRE_TechniqueId &&
              observed.MITRE_TacticId === techniqueCategory.tactic.MITRE_TacticId
            ) || [];

            // Determine if there is an attack based on the existence of matching techniques
            const isAttack = matchingTechniques.length > 0;

            // Get the indexes of matching techniques from the original observed list
            const matchingTechniquesIndexes = matchingTechniques.map(observed =>
              observedList?.indexOf(observed)
            ).filter(index => index !== -1);

            const matchingTechniquesCount = matchingTechniques.length;

            return (
              <div key={technique.MITRE_Id || 'technique-' + technique.MITRE_TechniqueId} className="relative">
                {matchingTechniquesCount > 1 && (
                  <span className="badge absolute -top-1 -right-1 bg-error-light dark:bg-error-dark text-white rounded-full w-6 h-6 text-center text-xs z-10">
                    {matchingTechniquesCount}
                  </span>
                )}
                {matchingTechniquesCount > 1 ? (
                  <MatchingTechniquesDropdown
                    techniqueName={technique.MITRE_TechniqueName}
                    matchingTechniques={matchingTechniques}
                    matchingTechniquesIndexes={matchingTechniquesIndexes}
                    observedList={enhancedObservedTechniqueList}
                    onTechniqueClick={(index) => {
                      setInitialActiveSlide(index);
                      setIsDialogVisible(true);
                    }}
                  />
                ) : (
                  <CardSimpleAttackName
                    title={technique.MITRE_TechniqueName}
                    disabled={!isAttack}
                    isMultiple={false}
                    isFiltered={false}
                    onClick={() => {
                      if (isAttack) {
                        onTechniqueClick(technique.MITRE_TechniqueId, techniqueCategory.tactic.MITRE_TacticId);
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardStatusNested>
    );
  }

  const handleOpenDialog = useCallback((techniqueId?: number, tacticId?: number) => {
    if (techniqueId !== undefined && tacticId !== undefined) {
      const index = enhancedObservedTechniqueList.findIndex((observed: any) =>
        observed.MITRE_TechniqueId === techniqueId && observed.MITRE_TacticId === tacticId
      );

      if (index !== -1) {
        setInitialActiveSlide(index);
      }
    } else {
      setInitialActiveSlide(0); // default to the first slide
    }

    setIsDialogVisible(true);
  }, [enhancedObservedTechniqueList]);

  const handleCloseDialog = () => setIsDialogVisible(false);

  return (
    <>
      <div className="mb-4 flex justify-between">
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            height: 36,
            width: 185,
            count: 1
          }}
          data={'Technical View'}
          error={null}
          keyIndex={'TechnicalViewLabel9'}
          renderComponent={(content) =>
            <h3 className="text-3xl text-neutralc-800 dark:text-neutralc-200">{content}</h3>
          } />

        <div className="-mt-2 -mb-2">
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              height: 48,
              width: 170,
              count: 1
            }}
            data={'Launch Attack Timeline'}
            error={null}
            keyIndex={'LaunchAttackTimelineLabel2'}
            renderComponent={(content) =>
              <ButtonBasic
                label={content}
                type={'btn-primary'}
                onClick={() => handleOpenDialog()}
              />
            } />
        </div>
      </div>

      <GenericLoadingErrorWrapper
        skeletonTypeProps={{
          isLoading: isLoading,
          template: (
            <div className={`card p-4 overflow-hidden`}>
              <div className="grid sm:grid-cols-1 xl:grid-cols-11 gap-4">
                {[...Array(1)].map((_, index) => (
                  <Skeleton key={`skeleton-mitreMatrix2-${index}`} height={928} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                ))}
              </div>
            </div>
          )
        }}
        data={mitreMatrix}
        error={errorAttacks}
        keyIndex={'mitreMatrix2'}
        renderComponent={(content: any) => {
          return (
            <div className="flex flex-row -mx-1">
              {!!observedAttackTechniqueList && (
                <Suspense fallback={<div style={{ width: '100%', height: '100%' }}><Skeleton count={1} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}></Skeleton></div>}>
                  <OverlaySingleAttackOverview
                    techniqueList={enhancedObservedTechniqueList}
                    initialActiveSlide={initialActiveSlide}
                    isDialogVisible={isDialogVisible}
                    onCloseDialog={handleCloseDialog}
                  />
                </Suspense>)
              }

              {(isMitreMatrixAvailable && content.map((techniqueCategory: any, index: number) => (
                <TechniqueCategory
                  key={techniqueCategory.tactic.MITRE_TacticId || 'techniqueCategory-' + index}
                  techniqueCategory={techniqueCategory}
                  observedList={enhancedObservedTechniqueList}
                  onTechniqueClick={handleOpenDialog}
                />
              )))
              }
            </div>
          )
        }
        } />
    </>
  );
}
export default ViewSingleAttackTechnical;
