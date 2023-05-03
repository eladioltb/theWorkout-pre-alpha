import { v2 as cloudinary } from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';
import { ImageCloudinary } from '../../../../interfaces';

type Data = 
  | {message: string, error?: any}
  | {url: string}


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
  switch( req.method ) {
    case 'POST':
      return uploadImage(req, res);
    default:
      res.status(400).json({
        message: 'Bad request'
      });
  }
}

const uploadImage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const image: ImageCloudinary = req.body;

  const { path, options } = image;
  
  const { secure_url } = await cloudinary.uploader.upload(path, options);
  
  res.status(200).json({url: secure_url});

  return {url: secure_url};
}