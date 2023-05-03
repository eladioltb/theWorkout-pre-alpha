import type { NextApiRequest, NextApiResponse } from 'next';
import { dbWorkout } from '../../../../axiosApi';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case 'POST':
    return dbWorkout.postWorkout(req, res);
  case 'GET':
    return dbWorkout.getWorkouts(req, res);

  default:
    return res.status(400).json({
      message: 'Bad request'
    })
  }
}