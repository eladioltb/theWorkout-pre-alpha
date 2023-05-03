import { IPostUser, IUser } from "../../interfaces";

export interface IGetUserEndpointOut {
  token: string,
  user: IUser
}

export interface IPostUserEndpointOut {
  user: IPostUser
}
