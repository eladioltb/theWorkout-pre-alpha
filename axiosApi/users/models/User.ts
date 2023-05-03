import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../../../interfaces';

const userSchema = new Schema({
  name    : {type: String, required: true },
  email   : {type: String, required: true, unique: true },
  password: {type: String, required: true },
  role    : {
    type: String,
    enum: {
      values: ['admin', 'user', 'trainner'],
      message: "{VALUE} it's not a valid role",
      default: 'user',
      required: true
    }
  },
  isPro   : {
    type: Boolean,
    enum : {
      values: [true, false],
      message: "{VALUE} it's not a valid boolean value",
      default: false,
      required: true
    }
  },
  image: {type: String},
  massUnit: {
    type: String,
    enum: {
      values: ['kg', 'lbs'],
      message: "{VALUE} it's not a valid mass unit",
      default: 'kg'
    }
  },
  metricUnit: {
    type: String,
    enum: {
      values: ['cm', 'in'],
      message: "{VALUE} it's not a valid metric unit",
      default: 'cm'
    }
  },
  metrics: {
    height   : {type: Number},
    weight   : {type: Array<Number>}
  }
}, {
  timestamps: true
});

const User:Model<IUser> = mongoose?.models?.User || model('User', userSchema);

export default User;