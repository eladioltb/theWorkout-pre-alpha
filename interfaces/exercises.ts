export interface IExercise {
  _id?: string,
  equipment: IEquipment;
  gifUrl: string;
  name: string;
  target: ITarget;
  bodyGroup: IBodyGroup;
  itemType: ExerciseType;
  defaultParam: DefaultParam;
}

export interface ITarget {
  _id: string,
  name: 'abductors' | 'abs' | 'adductors' | 'biceps' | 'calves' | 'cardiovascular system' | 'delts' | 'forearms' | 'glutes' | 'hamstrings' | 'lats' | 'levator scapulae' | 'pectorals' | 'quads' | 'serratus anterior' | 'spine' | 'traps' | 'triceps' | 'upper bac',
  bodyGroup: IBodyGroup;
}
export interface IBodyGroup {
  _id: string,
  name: 'back' | 'cardio' | 'chest' | 'lower arms' | 'lower legs' | 'neck' | 'shoulders' | 'upper arms' | 'upper legs' | 'waist'
}

export interface IEquipment {
  name: 'assisted' | 'band' | 'barbell' | 'body weight' | 'bosu ball' | 'cable' | 'dumbbell' | 'elliptical machine' | 'ez barbell' | 'hammer' | 'kettlebell' | 'leverage machine' | 'medicine ball' | 'olympic barbell' | 'resistance band' | 'roller' | 'rope' | 'skierg machine' | 'sled machine' | 'smith machine' | 'stability ball' | 'stationary bike' | 'stepmill machine' | 'tire' | 'trap bar' | 'upper body ergometer' | 'weighted' | 'wheel rolle'
}

export enum ExerciseType {
  EXERCISE_TYPE = 'exercise',
  REST_TYPE = 'rest',
  CARDIO_TYPE = 'cardio'
}

export enum DefaultParam {
  REPS = 'reps',
  TIME = 'time',
}