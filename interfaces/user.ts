import { CloudinaryOptions } from "./image";

export interface IUser {
  _id       : string;
  name      : string;
  email     : string;
  password  : string;
  role      : string;
  isPro     : boolean;
  image?    : string;
  massUnit  : string;
  metricUnit: string;
  metrics: IUserMetrics;
  createAt?: string;
  updateAt?: string;
}

export interface IPostUser {
  _id         : string;
  name        : string;
  email       : string;
  password    : string;
  role?       : string;
  isPro?      : boolean;
  image?      : string;
  massUnit    : string;
  metricUnit  : string;
  metrics?: IUserMetrics; 
  createAt?: string;
  updateAt?: string;
}

export interface IUserMetrics {
  weight    : number[];
  height    : number;
}