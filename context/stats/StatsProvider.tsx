import { FC, useEffect, useReducer, useContext } from 'react';
import { StatsContext, statsReducer } from '.';
import { gymApi } from '../../axiosApi';
import { GET_CALENDAR, GET_STATS } from '../../axiosApi/stats';
import { DefaulTimeEnum, IBodyGroupProgress, ICalendarWorkout, IDataToChart, IFormattedExercises, IStatWorkout, IWorkoutTime } from '../../interfaces/stats';
import { AuthContext } from '../auth';

export interface StatsState {
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
}

const STATS_INITIAL_STATE: StatsState = {
  workoutList: [],
  workoutCalendar: [],
  progressInTime: [],
  cardioWeightRestRelation: {data: [], labels: []},
  bodyGroupsRelation: {data: [], labels: []},
  cardioWeigthExercisesNumber: {data: [], labels: []},
  bodyGroupsProgression: {data: [], labels: []},
  mostUsedExercises: {weightFormattedExercises: [], cardioFormattedExercises: []},
  timeLabels: [],

  time: DefaulTimeEnum.WEEK,
  startDate: 0,
  endDate: 0,
  loadingStats: true
};

interface Props {
  children: React.ReactNode;
}

export const StatsProvider: FC<Props> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [state, dispatch] = useReducer(statsReducer, STATS_INITIAL_STATE);

  useEffect(() => {
    if(isLoggedIn) {
      if(state.workoutList?.length <= 0) loadWorkoutLists(0, 0, DefaulTimeEnum.WEEK)
      if(state.workoutCalendar?.length <= 0) loadWorkoutCalendar()
    }
  }, [])

  useEffect(() => {
    if(isLoggedIn) {
      loadWorkoutLists(state.startDate, state.endDate, state.time);
    }
  }, [state.time, state.startDate, state.endDate])
  
  

  const loadWorkoutLists = async(startDate: number, endDate: number, defaultTime?: DefaulTimeEnum | "custom") => {
    dispatch({type: '[Stats] - Handle loading', payload: { activation: true }});
    const defaultTimeInput: DefaulTimeEnum | "custom" = (!defaultTime && startDate === 0) ? DefaulTimeEnum.WEEK  : defaultTime!;
    const body = {
      startDate: startDate === 0 ? state.startDate : startDate,
      endDate: endDate === 0 ? state.endDate : endDate,
      defaultTime: defaultTimeInput
    }
    const { data } = await gymApi.post(GET_STATS, body);
    
    const payload = {
      workouts: data.response.workouts,
      timeLabels: data.response.progressInTime.labels,
      progressInTime: data.response.progressInTime.data,
      cardioWeightRestRelation: data.response.cardioWeightRestRelation,
      bodyGroupsRelation: data.response.bodyGroupsRelation,
      cardioWeigthExercisesNumber: data.response.cardioWeigthExercisesNumber,
      bodyGroupsProgression: data.response.bodyGroupsProgression,
      mostUsedExercises: data.response.mostUsedExercises,
      time: defaultTimeInput,
      startDate: body.startDate,
      endDate: body.endDate,
    }
    
    dispatch({type: '[Stats] - Load Workout list', payload });
    dispatch({type: '[Stats] - Handle loading', payload: { activation: false }});
  }

  const changeTimePeriod = async(defaultTime?: DefaulTimeEnum | "custom", startDate?: number, endDate?: number) => {
    const payload = {
      time: defaultTime || "custom",
      startDate: startDate,
      endDate: endDate
    }

    dispatch({type: '[Stats] - Change Period', payload });
  }

  const loadWorkoutCalendar = async() => {
    const { data } = await gymApi.get(GET_CALENDAR);
    const payload = data.workoutCalendar;
    dispatch({type: '[Stats] - Load Calendar list', payload})
    
  }

  return (
    <StatsContext.Provider value={{
      ...state,

      // Methods
      loadWorkoutLists,
      changeTimePeriod,
      loadWorkoutCalendar
    }}>
      {children}
    </StatsContext.Provider>
  );
};