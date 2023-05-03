import { NextApiRequest, NextApiResponse } from "next";
import { dbUser } from "../../../../axiosApi";
import { dbStats } from "../../../../axiosApi/stats";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method){
    case 'POST':
      return dbStats.getStats(req, res);
    case 'GET':
      return dbStats.getCalendarWorkoutList(req, res);
  }
}