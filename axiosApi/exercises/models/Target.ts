import mongoose, { Schema, model, Model } from 'mongoose';
import { ITarget } from '../../../interfaces';
import { bodyGroupSchema } from './BodyGroup';


const targetSchema = new Schema({
  name: { type: String, required: true },
  bodyGroup: { type: Schema.Types.ObjectId, ref: 'BodyGroup', required: true },
},{
  timestamps: true
});



const Target: Model<ITarget> = mongoose.models?.Target || model('Target', targetSchema );


export default Target;