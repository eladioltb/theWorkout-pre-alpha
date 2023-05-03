import { IBodyGroup } from "./exercises"

export interface IParams {
  offset: number,
  limit: number,
  term?: string
}

export interface ISearchBody {
  name: string,
  bodyGroups: IBodyGroup[],
  noEquipement: boolean
}

export const defaultParams: IParams = {
  offset: 0,
  limit: 28,
  term: ''
}