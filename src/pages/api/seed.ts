import type { NextApiRequest, NextApiResponse } from 'next';
import { BodyGroup, db, Equipment, Exercise, seedData, Target, User, Workout } from '../../../axiosApi';
import { DefaultParam, ExerciseType } from '../../../interfaces';
import { jwt } from '../../../utils';

type Data = { message: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'Forbidden API' });
  }

  await jwt.canAccess(req, res, '');

  await db.connect();

  // Deleting all data
  await Exercise.deleteMany();
  await Equipment.deleteMany();
  await Target.deleteMany();
  await BodyGroup.deleteMany();
  await BodyGroup.deleteMany();
  await User.deleteMany();
  await Workout.deleteMany();

  // Creating Equipement
  await Equipment.insertMany(seedData.initialEquipmentData, {});

  // Creating BodyGroups
  await BodyGroup.insertMany(seedData.initialBodyGroupData);
  
  // Creating Users
  await User.insertMany(seedData.initialUserData);
  
  // Creating Target
  await Promise.all(seedData.initialTargetData.map(async (target) => {
    const bodyGroupId = await BodyGroup.findOne({ name: target.bodyGroup }).select('_id').lean();
    const newTarget = new Target({ name: target.name, bodyGroup: bodyGroupId });
    await newTarget.save();
  }));

  // Creating Types
  await Promise.all(seedData.initialTargetData.map(async (target) => {
    const bodyGroupId = await BodyGroup.findOne({ name: target.bodyGroup }).select('_id').lean();
    const newTarget = new Target({ name: target.name, bodyGroup: bodyGroupId });
    await newTarget.save();
  }));


  // Creating Exercises
  await Promise.all(seedData.initialExerciseData.map(async (exercise) => {
    const targetId = await Target.findOne({ name: exercise.target }).select('_id');
    const equipmentId = await Equipment.findOne({ name: exercise.equipment }).select('_id');
    const itemType = exercise.target === "cardiovascular system" ? ExerciseType.CARDIO_TYPE : ExerciseType.EXERCISE_TYPE;
    const defaultParam = exercise.target === "cardiovascular system" ? DefaultParam.TIME : DefaultParam.REPS
    const newExercise = new Exercise({ ...exercise, target: targetId, equipment: equipmentId, itemType, defaultParam });
    await newExercise.save();
  }));

  await db.disconnect();


  res.status(200).json({ message: 'Database seed creation completed' });
}