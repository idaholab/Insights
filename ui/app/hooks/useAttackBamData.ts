// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useState, useEffect } from 'react';
import { useGetAttackBamDataQuery } from '../services/attackBamDataApi';
import { BamAttackResponseType } from '../../src/types';

export const useAttackBamData = (id:string): { attackBamData: BamAttackResponseType[] | undefined, isLoading: boolean, error: any } => {
  const [attackBamData, setAttackBamData] = useState<BamAttackResponseType[] | undefined>(undefined);
  const { data: attackBamDataResponse, isLoading, error } = useGetAttackBamDataQuery(id);

  useEffect(() => {
    if (attackBamDataResponse) {
        setAttackBamData([ ...attackBamDataResponse ]);
    }
  }, [attackBamDataResponse]);

  return {
    attackBamData,
    isLoading,
    error
  };

};
