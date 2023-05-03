import { useEffect, useState } from "react";
import { GET_EXERCISE_LIST_WITH_FILTER, gymApi } from "../axiosApi";
import { defaultParams, IParams, ISearchBody } from "../interfaces";

export const useSearch = () => {
  const [url, setUrl] = useState<string>(GET_EXERCISE_LIST_WITH_FILTER);
  const [params, setParams] = useState<IParams>(defaultParams);
  const [body, setBody] = useState<ISearchBody>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchData, setSearchData] = useState<any>({
    items: [],
    totalCount: 0
  });
  
  const newSearch = async (newSearch: boolean, body: ISearchBody) => {
    setBody(body);
    handleSearch(newSearch, body);
  };
  
  const handleSearch = async (newSearch: boolean, searchBody?: ISearchBody) => {
    setIsLoading(true);

    newSearch ? setParams(defaultParams) : setParams({ ...params, offset: searchData.items?.length });

    const { data } = await gymApi.post(url, searchBody || body, { params });
    
    const redata = searchData?.items ? [...searchData?.items, ...data?.items] : [...data?.items];
    const searchedItems = redata.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t._id === value._id
      ))
    );
    setSearchData({
      ...searchData,
      items: newSearch ? data.items : searchedItems,
      totalCount: data.totalCount,
    });
    
    setIsLoading(false);
  };

  return {
    searchData,
    isLoading,

    // Methods
    newSearch,
    setUrl,
    setParams,
    setSearchData,
    setBody,
    handleSearch
  };
};
