import { DefaultParam, ExerciseType, IBodyGroup, IRoutine, ISerie } from "../../interfaces";

export interface IGetRoutinesEndpointOut {
  items: IRoutine[],
  totalCount: number
}

export interface IPostRoutinesEndpointOut {
  routine: IRoutine,
}

export interface IRoutineExerciseEndpointIn {
  exercise: string,
  order: number,
  series: ISerie[]
  itemType: ExerciseType;
  param: DefaultParam;
}

export interface IRoutineRestEndpointIn {
  time: number,
  order: number,
  itemType: ExerciseType;
}

export interface IPostRoutineEndpointIn {
  routine: IRoutineExerciseEndpointIn[],
  rests: IRoutineRestEndpointIn[],
  name: string,
  needsEquipment: boolean,
  bodyGroups: IBodyGroup[]
}