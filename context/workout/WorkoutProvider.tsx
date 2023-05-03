import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'path';
import { FC, useEffect, useReducer } from 'react';
import { workoutReducer, WorkoutContext } from '.';
import { gymApi, IPostWorkoutSerieEndpointIn, IPostWorkoutTrainingEndpointIn, IRoutineRestEndpointIn, POST_WORKOUT } from '../../axiosApi';
import { ExerciseType, IBodyGroup, IErrorResponse, IRoutine, IRoutineCardio, IRoutineExercise, IRoutineItemParent, IRoutineRest, IStartWorkout, IWorkoutExercise, IWorkoutExerciseDivided } from '../../interfaces';
import { timeFormat } from '../../utils';
import { basicTimerNumber } from '../../utils/format-time';

export interface WorkoutState {
  id: string;
  exercises: IRoutineItemParent[];
  workout: IWorkoutExerciseDivided[],
  name: string,
  bodyGroups: IBodyGroup[];
  percentage: number;
  startDate: number;
  endDate: number;
  duration: number;
  actualOrder: number;
  totalExercises: number;
  openFinishWorkoutDialog: boolean;
  openContinueWorkoutDialog: boolean;
}

interface errorResponse {
  message: string;
}

interface Props {
  children: React.ReactNode;
}

const WORKOUT_INITIAL_STATE: WorkoutState = {
  id: '',
  exercises: [],
  workout: [],
  bodyGroups: [],
  name: '',
  percentage: 0,
  startDate: 0,
  endDate: 0,
  duration: 0,
  actualOrder: 1,
  totalExercises: 0,
  openFinishWorkoutDialog: false,
  openContinueWorkoutDialog: false,
};

const filterExercises = (routine: IRoutine): IWorkoutExerciseDivided[] => {

  let workoutExercises: any = [];
  routine.routine.map(exercise => {
    switch (exercise.itemType) {
      case ExerciseType.EXERCISE_TYPE:
        const exerciseToFilter = exercise as IRoutineExercise;
        exerciseToFilter.series.map(serie => {
          const newExercise = {
            order: exerciseToFilter.order as number,
            series: exerciseToFilter.series,
            name: exerciseToFilter.exercise?.name || '',
            bodyGroups: exerciseToFilter.exercise?.target!.bodyGroup,
            _id: exerciseToFilter.exercise._id,
            equipment: exerciseToFilter.exercise.equipment,
            gifUrl: exerciseToFilter.exercise.gifUrl,
            target: exerciseToFilter.exercise.target,
            itemType: exerciseToFilter.itemType,
            param: exerciseToFilter.param,
            totalSeries: exerciseToFilter.series.length,
            orderSeries: serie.order,
            weight: serie.weight,
            reps: serie.reps,
            completedReps: serie.reps,
            completedWeight: serie.weight,
            percentage: 100,
            orderInWorkout: workoutExercises.length + 1,
          };
          workoutExercises = [
            ...workoutExercises,
            newExercise
          ];
        });
        break;
      case ExerciseType.CARDIO_TYPE:
        const cardioToFilter = exercise as IRoutineCardio;
        cardioToFilter.series.map(serie => {
          const newExercise = {
            order: cardioToFilter.order as number,
            series: cardioToFilter.series,
            name: cardioToFilter.exercise?.name || '',
            bodyGroups: cardioToFilter.exercise.target!.bodyGroup,
            _id: cardioToFilter.exercise._id,
            equipment: cardioToFilter.exercise.equipment,
            gifUrl: cardioToFilter.exercise.gifUrl,
            target: cardioToFilter.exercise.target,
            itemType: cardioToFilter.itemType,
            param: cardioToFilter.param,
            totalSeries: cardioToFilter.series.length,
            orderSeries: serie.order,
            weight: serie.weight,
            reps: serie.reps,
            completedReps: serie.reps,
            completedWeight: serie.weight,
            percentage: 100,
            orderInWorkout: workoutExercises.length + 1,
            time: serie.time
          };
          workoutExercises = [
            ...workoutExercises,
            newExercise
          ];
        });
        break;
      case ExerciseType.REST_TYPE:
        const restToFilter = exercise as IRoutineRest;
        const newRest = {
          order: restToFilter.order as number,
          name: "Rest",
          itemType: restToFilter.itemType,
          completedReps: 0,
          percentage: 0,
          orderInWorkout: workoutExercises.length + 1,
          time: restToFilter.time
        };
        workoutExercises = [
          ...workoutExercises,
          newRest
        ];
        break;
    }
  })
  return workoutExercises;
};

export const WorkoutProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(workoutReducer, WORKOUT_INITIAL_STATE);

  useEffect(() => {
    const id = Cookies.get('workout-id');
    if (id !== undefined && id.length > 0) {
      handleContinueWorkoutDialog(true, id);
    }
  }, []);


  const startWorkout = (routineToWorkout: IRoutine) => {
    const { _id, routine, bodyGroups, name } = routineToWorkout;
    let workoutExercises: IWorkoutExerciseDivided[] = filterExercises(routineToWorkout);
    
    const newWorkout: IStartWorkout = {
      id: _id as string,
      name,
      bodyGroups: bodyGroups || [],
      exercises: routine as IRoutineItemParent[],
      workout: Cookies.get('workout-exercises') ? JSON.parse(Cookies.get('workout-exercises') as string) : workoutExercises,
      totalExercises: workoutExercises.length,
      actualOrder: Cookies.get('workout-order') ? parseInt(Cookies.get('workout-order') as string) : 1,
      startDate: Cookies.get('workout-startdate') ? parseInt(Cookies.get('workout-startdate') as string) : Date.now(),
    };


    const updatePercentage = (newWorkout.actualOrder - 1) * 100 / newWorkout.totalExercises;
    Cookies.set('workout-id', _id as string);
    Cookies.set('workout-exercises', JSON.stringify(workoutExercises));
    Cookies.set('workout-startdate', JSON.stringify(Date.now()));

    dispatch({ type: '[Workout] - Update workout', payload: { percentage: updatePercentage, actualOrder: newWorkout.actualOrder } });
    dispatch({ type: '[Workout] - Start workout', payload: newWorkout });
  };

  const updateWorkout = () => {
    // Update Cookies
    Cookies.set('workout-order', JSON.stringify(state.actualOrder + 1));

    const updatePercentage = state.actualOrder * 100 / state.totalExercises;
    Cookies.set('workout-exercises', JSON.stringify(state.workout));
    dispatch({ type: '[Workout] - Update workout', payload: { percentage: updatePercentage, actualOrder: state.actualOrder + 1 } });
  };

  const updateExerciseParams = (updatedExercise: IWorkoutExerciseDivided) => {
    dispatch({ type: '[Workout] - Update exercise params', payload: { order: updatedExercise.orderInWorkout!, completedReps: updatedExercise.completedReps as number, completedWeight: updatedExercise.completedWeight as number } });
  };

  const updateExerciseTime = (updatedExercise: IWorkoutExerciseDivided) => {
    dispatch({ type: '[Workout] - Update time', payload: { order: updatedExercise.orderInWorkout!, completedTime: updatedExercise.completedTime! } });
  }

  const finishWorkout = async(): Promise<any> => {
    const percentage = state.actualOrder * 100 / state.totalExercises;
    const endDate = Date.now();
    const duration = endDate - state.startDate;

    let totalReps = 0;
    let totalWeight = 0;
    let cardioTime = 0;
    let restTime = 0;

    state.workout.map((exercise) => {
      if (exercise.itemType === ExerciseType.EXERCISE_TYPE) {
        totalReps += exercise.completedReps!;
        totalWeight += exercise.completedWeight!;
      }

      if(exercise.itemType === ExerciseType.REST_TYPE) {
        restTime =+ exercise.time!
      }
      if(exercise.itemType === ExerciseType.CARDIO_TYPE) {
        cardioTime =+ exercise.time!
      }
    });

    let workout: IPostWorkoutTrainingEndpointIn[] = [];
    let rests: IRoutineRestEndpointIn[] = [];
    
    for (let index = 1; index <= state.exercises.length; index++) {
      let series: IPostWorkoutSerieEndpointIn[] = []
      state.workout.map(indexedExercise => {
        if(indexedExercise.order === index) {
          switch(indexedExercise.itemType){
            case ExerciseType.REST_TYPE:
              const rest: IRoutineRestEndpointIn = {
                order: indexedExercise.order,
                itemType: indexedExercise.itemType,
                time: indexedExercise.time!
              } 
              rests = [
                ...rests, rest
              ]
              break;
            default:
              const serie: IPostWorkoutSerieEndpointIn = {
                order: indexedExercise.orderSeries,
                reps: indexedExercise.reps || 10,
                completedReps: indexedExercise.completedReps || 10,
                time: indexedExercise.time || basicTimerNumber,
                completedTime: indexedExercise.completedTime || basicTimerNumber,
                weigth: indexedExercise.weight || 10,
                completedWeight: indexedExercise.completedWeight || 10,
              }
              series = [...series, serie]
              const exercise: IPostWorkoutTrainingEndpointIn = {
                exercise: indexedExercise._id,
                itemType: indexedExercise.itemType,
                param: indexedExercise.param,
                series: series,
                totalSeries: indexedExercise.totalSeries
              }
              workout = [...workout, exercise]
          }
        }
      })
    }

    workout = workout.filter(exercise => 
      exercise.totalSeries === exercise.series.length && exercise
    )

    const workoutToSave = { ...state, duration, endDate, percentage, totalReps, totalWeight, restTime, cardioTime, workout, rests };
    clearWorkout();
    await gymApi.post(POST_WORKOUT, workoutToSave)
      .then(({ data }: AxiosResponse) => {
        return { data, status: 200 };
      })
      .catch((error: AxiosError) => {
        const { response } = error;
        const messageData: IErrorResponse = response?.data as IErrorResponse;

        return { status: response?.status as number, message: messageData };
      });
  };

  const handleFinishWorkoutDialog = (open: boolean) => {
    dispatch({ type: '[Workout] - Handle finish dialog', payload: { open } });
  };

  const handleContinueWorkoutDialog = (open: boolean, workoutId?: string) => {
    const id = workoutId || '';
    dispatch({ type: '[Workout] - Handle continue dialog', payload: { open, workoutId: id } });
  };

  const clearWorkout = () => {
    Cookies.remove('workout-id');
    Cookies.remove('workout-order');
    Cookies.remove('workout-startdate');
    Cookies.remove('workout-exercises');
    dispatch({ type: '[Workout] - Clear Workout' });
  };

  return (
    <WorkoutContext.Provider value={{
      ...state,

      // Methods
      startWorkout: startWorkout,
      updateWorkout,
      handleFinishWorkoutDialog,
      handleContinueWorkoutDialog,
      clearWorkout,
      finishWorkout,
      updateExerciseParams,
      updateExerciseTime
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};