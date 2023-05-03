import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { gymApi, IGetExercisesEndpointOUT, IGetRoutinesEndpointOut } from '../axiosApi';
import { IBodyGroup, IExercise, IParams, IRoutine } from '../interfaces';

interface swrRequest {
  url: string,
  params?: IParams
}

const fetcher = ({url, ...params}: swrRequest) => gymApi.get(url, { params }).then(res => res.data);

export const useLoadingRoutines = (url: string, params?: IParams, config: SWRConfiguration = {}) => {
  const [items, setItems] = useState<IExercise[] | IRoutine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const query: swrRequest = { url, ...params };
  const { data } = useSWR<IGetExercisesEndpointOUT | IGetRoutinesEndpointOut | any>(query, fetcher, config);
  
  useEffect(() => {
    setIsLoading(true);
    if(!data) {
      setIsLoading(false);
      return
    };
    let hash: any = {};
    const allItems = [ ...items, ...data.items ].filter(item => hash[item._id] ? false : hash[item._id] = true);
    setItems(allItems);
    setIsLoading(false);
  }, [data])

  return {
    items: items || data || [],
    totalCount: data?.totalCount as number,
    isLoading,
    params
  };
};

export const useLoadingExercises = (url: string, params?: IParams, config: SWRConfiguration = {}) => {
  const [items, setItems] = useState<IExercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const query: swrRequest = { url, ...params };
  const { data } = useSWR<IGetExercisesEndpointOUT | IGetRoutinesEndpointOut | any>(query, fetcher, config);
  
  useEffect(() => {
    if(!data) {
      setIsLoading(false);
      return;
    };
    let hash: any = {};
    const allItems = [ ...items, ...data.items ].filter(item => hash[item._id] ? false : hash[item._id] = true);
    setItems(allItems);
    setIsLoading(false);
  }, [data])

  return {
    items: items || data || [],
    totalCount: data?.totalCount as number,
    isLoading,
    params
  };
};

export const useLoadingBodyGroups = (url: string, params?: IParams, config: SWRConfiguration = {}) => {
  const [items, setItems] = useState<IBodyGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const query: swrRequest = { url, ...params };
  const { data } = useSWR<any>(query, fetcher, config);
  
  useEffect(() => {
    if(!data) {
      setIsLoading(false);
      return;
    };    
    let hash: any = {};
    const allItems = [ ...items, ...data ].filter(item => hash[item._id] ? false : hash[item._id] = true);
    setIsLoading(false);
    setItems(allItems);
  }, [data])

  return {
    items: items || data || [],
    totalCount: data?.totalCount as number,
    isLoading,
    params
  };
};