import { createContext } from 'react';
import { IPostWorkoutEndpointOut } from '../../axiosApi';
import { IBodyGroup, IRoutine, IRoutineExercise, IRoutineItemParent, IWorkout, IWorkoutExercise, IWorkoutExerciseDivided } from '../../interfaces';

interface ContextProps {
  id: string;
  exercises: IRoutineItemParent[];
  name: string,
  bodyGroups: IBodyGroup[]
  percentage: number;
  startDate: number;
  endDate: number;
  duration: number;
  actualOrder: number;
  workout: IWorkoutExerciseDivided[],
  totalExercises: number;

  openFinishWorkoutDialog: boolean;
  openContinueWorkoutDialog: boolean;

  // Methods
  startWorkout: (routine: IRoutine) => void;
  updateWorkout: () => void;
  updateExerciseParams: (updatedExercise: IWorkoutExerciseDivided) => void;
  updateExerciseTime: (updatedExercise: IWorkoutExerciseDivided) => void;
  handleFinishWorkoutDialog: (open: boolean) => void;
  handleContinueWorkoutDialog: (open: boolean) => void;
  clearWorkout: () => void;
  finishWorkout: () => Promise<IPostWorkoutEndpointOut>;
}

export const WorkoutContext = createContext({} as ContextProps);