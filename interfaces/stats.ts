import { DefaultParam, ExerciseType, IBodyGroup, IExercise } from "./exercises";
import { IRoutine, IRoutineRest, ITimeSerie } from "./routine";
import { ISerieCompleted, IWorkoutSerie } from "./workout";

export enum DataTypeEnum {
  PERCENTAGE = "percentage",
  TIME = "time",
  NUMERIC = "numeric"
}

export enum DefaulTimeEnum {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  MORE = "more"
}

export enum TypeOfStatProgress {
  DURATION = "time",
  CARDIO = "cardio",
  WEIGHT = "weight"
}

export interface IStatWorkout {
  _id: string;
  routine: IRoutine;
  workout: IStatWorkoutExercise[];
  rests: IRoutineRest[];
  percentage: number;
  startDate: number;
  endDate: number;
  duration: number;
  totalReps: number;
  totalWeight: number;
  cardioTime: number;
  restTime: number;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICalendarWorkout {
  name: string
  _id: string,
  img: string,
  duration: number,
  startDate: number,
  endDate: number,
  percentage: number,
  weightAverage: number,
  cardioTime: number,
  routine: string,
  bodyGroups: string[]
}

export interface RoutineSeries {
  order: number;
  time?: number;
  reps: number;
  weight: number;
}

export interface IStatWorkoutExercise {
  exercise: IExercise;
  itemType: string;
  param: string;
  series: ISerieCompleted[];
  _id: string;
}

export interface IStatWeightExercise {
  img: string,
  name: string,
  bodyGroup: string,
  series: number,
  reps: number,
  maxWeight: number,
  minWeight: number,
  totalWeight: number
}

export interface IStatCardioExercise {
  img: string,
  name: string,
  time: number,
  maxTime: number,
  minTime: number,
  series: number
}

export interface IFormattedExercises {
  weightFormattedExercises: IStatWeightExercise[], 
  cardioFormattedExercises: IStatCardioExercise[]
}

export interface IProgressInPeriod {
  data: IWorkoutTime[];
  labels: string[],
}

export interface IWorkoutTime {
  duration: number;
  weight: number;
  cardio: number;
  date: number;
  numOfWorkouts?: number;
}

export interface IDataToChart {
  data: number[];
  labels: string[],
}

export interface IBodyGroupProgress {
  labels: string[],
  data: IBodyGroupProgressFiltered[];
}

export interface IBodyGroupProgressFiltered {
  bodyGroup: string,
  type: ExerciseType,
  data: IBodyGroupProgressRaw[];
}

export interface IBodyGroupProgressRaw {
  bodyGroup: string,
  type: ExerciseType,
  date: number;
  cardio?: number;
  weight?: number;
  numOfWorkouts?: number;
}
