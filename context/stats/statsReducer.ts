import { StatsState } from '.';
import { IPostWorkoutEndpointIn } from '../../axiosApi';
import { IStartWorkout } from '../../interfaces';
import { DefaulTimeEnum, IBodyGroupProgress, ICalendarWorkout, IDataToChart, IFormattedExercises, IStatWorkout, IWorkoutTime } from '../../interfaces/stats';

interface ILoadStats {
  workouts: IStatWorkout[],
  timeLabels: string[],
  progressInTime: IWorkoutTime[],
  cardioWeightRestRelation: IDataToChart,
  bodyGroupsRelation: IDataToChart,
  cardioWeigthExercisesNumber: IDataToChart,
  bodyGroupsProgression: IBodyGroupProgress,
  mostUsedExercises:  IFormattedExercises,
  time: DefaulTimeEnum | "custom",
  startDate: number,
  endDate: number,
}

type StatsActionType =
  | { type: '[Stats] - Handle loading', payload: { activation: boolean }}
  | { type: '[Stats] - Load Workout list', payload: ILoadStats}
  | { type: '[Stats] - Load Calendar list', payload: ICalendarWorkout[]}
  | { type: '[Stats] - Change Period', payload: {time: DefaulTimeEnum | "custom", startDate?: number, endDate?: number}}

export const statsReducer = (state: StatsState, action: StatsActionType): StatsState => {

  switch (action.type) {
    case '[Stats] - Handle loading':
      return {
        ...state,
        loadingStats: action.payload.activation
      }
    case '[Stats] - Load Workout list':
      return {
        ...state,
        workoutList: action.payload.workouts,
        
        progressInTime: [...action.payload.progressInTime],
        cardioWeightRestRelation: action.payload.cardioWeightRestRelation,
        bodyGroupsRelation: action.payload.bodyGroupsRelation,
        bodyGroupsProgression: action.payload.bodyGroupsProgression,
        cardioWeigthExercisesNumber: action.payload.cardioWeigthExercisesNumber,
        mostUsedExercises:  action.payload.mostUsedExercises,
        timeLabels: [...action.payload.timeLabels],
      
        time: action.payload.time,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    case '[Stats] - Change Period':
      return {
        ...state,
        time: action.payload.time,
        startDate: action.payload.startDate || state.startDate,
        endDate: action.payload.endDate || state.endDate,
      }
    case '[Stats] - Load Calendar list':
      return {
        ...state,
        workoutCalendar: action.payload,
      }
    default:
      return state;
  }

}