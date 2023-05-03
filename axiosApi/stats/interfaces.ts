import { DefaultParam, ExerciseType, IWorkoutExerciseDivided } from "../../interfaces";
import { DefaulTimeEnum } from "../../interfaces/stats";

export interface IGetStatsEndpointIn {
  startDate: number;
  endDate?: number;
  defaultTime: DefaulTimeEnum
}

// export interface IGetWorkoutsEndpointOut {
//   workouts: IPostWorkoutEndpointIn[];
//   totalCount: number;
// }

// export interface IPostWorkoutEndpointOut {
//   message: string,
//   data: IPostWorkoutEndpointIn,
//   status?: number
// }

// export interface IPostWorkoutTrainingEndpointIn {
//   exercise: string,
//   itemType: ExerciseType,
//   param: DefaultParam,
//   totalSeries: number,
//   series: IPostWorkoutSerieEndpointIn[]
// }

// export interface IPostWorkoutSerieEndpointIn {
//   order: number,
//   completedReps: number,
//   completedWeight: number,
//   completedTime: number,
//   time: number,
//   reps:  number,
//   weigth: number
// }