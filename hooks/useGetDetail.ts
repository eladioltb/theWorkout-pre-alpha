import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { gymApi } from '../axiosApi';
import { IExercise, IRoutine, IWorkout } from '../interfaces';

interface swrRequest {
  url: string,
  id: string
}

const fetcher = async ({url, id}: swrRequest) => {
  if(id) return await gymApi.get(`${url}/${id}`).then(res => res.data)
};

export const useGetDetail = (url: string, id: string, config: SWRConfiguration = {}) => {
  const [item, setItem] = useState<IExercise | IRoutine | IWorkout>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const query: swrRequest = { url, id };
  const { data } = useSWR<any>(query, fetcher, config);

  useEffect(() => {
    setIsLoading(true);
    if(!data) {
      setIsLoading(false);
      return;
    };
    setItem(data);
    setIsLoading(false);
  }, [data])
  
  

  return {
    item,
    isLoading
  };
};