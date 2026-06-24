// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export interface ObservableFilterCriteria {
  keyword: string;
  perceivability: string[];
  techniques: string[];
  tactics: string[];
  caseStudies: string[];
  observableTypes: string[];
  observableLevels: string[];
  phases: string[];
}

export const filterObservables = (
  data: any[],
  criteria: ObservableFilterCriteria
): any[] => {
  return data.filter((observable) => {
    // Keyword search - searches multiple fields
    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      const matchesKeyword = 
        observable.obs_desc.toLowerCase().includes(keyword) ||
        observable.tech_ics_name.toLowerCase().includes(keyword) ||
        observable.tech_ics_id.toLowerCase().includes(keyword) ||
        observable.tact_ics_name.toLowerCase().includes(keyword) ||
        observable.case_name.toLowerCase().includes(keyword) ||
        observable.case_alias.toLowerCase().includes(keyword) ||
        observable.obs_src_tag.toLowerCase().includes(keyword);
      
      if (!matchesKeyword) return false;
    }

    // Perceivability filter
    if (criteria.perceivability.length > 0) {
      if (!criteria.perceivability.includes(observable.perceivability)) {
        return false;
      }
    }

    // Technique filter
    if (criteria.techniques.length > 0) {
      if (!criteria.techniques.includes(observable.tech_ics_id)) {
        return false;
      }
    }

    // Tactic filter
    if (criteria.tactics.length > 0) {
      if (!criteria.tactics.includes(observable.tact_ics_id)) {
        return false;
      }
    }

    // Case Study filter
    if (criteria.caseStudies.length > 0) {
      if (!criteria.caseStudies.includes(observable.case_alias)) {
        return false;
      }
    }

    // Observable Type filter
    if (criteria.observableTypes.length > 0) {
      if (!criteria.observableTypes.includes(observable.obs_type)) {
        return false;
      }
    }

    // Observable Level filter
    if (criteria.observableLevels.length > 0) {
      if (!criteria.observableLevels.includes(observable.obs_lvl)) {
        return false;
      }
    }

    // Phase filter
    if (criteria.phases.length > 0) {
      if (!criteria.phases.includes(observable.tact_tech_phase)) {
        return false;
      }
    }

    return true;
  });
};

export const isCriteriaEmpty = (criteria: ObservableFilterCriteria): boolean => {
  return !criteria.keyword &&
    criteria.perceivability.length === 0 &&
    criteria.techniques.length === 0 &&
    criteria.tactics.length === 0 &&
    criteria.caseStudies.length === 0 &&
    criteria.observableTypes.length === 0 &&
    criteria.observableLevels.length === 0 &&
    criteria.phases.length === 0;
};
