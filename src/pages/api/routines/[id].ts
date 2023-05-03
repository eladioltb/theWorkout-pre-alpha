import type { NextApiRequest, NextApiResponse } from 'next';
import { dbRoutines } from '../../../../axiosApi';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case 'GET':
    return dbRoutines.getRoutineDetail(req, res);
  case 'DELETE':
    return dbRoutines.deleteRoutine(req, res);

  default:
    return res.status(400).json({
      message: 'Bad request'
    })
  }
}