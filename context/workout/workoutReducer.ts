import { WorkoutState } from '.';
import { IStartWorkout, IWorkout } from '../../interfaces';


type WorkoutActionType =
  | { type: '[Workout] - Start workout', payload: IStartWorkout }
  | { type: '[Workout] - Update workout', payload: { actualOrder: number, percentage: number }}
  | { type: '[Workout] - Update exercise params', payload: { order: number, completedWeight: number, completedReps: number }}
  | { type: '[Workout] - Update time', payload: { order: number, completedTime: number }}
  | { type: '[Workout] - Handle finish dialog', payload: { open: boolean } }
  | { type: '[Workout] - Handle continue dialog', payload: { open: boolean, workoutId: string } }
  | { type: '[Workout] - Clear Workout' }

export const workoutReducer = (state: WorkoutState, action: WorkoutActionType): WorkoutState => {

  switch (action.type) {
    case '[Workout] - Start workout':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        exercises: action.payload.exercises,
        bodyGroups: action.payload.bodyGroups,
        startDate: Date.now(),
        workout: action.payload.workout,
        totalExercises: action.payload.totalExercises,
        actualOrder: action.payload.actualOrder
      }
    case '[Workout] - Update workout':
      return {
        ...state,
        actualOrder: action.payload.actualOrder,
        percentage: action.payload.percentage
      }
    case '[Workout] - Handle finish dialog':
      return {
        ...state,
        openFinishWorkoutDialog: action.payload.open
      }
    case '[Workout] - Handle continue dialog':
      return {
        ...state,
        id: action.payload.workoutId,
        openContinueWorkoutDialog: action.payload.open
      }
    case '[Workout] - Update exercise params':
      return {
        ...state,
        workout: state.workout.map((exercise) => {
          if(exercise.orderInWorkout === action.payload.order) {
            return { ...exercise, completedReps: action.payload.completedReps, completedWeight: action.payload.completedWeight, percentage: action.payload.completedWeight * action.payload.completedReps * 100 / (exercise.weight! * exercise.reps!) }
          } else {
            return exercise;
          }
        })
      }
    case '[Workout] - Update time':
      return {
        ...state,
        workout: state.workout.map((exercise) => {
          if(exercise.orderInWorkout === action.payload.order) {
            return { 
              ...exercise,
              completedTime: action.payload.completedTime,
              percentage: action.payload.completedTime * 100 / exercise.time!
            }
          } else {
            return exercise;
          }
        })
      }
    case '[Workout] - Clear Workout':
      return {
        ...state,
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
      }
    default:
      return state;
  }

}