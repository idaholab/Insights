// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { AttackFilterCriteria, VM_AllAttackData } from "../types";

export const filterAttackData = (dataset: VM_AllAttackData[] | undefined, criteria: AttackFilterCriteria): VM_AllAttackData[] | undefined => {
    let filtered = dataset?.filter((caseStudy) => {
        const {
            maxLoss,
            maxLossMin,
            maxLossMax,
            minLoss,
            triggerDate,
            triggerYears,
            durationTotal,
            durationTotalMax,
            durationTotalMin,
            ransomware,
            keyword,
        } = criteria;

        let matches = true;

        if (keyword) {
            const keywordLower = keyword.toLowerCase();
            const caseStudyNameMatch = caseStudy.caseStudyName?.toLowerCase()?.includes(keywordLower);
            const caseStudyDescMatch = caseStudy.caseStudyDesc?.toLowerCase()?.includes(keywordLower);
            const tacticsMatch = caseStudy.caseStudyAttackData?.techniques?.some((technique) =>
                technique.Tactic_Name?.toLowerCase()?.includes(keywordLower)
            );
            const techniquesMatch = caseStudy.caseStudyAttackData?.techniques?.some((technique) =>
                technique.Technique_Name?.toLowerCase()?.includes(keywordLower)
            );

            if (!caseStudyNameMatch && !caseStudyDescMatch && !tacticsMatch && !techniquesMatch) {
                matches = false;
            }
        }

        //if (maxLoss || minLoss || triggerDate || (triggerYears && triggerYears?.length > 0) || durationTotalUpper || durationTotalLower || ransomware) {
        // if (maxLoss !== undefined && (caseStudy.caseStudyFinancialLoss?.maxLoss ?? Infinity) > maxLoss) {
        //     matches = false;
        // }

        if (maxLoss) {
            if ((caseStudy.caseStudyFinancialLoss?.maxLoss ?? 0) > (maxLoss ?? 0)) {
                matches = false;
            }
        } else {
            if (maxLossMin && maxLossMax) { // Range specified
                if ((caseStudy.caseStudyFinancialLoss?.maxLoss ?? 0) < (maxLossMin ?? 0) || (caseStudy.caseStudyFinancialLoss?.maxLoss ?? 0) > (maxLossMax ?? 0)) {
                    matches = false;
                }
            } else if (maxLossMin) { // Min Specified
                if ((caseStudy.caseStudyFinancialLoss?.maxLoss ?? 0) > (maxLossMin ?? 0)) {
                    matches = false;
                }
            }
            else if (maxLossMax) { // Max specified
                if ((caseStudy.caseStudyFinancialLoss?.maxLoss ?? 0) < (maxLossMax ?? 0)) {
                    matches = false;
                }
            }
        }





        // Note: Filter code doesn't exist for this yet...
        if (minLoss !== undefined && (caseStudy.caseStudyFinancialLoss?.minLoss ?? -Infinity) < minLoss) {
            matches = false;
        }

        if (triggerDate !== undefined) {
            const caseStudyTriggerDate = caseStudy.caseStudyAttackData?.dates?.triggerDate;
            if (caseStudyTriggerDate && new Date(caseStudyTriggerDate).toISOString() !== triggerDate.toISOString()) {
                matches = false;
            }
        }

        if (triggerYears !== undefined && triggerYears?.length > 0 && !triggerYears.includes(Number(caseStudy.caseStudyAttackData?.dates?.triggerYear) ?? -1)) {
            matches = false;
        }



        if (durationTotal) {
            if ((caseStudy.caseStudyAttackData?.durations?.total ?? 0) > (durationTotal ?? 0)) {
                matches = false;
            }
        } else { // !durationTotal 
            if (durationTotalMin && durationTotalMax) { // Range specified
                if ((caseStudy.caseStudyAttackData?.durations?.total ?? 0) < (durationTotalMin ?? 0) || (caseStudy.caseStudyAttackData?.durations?.total ?? 0) > (durationTotalMax ?? 0)) {
                    matches = false;
                }
            } else if (durationTotalMin) { // Min Specified
                if ((caseStudy.caseStudyAttackData?.durations?.total ?? 0) > (durationTotalMin ?? 0)) {
                    matches = false;
                }
            }
            else if (durationTotalMax) { // Max specified
                if ((caseStudy.caseStudyAttackData?.durations?.total ?? 0) < (durationTotalMax ?? 0)) {
                    matches = false;
                }
            }
        }


        // if (
        //     (durationTotalLower !== undefined && (caseStudy.caseStudyAttackData?.durations?.total ?? 0) > (durationTotalLower ?? 0)) ||
        //     (durationTotalUpper !== undefined && (caseStudy.caseStudyAttackData?.durations?.total ?? 0) < durationTotalUpper)
        // ) {
        //     matches = false;
        // }

        if (ransomware !== undefined && caseStudy.caseStudyAttackData?.ransomware !== ransomware) {
            matches = false;
        }
        //}

        return matches;
    });

    return filtered;
};