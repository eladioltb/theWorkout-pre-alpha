import mongoose, { Schema, model, Model } from 'mongoose';
import { IRoutine, ISerie, ITimeSerie } from '../../../interfaces';
import { IRoutineRestEndpointIn } from '../interfaces';

const routineSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  bodyGroups: [{ type: Schema.Types.ObjectId, ref: 'BodyGroup' }],
  needsEquipment: { type: Boolean, default: false },
  routine: [{ type: {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    order: { type: Number, required: true},
    series: { type: Array<ITimeSerie>, required: true},
    param: { },
    itemType: { }
  }}],
  rests: { type: Array<IRoutineRestEndpointIn> }
},{
  timestamps: true
});

routineSchema.index({ name: 'text'});

const Routine: Model<IRoutine> = mongoose.models?.Routine || model('Routine', routineSchema );

export default Routine;