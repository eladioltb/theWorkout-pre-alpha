import mongoose, { Schema, model, Model } from 'mongoose';
import { IBodyGroup } from '../../../interfaces';


export const bodyGroupSchema = new Schema({
  name: { type: String, required: true },
},{
  timestamps: true
});



const BodyGroup: Model<IBodyGroup> = mongoose.models?.BodyGroup || model('BodyGroup', bodyGroupSchema );


export default BodyGroup;