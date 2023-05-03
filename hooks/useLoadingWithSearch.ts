import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { gymApi, IGetExercisesEndpointOUT } from '../axiosApi';
import { IExercise, IParams, ISearchBody } from '../interfaces';

interface swrRequest {
  url: string,
  params?: IParams
  body?: ISearchBody
}

const fetcher = ({url, params, body}: swrRequest) => gymApi.post(url, body, { params }).then(res => res.data);

export const useLoadingWithSearch = (url: string, params?: IParams, body?: ISearchBody, config: SWRConfiguration = {}) => {
  const [items, setItems] = useState<IExercise[]>([]);
  const query: swrRequest = { url, params, body };


  const { data } = useSWR<IGetExercisesEndpointOUT | any>(query, fetcher, config);

  useEffect(() => {
    if(!data) return;
    setItems([ ...items, ...data.items as IExercise[] ]);
  }, [params, data, items]);

  return {
    items: items || data || [],
    totalCount: data?.totalCount as number,
    isLoading: items.length <= 0,
    params
  };

};