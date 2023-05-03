import mongoose, { Schema, model, Model } from 'mongoose';
import { IExercise } from '../../../interfaces';

const exerciseSchema = new Schema({
  name: { type: String, required: true },
  gifUrl: { type: String },
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
  target: { type: Schema.Types.ObjectId, ref: 'Target', required: true },
  itemType: { type: String },
  defaultParam: { type: String }
}, {
  timestamps: true
});

exerciseSchema.index({ name: 'text' });

const Exercise: Model<IExercise> = mongoose?.models?.Exercise || model('Exercise', exerciseSchema);

export default Exercise;