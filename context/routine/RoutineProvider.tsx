import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { FC, useEffect, useReducer } from 'react';
import { RoutineContext, routineReducer } from '.';
import { gymApi, IPostRoutineEndpointIn, IRoutineExerciseEndpointIn, IRoutineRestEndpointIn, POST_ROUTINE, PUT_ROUTINE } from '../../axiosApi';
import { IBodyGroup, IRoutine, IRoutineExercise, IErrorResponse, ISerie, IExercise, IRoutineRest, IRoutineCardio, ExerciseType, DefaultParam, ITimeSerie, IRoutineItemParent } from '../../interfaces';
import { basicTimerNumber } from '../../utils/format-time';

export interface RoutineState {
  isLoaded: boolean;
  isEditing: boolean;
  isDialogOpened: boolean;
  id: string;
  name: string;
  email?: string;
  needsEquipment: boolean;
  bodyGroups: IBodyGroup[];
  routine: IRoutineItemParent[];
}

interface errorResponse {
  message: string;
}

interface Props {
  children: React.ReactNode;
}

const ROUTINE_INITIAL_STATE: RoutineState = {
  isLoaded: false,
  isEditing: false,
  isDialogOpened: false,
  id: '',
  name: '',
  email: '',
  needsEquipment: false,
  bodyGroups: [],
  routine: [],
};

const defaultSerie: ITimeSerie = {
  order: 1,
  time: basicTimerNumber,
  reps: 10,
  weight: 10
}

const setRoutineContent = (routineExercise: IRoutineItemParent, index: number): any => {
  switch (routineExercise.itemType) {
    case (ExerciseType.CARDIO_TYPE):
      const addCardio = routineExercise as IRoutineCardio;
      return {
        ...addCardio,
        exercise: addCardio.exercise?._id as string,
        order: index + 1,
        series: addCardio.series?.map((serie: ITimeSerie, serieIndex: number) => {
          return {
            ...serie,
            reps: serie.reps || 10,
            weight: serie.weight || 10,
            order: serieIndex + 1,
            time: serie.time || "00:30"
          };
        }) || [defaultSerie],
        param: addCardio.param || DefaultParam.TIME,
        itemType: addCardio.itemType || ExerciseType.CARDIO_TYPE,
      };
      break;
    case (ExerciseType.REST_TYPE):
      const addRest = routineExercise as IRoutineRest;
      return {
        ...addRest,
        order: index + 1,
        itemType: addRest.itemType || ExerciseType.REST_TYPE,
      };
      break;
    default:
      const addExercise = routineExercise as IRoutineExercise;
      return {
        exercise: addExercise.exercise?._id as string,
        order: index + 1,
        series: addExercise.series?.map((serie: ISerie, serieIndex: number) => {
          return {
            ...serie,
            reps: serie.reps || 10,
            weight: serie.weight || 10,
            order: serieIndex + 1
          };
        }) || [defaultSerie],
        param: addExercise.param || DefaultParam.REPS,
        itemType: addExercise.itemType || ExerciseType.EXERCISE_TYPE,
      };
      break;
  }
};

export const RoutineProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(routineReducer, ROUTINE_INITIAL_STATE);

  useEffect(() => {
    const cookieRoutineId: string = Cookies.get('routine-id') ? Cookies.get('routine-id')! : '';
    if (cookieRoutineId.length > 0) {
      const resp = gymApi.get<IRoutine, any>(`/routines/${cookieRoutineId}`);
      resp.then((routine: IRoutine) => {
        dispatch({ type: '[Routine] - Add name and id to routine', payload: { name: routine.name, id: cookieRoutineId } });
        dispatch({ type: '[Routine] - Load Routine from cookies | storage', payload: routine.routine });
      });
    }
  }, []);

  const addExerciseToRoutine = (exercise: IExercise, series?: ITimeSerie[]) => {
    const addedExercise = {
      exercise,
      order: state.routine.length + 1,
      itemType: exercise.itemType === ExerciseType.CARDIO_TYPE ? ExerciseType.CARDIO_TYPE : ExerciseType.EXERCISE_TYPE,
      param: exercise.defaultParam === DefaultParam.TIME ? DefaultParam.TIME : DefaultParam.REPS,
      series: series || [defaultSerie]
    };
    
    const allExercises: IRoutineExercise[] = [...state.routine, addedExercise] as IRoutineExercise[];
    const payload = allExercises.sort((a, b) => (a?.order! < b?.order! ? -1 : 1));
    console.log(payload);
    
    dispatch({ type: '[Routine] - Update exercises in Routine', payload });
    dispatch({ type: '[Routine] - Reorder Routine Training' });
  };

  const updateExerciseParams = (exercise: IRoutineItemParent) => {
    let updatedExercise;
    switch(exercise.itemType){
      case ExerciseType.REST_TYPE:
        updatedExercise = exercise as IRoutineRest;
        break;
      case ExerciseType.CARDIO_TYPE:
        updatedExercise = exercise as IRoutineCardio;
        break;
      default:
        updatedExercise = exercise as IRoutineExercise;
        break;
    }

    dispatch({ type: '[Routine] - Change exercise params', payload: updatedExercise });
    dispatch({ type: '[Routine] - Reorder Routine Training' });
  };

  const removeExerciseToRoutine = (exercise: IExercise) => {
    dispatch({ type: '[Routine] - Remove exercise in Routine', payload: exercise._id as string });
    dispatch({ type: '[Routine] - Reorder Routine Training' });
  };

  const removeDuplicatedExerciseToRoutine = (exercise: IRoutineItemParent) => {
    dispatch({ type: '[Routine] - Remove duplicated exercise in Routine', payload: exercise });
    dispatch({ type: '[Routine] - Reorder Routine Training' });
  };

  const addRestToRoutine = (rest: IRoutineRest) => {
    dispatch({ type: '[Routine] - Add Rest to Routine', payload: rest });
    dispatch({ type: '[Routine] - Reorder Routine Training' });
  };

  const changeRoutineName = (name: string) => {
    dispatch({ type: '[Routine] - Add name and id to routine', payload: { name, id: state.id } });
  };

  const createRoutine = async (name: string, email: string): Promise<{ status: number, message: string, data?: IRoutine; }> => {
    const resp = await gymApi.post(POST_ROUTINE, { name, email })
      .then(({ data }: AxiosResponse) => {
        dispatch({ type: '[Routine] - Add name and id to routine', payload: { name, id: data._id } });
        dispatch({ type: '[Routine] - Handle Edition Mode', payload: true });

        return { status: 200, data: data.routine as IRoutine, message: data.message };
      })
      .catch((error: AxiosError) => {
        const { response } = error;
        const messageData: IErrorResponse = response?.data as IErrorResponse;

        return { status: response?.status as number, message: messageData.message as string };
      });

    return resp;
  };

  const finishRoutineEdition = async (isSaving: boolean, id: string | string[] | undefined): Promise<{ status: number, data: string; }> => {
    const needsEquipment = state.routine.some(routineExercise => {
      if (routineExercise.itemType !== ExerciseType.REST_TYPE) {
        const { exercise } = routineExercise as IRoutineExercise | IRoutineCardio;
        return exercise.equipment?.name !== 'body weight';
      }
    });

    let routineExercises: IRoutineExerciseEndpointIn[] = [];
    let routineRests: IRoutineRestEndpointIn[] = [];

    state.routine.map((routineExercise: IRoutineItemParent, index: number) => {
      const result = setRoutineContent(routineExercise, index);
      if (result.itemType === ExerciseType.REST_TYPE) {
        routineRests = [...routineRests, result as IRoutineRestEndpointIn];
      } else {
        routineExercises = [...routineExercises, result as IRoutineExerciseEndpointIn];
      }
      return result;
    });


    let exercisesBodyGroups: IBodyGroup[] = []

    state.routine.map(routineExercise => {
      if(routineExercise.itemType !== ExerciseType.REST_TYPE) {
        const { exercise } = routineExercise as IRoutineExercise | IRoutineCardio;
        exercisesBodyGroups = [...exercisesBodyGroups, exercise.target!.bodyGroup as IBodyGroup];
      }
    });
    let filteredBodyGroups: IBodyGroup[] = [];
    exercisesBodyGroups?.filter(bodyGroup => {
      if (bodyGroup && !filteredBodyGroups?.some(group => group?._id === bodyGroup?._id)) {
        filteredBodyGroups.push(bodyGroup);
      }
    });

    const body: IPostRoutineEndpointIn = {
      routine: routineExercises || [],
      rests: routineRests || [],
      name: state.name,
      needsEquipment,
      bodyGroups: filteredBodyGroups
    };

    const params: string | string[] | undefined = id;
    
    if (!isSaving) { closeEditionMode(); return { status: 200, data: "Routine edition cancelled." }; }
    
    const resp = await gymApi.put(PUT_ROUTINE + params, body);

    if (resp.status === 200) {
      return { status: 200, data: "Routine edition was a success." };
    } else {
      return { status: 500, data: "An error happened, please, try again later." };
    }
  };

  const handleEditionDialog = (open: boolean) => {
    dispatch({ type: '[Routine] - Handle Edition Dialog', payload: open });
  };

  const closeEditionMode = () => {
    dispatch({ type: '[Routine] - Handle Edition Mode', payload: false });
    dispatch({ type: '[Routine] - Handle Edition Dialog', payload: false });
  };

  const startRoutineEdition = () => {
    dispatch({ type: '[Routine] - Handle Edition Mode', payload: true });
    dispatch({ type: '[Routine] - Handle Edition Dialog', payload: false });
  };

  const clearRoutineExercises = () => {
    Cookies.remove('routine-id');
    dispatch({ type: '[Routine] - Clear Routine Training' });
  };

  const setRoutineInContext = async (routine: IRoutine) => {
    Cookies.set('routine-id', routine._id!);
    dispatch({ type: '[Routine] - Set Routine in Context', payload: routine });
  };

  const finishEditRoutine = async () => {
    dispatch({ type: '[Routine] - Finish edit Routine'});
  }

  return (
    <RoutineContext.Provider value={{
      ...state,

      // Methods
      createRoutine,
      changeRoutineName,
      addExerciseToRoutine,
      addRestToRoutine,
      removeExerciseToRoutine,
      removeDuplicatedExerciseToRoutine,
      finishRoutineEdition,
      updateExerciseParams,
      handleEditionDialog,
      setRoutineInContext,
      startRoutineEdition,
      clearRoutineExercises,
      finishEditRoutine
    }}>
      {children}
    </RoutineContext.Provider>
  );
};