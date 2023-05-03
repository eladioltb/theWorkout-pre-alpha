import { NextApiRequest, NextApiResponse } from 'next';
import { db, IGetRoutinesEndpointOut, IPostRoutinesEndpointOut } from '..';
import { IRoutine, IRoutineExercise } from '../../interfaces';
import { jwt } from '../../utils';
import { validateJWT } from '../../utils/jwt';
import { Routine } from './models';

export type Data =
  | { message: any }
  | IRoutine
  | IGetRoutinesEndpointOut

export type Element = 'target' | 'bodypart' | 'equipment'

export const getRoutines = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IGetRoutinesEndpointOut | { message: string }> => {
  try {
    await db.connect();
    const { id } = await validateJWT(req, res);
    
    const routines = await Routine.find({createdBy: id}).populate(
      'bodyGroups', 'name'
    )
    .populate('routine', '_id')
    .lean();
    
    const totalCount = routines.length;
    await db.disconnect();

    res.status(200).json({ items: routines, totalCount });
    return { items: routines,totalCount };
  } catch (error) {
    res.status(500).json({ message: 'Connection error' });
    return { message: 'Connection Error' };
  }

};

export const postRoutine = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<IPostRoutinesEndpointOut | { message: string }> => {
  const { name } = req.body;

  try {
    await db.connect();
    await jwt.validateJWT(req, res);
    const user = await validateJWT(req, res);
    const createdBy = user.id;
    const routines = await Routine.find({ name, createdBy });
    
    if (routines.length > 0) {
      res.status(400).json({ message: `Your already have a training routine called ${name}` });
      return { message: `Your already have a training routine called ${name}` };
    }

    const newRoutine = new Routine({ name, createdBy });
    const dbRoutine = await newRoutine.save();
    await db.disconnect();

    res.status(200).json({ routine: dbRoutine, message: "Routine created successfully"});
    return { routine: newRoutine, message: "Routine created successfully"};

  } catch (error) {
    res.status(500).json({ message: 'Error creating new routine' });
    return { message: 'Error creating new routine' };
  }
};

export const getRoutineDetail = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IRoutine | { message: string }> => {
  const { id } = req.query ;
  
  try {
    await db.connect();
    const routine = await Routine.findById(id)
    .populate(
      'bodyGroups', 'name'
      )
      .populate('routine.exercise')
      .populate({
        path: 'routine.exercise',
        populate: {
          path: 'target',
          populate: {
            path: 'bodyGroup',
          }
        }
      })
      .lean();
      
    if (!routine) {
      res?.status(404).json({ message: `This routine does not exist.` });
      return { message: `This routine does not exist.` };
    }
      
    await jwt.canAccess(req, res, routine);
    routine.routine = [...routine.routine, ...routine.rests] as IRoutineExercise[];
    

    await db.disconnect();
    res?.status(200).json(routine);
    return JSON.parse(JSON.stringify(routine));

  } catch (error) {
    res?.status(500).json({ message: 'Connection error' });
    return { message: 'Connection Error' };
  }
};

export const putRoutine = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<IRoutine | { message: string }> => {
  const { id } = req.query;
  try {
    await db.connect();
    await validateJWT(req, res);
    const routine = await Routine.findOne({_id: id});

    if(!routine) res.status(400).json({ message: `This routine not exist`});
    await jwt.canAccess(req, res, routine);
    
    const updatedRoutine: IRoutine = await Routine.findOneAndUpdate({ _id: id }, req.body, { returnNewDocument: true }) as IRoutine;

    

    await db.disconnect();

    res.status(200).json(updatedRoutine);
    return updatedRoutine;

  } catch (error) {
    res.status(500).json({ message: 'Connection error' });
    return { message: 'Connection Error' };
  }
};

export const deleteRoutine = async (req: NextApiRequest, res: NextApiResponse<Data>): Promise<{ message: string }> => {
  const { id } = req.query;
  try {
    await db.connect();
    const routine = await Routine.findOne({_id: id});

    if(!routine) res.status(400).json({ message: `This routine not exist`});
    await jwt.canAccess(req, res, routine);

    routine?.deleteOne();

    await db.disconnect();

    res.status(200).json({message: "Routine deleted succesfuly"});
    return {message: "Routine deleted succesfuly"};

  } catch (error) {
    res.status(500).json({ message: 'Connection error' });
    return { message: 'Connection Error' };
  }
};