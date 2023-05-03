
import { NextApiRequest, NextApiResponse } from "next";
import { dbUser } from "../../../../../axiosApi";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    
  switch( req.method ) {
  case 'PUT':
    return dbUser.updateUserData(req, res);

  default:
    res.status(400).json({
      message: 'Bad request'
    });
  }
}
