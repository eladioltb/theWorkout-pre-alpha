import { createContext } from 'react';
import { DefaulTimeEnum, IBodyGroupProgress, ICalendarWorkout, IDataToChart, IFormattedExercises, IStatWorkout, IWorkoutTime } from '../../interfaces/stats';

interface ContextProps {
  workoutList: IStatWorkout[],
  workoutCalendar: ICalendarWorkout[],
  progressInTime: IWorkoutTime[],
  cardioWeightRestRelation: IDataToChart,
  bodyGroupsRelation: IDataToChart,
  cardioWeigthExercisesNumber: IDataToChart,
  bodyGroupsProgression: IBodyGroupProgress,
  timeLabels: string[],
  mostUsedExercises:  IFormattedExercises,

  time: DefaulTimeEnum | "custom",
  startDate: number,
  endDate: number,
  loadingStats: boolean

  // Methods
  loadWorkoutLists: (startDate:  number, endDate: number, defaultTime?: DefaulTimeEnum) => void;
  loadWorkoutCalendar: () => void;
  changeTimePeriod: (defaultTime?: DefaulTimeEnum | "custom", startDate?: number, endDate?: number) => void;
}

export const StatsContext = createContext({} as ContextProps);