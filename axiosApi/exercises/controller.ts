import { NextApiRequest, NextApiResponse } from 'next';
import { BodyGroup, Equipment, Exercise, Target } from './models';
import { IBodyGroup, IEquipment, IExercise, ITarget, defaultParams } from '../../interfaces';
import { db, IGetExercisesEndpointOUT } from '..';
import { jwt } from '../../utils';

export type Data =
  | { message: any }
  | { _id: string }[]
  | IGetExercisesEndpointOUT
  | IExercise
  | ITarget[]
  | IBodyGroup[]
  | IEquipment[]

export type Element = 'target' | 'bodypart' | 'equipment'

export const getExercises = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IGetExercisesEndpointOUT | { message: string }> => {
  const offset = req.query.offset || defaultParams.offset;
  const limit = req.query.limit || defaultParams.limit;

  try {
    await db.connect();
    await jwt.validateJWT(req, res);
    const exercises = await Exercise.find()
      .populate('equipment', 'name')
      .populate({
        path: 'target',
        select: 'name',
        populate: {
          path: 'bodyGroup',
          select: 'name'
        }
      })
      .skip(parseInt(offset as string))
      .limit(parseInt(limit as string))
      .lean();
    const totalCount = await Exercise.count();
    await db.disconnect();

    res.status(200).json({ items: exercises, totalCount });
    return { items: exercises, totalCount };
  } catch (error) {
    res.status(500).json({ message: 'Connection error' });
    return { message: 'Connection error' };
  }
};

export const getBodyGroups = async (req?: NextApiRequest, res?: NextApiResponse<Data>): Promise<IBodyGroup[] | { message: string }> => {
  try {
    await db.connect();
    await jwt.validateJWT(req!, res!);
    const bodyGroups = await BodyGroup.find().select('name').lean();
    await db.disconnect();

    res && res?.status(200).json(bodyGroups);
    return JSON.parse(JSON.stringify(bodyGroups));
  } catch (error) {
    res && res?.status(500).json({ message: 'Connection error' });
    return { message: 'Connection error' };
  }
  
};

export const getExercisesWithFilter = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IGetExercisesEndpointOUT | { message: string }> => {
  const { offset, limit, term } = req.query;
  const { name, bodyGroups, noEquipement } = req.body;
  const searchTerm = req.body ? name : term;

  try {
    await db.connect();
    await jwt.validateJWT(req, res);
    const targets = await getTargetsFiltered(bodyGroups);
    const targetIds = await Promise.all(targets.map(target => target._id));

    const bodyWeight = await Equipment.findOne({ 'name': 'body weight' }).select('_id');

    let query: Object = { 'name': new RegExp(searchTerm, "gi") };

    if (targetIds.length > 0) { query = { ...query, 'target': targetIds } }
    if (noEquipement) { query = { ...query, 'equipment': bodyWeight!.id } }

    const exercises = await Exercise.find(query)
      .populate('equipment', 'name')
      .populate({
        path: 'target',
        select: 'name',
        populate: {
          path: 'bodyGroup',
          select: 'name'
        }
      })
      .skip(parseInt(offset as string))
      .limit(parseInt(limit as string))
      .lean();

    const totalCount = await Exercise.find(query).count();

    await db.disconnect();

    res.status(200).json({ items: exercises, totalCount });
    return { items: exercises, totalCount };
  } catch (error) {
    res.status(500).json({ message: 'Connection error' });
    return { message: 'Connection error' };
  }
};


// Static & SSR  calls
export const getExercisesStatic = async (): Promise<IGetExercisesEndpointOUT> => {
  const { offset, limit } = defaultParams;
  await db.connect();
  const exercises = await Exercise.find()
    .populate('equipment', 'name')
    .populate({
      path: 'target',
      select: 'name',
      populate: {
        path: 'bodyGroup',
        select: 'name'
      }
    })
    .skip(offset)
    .limit(limit)
    .lean();
  const totalCount = await Exercise.count();
  await db.disconnect();

  return { items:  JSON.parse(JSON.stringify(exercises)), totalCount };
};

export const getExerciseById = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IExercise | null | any> => {
  await db.connect();
  const { id } = req.query;
  const exercise: IExercise | null | any = await Exercise
    .findById(id)    
    .populate('equipment', 'name')
    .populate({
      path: 'target',
      select: 'name',
      populate: {
        path: 'bodyGroup',
        select: 'name'
      }
    })
    .lean()
    
  await db.disconnect();
  
  res.status(200).json(exercise);
};

export const getExerciseIds = async (): Promise<{ _id: string }[]> => {
  await db.connect();
  const ids = await Exercise.find().select('_id').lean();
  await db.disconnect();
  return ids as { _id: string}[];
};

export const getExercisesByTerm = async (term: string): Promise<IGetExercisesEndpointOUT> => {

  term = term.toString().toLowerCase();
  const { limit, offset } = defaultParams;

  await db.connect();

  const exercises = await Exercise.find({
    'name': new RegExp(term, "gi")
  })
    .populate('equipment', 'name')
    .populate({
      path: 'target',
      select: 'name',
      populate: {
        path: 'bodyGroup',
        select: 'name'
      }
    })
    .skip(parseInt(offset.toString()))
    .limit(parseInt(limit.toString()))
    .lean();

  const totalCount = await Exercise.find({
    'name': new RegExp(term, "gi")
  }).count();

  const items = JSON.parse(JSON.stringify(exercises));

  await db.disconnect();

  return { items, totalCount };
};

// Aux Methods
const getTargetsFiltered = async (bodyGroups: any): Promise<ITarget[]> => {
  const bodyGroupsIds = await Promise.all(bodyGroups.map((bodyGroup: IBodyGroup) => bodyGroup._id));

  const targets = await Target.find({
    $or: [
      { 'bodyGroup': bodyGroupsIds }
    ]
  }).select('_id').lean();

  return targets;
};