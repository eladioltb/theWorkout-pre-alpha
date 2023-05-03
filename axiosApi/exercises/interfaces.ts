import { IExercise } from "../../interfaces";

export interface IGetExercisesEndpointOUT {
  items: IExercise[],
  totalCount: number
}