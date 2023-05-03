import { DefaultParam, ExerciseType, IWorkoutExerciseDivided } from "../../interfaces";

export interface IPostWorkoutEndpointIn {
  routine: string,
  workout: IPostWorkoutTrainingEndpointIn[],
  percentage: number,
  startDate: number,
  endDate: number,
  duration: number,
  totalReps: number,
  totalWeight: number,
  cardioTime: number,
  restTime: number,
  user: string
}

export interface IGetWorkoutsEndpointOut {
  workouts: IPostWorkoutEndpointIn[];
  totalCount: number;
}

export interface IPostWorkoutEndpointOut {
  message: string,
  data: IPostWorkoutEndpointIn,
  status?: number
}

export interface IPostWorkoutTrainingEndpointIn {
  exercise: string,
  itemType: ExerciseType,
  param: DefaultParam,
  totalSeries: number,
  series: IPostWorkoutSerieEndpointIn[]
}

export interface IPostWorkoutSerieEndpointIn {
  order: number,
  completedReps: number,
  completedWeight: number,
  completedTime: number,
  time: number,
  reps:  number,
  weigth: number
}