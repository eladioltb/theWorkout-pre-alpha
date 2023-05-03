import { DefaultParam, ExerciseType, IBodyGroup, ITarget } from "./exercises";
import { IRoutineItemParent, ISerie } from "./routine";

export interface IWorkoutExercise {
  name: string;
  gifUrl?: string;
  target?: ITarget;
  bodyGroup?: IBodyGroup;
  itemType: ExerciseType;
  order: number;
  series: IWorkoutSerie[];
}

export interface IWorkoutSerie extends ISerie {
  completedReps?: number;
  percentage?: number;
  completedWeigth?: number;
}

export interface IWorkout {
  name: string,
  exercises: IWorkoutExercise[];
  bodyGroups: IBodyGroup[];
  percentage: number;
  startDate: number;
  endDate: number;
  duration: number;
}

export interface IStartWorkout {
  id: string,
  name: string,
  bodyGroups: IBodyGroup[],
  exercises: IRoutineItemParent[],
  totalExercises: number,
  workout: IWorkoutExerciseDivided[],
  startDate: number,
  actualOrder: number
}

export interface IWorkoutExerciseDivided extends IWorkoutExercise {
  _id: string;
  orderSeries: number;
  totalSeries: number;
  weight?: number;
  reps?: number;
  completedReps?: number;
  completedWeight?: number;
  completedTime?: number;
  percentage?: number;
  orderInWorkout?: number;
  itemType: ExerciseType;
  param: DefaultParam;
  time?: number;
}

export interface ISerieCompleted {
  order: number,
  completedReps: number,
  completedWeight: number
  completedTime?: number
}