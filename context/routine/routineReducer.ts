import { RoutineState } from '.';
import { IRoutine, IRoutineCardio, IRoutineExercise, IRoutineItemParent, IRoutineRest } from '../../interfaces';


type RoutineActionType =
  | { type: '[Routine] - Add name to routine', payload: string }
  | { type: '[Routine] - Add name and id to routine', payload: { name: string, id: string } }
  | { type: '[Routine] - Handle Edition Dialog', payload: boolean }
  | { type: '[Routine] - Handle Edition Mode', payload: boolean }
  | { type: '[Routine] - Load Routine from cookies | storage', payload: IRoutineExercise[] | IRoutineRest[] | IRoutineCardio[] }
  | { type: '[Routine] - Add Rest to Routine', payload: IRoutineRest }
  | { type: '[Routine] - Update exercises in Routine', payload: IRoutineItemParent[] }
  | { type: '[Routine] - Change exercise params', payload: IRoutineExercise | IRoutineRest | IRoutineCardio }
  | { type: '[Routine] - Remove exercise in Routine', payload: string }
  | { type: '[Routine] - Remove duplicated exercise in Routine', payload: IRoutineItemParent }
  | { type: '[Routine] - Finish edit Routine' }
  | { type: '[Routine] - Clear Routine Training' }
  | { type: '[Routine] - Reorder Routine Training' }
  | { type: '[Routine] - Set Routine in Context', payload: IRoutine }


export const routineReducer = (state: RoutineState, action: RoutineActionType): RoutineState => {

  switch (action.type) {
    case '[Routine] - Add name to routine':
      return {
        ...state,
        name: action.payload
      }
    case '[Routine] - Add name and id to routine':
      return {
        ...state,
        name: action.payload.name,
        id: action.payload.id
      }
    case '[Routine] - Handle Edition Dialog':
      return {
        ...state,
        isDialogOpened: action.payload
      }
    case '[Routine] - Handle Edition Mode':
      return {
        ...state,
        isEditing: action.payload
      }
    case '[Routine] - Add Rest to Routine':
      return {
        ...state,
        routine: [ ...state.routine, action.payload]
      }
    case '[Routine] - Load Routine from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        routine: action.payload as IRoutineExercise[] || [],
      }
    case '[Routine] - Update exercises in Routine':
      console.log(action.payload);
      
      return {
        ...state,
        routine: [...action.payload]
      }
    case '[Routine] - Change exercise params':
      return {
        ...state,
        routine: state.routine.map(exercise => exercise.order === action.payload.order ? action.payload : exercise)
      }
    case '[Routine] - Remove exercise in Routine':
      const filteredRoutine = state.routine as IRoutineExercise[];
      return {
        ...state,
        routine: filteredRoutine.filter(exercise => !(exercise.exercise!._id === action.payload)) as IRoutineItemParent[]
      }
    case '[Routine] - Remove duplicated exercise in Routine':
      return {
        ...state,
        routine: state.routine.filter(exercise => !(exercise.order === action.payload.order))
      }
    case '[Routine] - Finish edit Routine':
      return {
        ...state,
        routine: [],
        isEditing: false,
        needsEquipment: false,
        bodyGroups: [],
        isDialogOpened: false
      }
    case '[Routine] - Clear Routine Training':
      return {
        ...state,
        routine: []
      }
    case '[Routine] - Reorder Routine Training':
      const routineToOrder = [...state.routine as IRoutineExercise[]];
      return {
        ...state,
        routine: routineToOrder.map((exercise, index) => { return {...exercise, order: index + 1, series: exercise.series?.map((serie, serieIndex) => { return { ...serie, order: serieIndex + 1 } })} })
      }
    case '[Routine] - Set Routine in Context':
      return {
        ...state,
        routine: action.payload.routine,
        needsEquipment: action.payload.needsEquipment || false,
        name: action.payload.name,
        id: action.payload._id || ''
      }

    default:
      return state;
  }

}