import mongoose, { Schema, model, Model } from 'mongoose';
import { IRoutineRest, IWorkoutExerciseDivided } from '../../../interfaces';
import { IPostWorkoutEndpointIn, IPostWorkoutSerieEndpointIn } from '../interfaces';

const workoutSchema = new Schema({
  routine: { type: Schema.Types.ObjectId, ref: 'Routine' },
  workout: [{ type: {
    exercise: { type:Schema.Types.ObjectId, ref: 'Exercise' },
    itemType: {type: String},
    param: {type: String},
    series: { type: Array<IPostWorkoutSerieEndpointIn> }
  }}],
  rests: { type: Array<IRoutineRest> },
  percentage: { type: Number },
  startDate: { type: Number },
  endDate: { type: Number },
  duration: { type: Number },
  totalReps: { type: Number },
  totalWeight: { type: Number },
  cardioTime: { type: Number },
  restTime: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Workout: Model<IPostWorkoutEndpointIn> = mongoose.models?.Workout || model('Workout', workoutSchema);

export default Workout;