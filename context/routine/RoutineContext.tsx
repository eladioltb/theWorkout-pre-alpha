

import { createContext } from 'react';
import { IBodyGroup, IRoutineCardio, IExercise, IRoutineRest, IRoutine, IRoutineExercise, IRoutineItemParent, ITimeSerie } from '../../interfaces';


interface ContextProps {
  isEditing: boolean;
  isLoaded: boolean;
  isDialogOpened: boolean;
  routine: IRoutineItemParent[];
  id: string;
  name: string;
  email?: string;
  needsEquipment: boolean;
  bodyGroups: IBodyGroup[];

  // Methods
  createRoutine: (name: string, email: string) => Promise<{ status: number, data?: IRoutine, message: string }>;
  changeRoutineName: (name: string) => void;
  addExerciseToRoutine: (exercise: IExercise, series?: ITimeSerie[]) => void;
  addRestToRoutine: (rest: IRoutineRest) => void;
  updateExerciseParams: (exercise: IRoutineItemParent) => void;
  removeExerciseToRoutine: (exercise: IExercise) => void;
  removeDuplicatedExerciseToRoutine: (exercise: IRoutineItemParent) => void;
  startRoutineEdition: () => void;
  setRoutineInContext: (routine: IRoutine) => void;
  finishRoutineEdition: (isSaving: boolean, id: string | string[] | undefined) => Promise<{ status: number, data: string }>;
  handleEditionDialog: (open: boolean) => void;
  clearRoutineExercises: () => void;
  finishEditRoutine: () => void;
}


export const RoutineContext = createContext({} as ContextProps);