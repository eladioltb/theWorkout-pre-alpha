import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { User } from '../axiosApi';


export const signToken = (_id: string, email: string) => {

  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  return jwt.sign(
    // payload
    { _id, email },

    // Seed
    process.env.JWT_SECRET_SEED,

    // Opciones
    { expiresIn: '30d' }
  );

};



export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('No hay semilla de JWT - Revisar variables de entorno');
  }

  if (token.length <= 10) {
    return Promise.reject('JWT no es válido');
  }

  return new Promise((resolve, reject) => {

    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET || '', (err, payload) => {
        if (err) return reject('JWT no es válido');

        const { _id } = payload as { _id: string; };

        resolve(_id);

      });
    } catch (error) {
      reject('JWT no es válido');
    }
  });
};

export const validateJWT = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { user } = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as any;
    return user;
  } catch (error) {
    return res.status(401).json({
      message: "You are not authorized"
    });
  }
};

export const canAccess = async (req: NextApiRequest, res: NextApiResponse<any>, object: any) => {
  const { user } = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as any;
  if (
    user.role !== "admin" &&
    user.id !== object?.createdBy
  ) {
    return res.status(401).json({
      message: "You are not authorized"
    });
  }
};
