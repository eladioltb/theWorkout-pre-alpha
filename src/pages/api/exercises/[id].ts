import type { NextApiRequest, NextApiResponse } from 'next';
import { dbExercises } from '../../../../axiosApi';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case 'GET':  
    return dbExercises.getExerciseById(req, res);

  default:
    return res.status(400).json({
      message: 'Bad request'
    });
  }
}