import { NextApiRequest, NextApiResponse } from "next";
import { dbUser } from "../../../../axiosApi";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method){
    case 'GET':
      return dbUser.getUser(req, res);
    case 'POST':
      return dbUser.postUser(req, res);
  }
}