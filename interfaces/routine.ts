import { DefaultParam, ExerciseType, IBodyGroup, IEquipment, ITarget } from ".";

export interface IRoutine {
  _id?: string,
  name: string,
  createdBy?: string,
  bodyGroups?: IBodyGroup[],
  needsEquipment?: boolean,
  routine: IRoutineExercise[] | IRoutineRest[] | IRoutineCardio[],
  rests: IRoutineRest[]
}

export interface IRoutineItemParent {
  order?: number;
  itemType: ExerciseType;
}

export interface IRoutineRest extends IRoutineItemParent {
  time: number;
}

export interface IRoutineCardio extends IRoutineItemParent {
  exercise: IRoutineExerciseDetail;
  series: ITimeSerie[];
  param: DefaultParam;
}

export interface IRoutineExercise extends IRoutineItemParent {
  exercise: IRoutineExerciseDetail;
  series: ISerie[];
  param: DefaultParam;
}

export interface IRoutineExerciseDetail {
  _id?: string;
  equipment?: IEquipment;
  gifUrl?: string;
  name: string;
  target?: ITarget;
  bodyGroup?: IBodyGroup;
}

export interface ISerie {
  order: number;
  weight?: number;
  reps?: number;
}

export interface ITimeSerie extends ISerie {
  time: number
}