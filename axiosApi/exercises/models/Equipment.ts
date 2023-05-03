import mongoose, { Schema, model, Model } from 'mongoose';
import { IEquipment } from '../../../interfaces';


const equipmentSchema = new Schema({
  name: { type: String, required: true },
},{
  timestamps: true
});



const Equipment: Model<IEquipment> = mongoose.models?.Equipment || model('Equipment', equipmentSchema );


export default Equipment;