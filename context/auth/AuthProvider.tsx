import { FC, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AxiosError, AxiosResponse } from 'axios';
import { AuthContext, authReducer } from './';
import { CLOUDINARY_ENDPOINT, gymApi, USER_ENDPOINT, USER_UPDATE_DATA_ENDPOINT } from '../../axiosApi';
import { IErrorResponse, IUser } from '../../interfaces';
import { image as ImageUtil } from '../../utils';

export interface AuthState {
  isLoggedIn: boolean;
  user: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: {
    _id       : '',
    name      : '',
    email     : '',
    password  : '',
    role      : '',
    isPro     : false,
    massUnit  : '',
    metricUnit: '',
    metrics: {
      weight    : [],
      height    : 0,
    }
  },
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if ( status === 'authenticated' ) {
      getUserDetail(data?.user as IUser);
    }
  }, [ status, data ]);
  
  // User funtions system.

  const loginUser = async (email: string, password: string): Promise<{ status: number, message: string, data?: IUser }> => {
    const resp = await gymApi.get(USER_ENDPOINT, {data: {email, password}})
      .then(({data}: AxiosResponse) => {
        dispatch({type: '[Auth] - Set User in Context', payload: data?.user as IUser});
        
        return { status: 200, data: data.user as IUser, message: data.message };
      })
      .catch((error: AxiosError) => {
        const { response } = error;
        const messageData: IErrorResponse = response?.data as IErrorResponse;

        return { status: response?.status as number, message: messageData.message as string };
      });
    return resp;
  };

  const getUserDetail = async(user: any) => {
    const { id } = user;
    
    const userDetail = await gymApi.get(USER_ENDPOINT + `/${id}`);
    
    dispatch({ type: '[Auth] - Set User in Context', payload: userDetail.data.user as IUser });
  }

  const registerUser = async( name: string, email: string, password: string, weightUnit: string ): Promise<{ status: number, message: string, data?: IUser }> => {

    const resp = await gymApi.post(USER_ENDPOINT, {name, email, password, weightUnit})
      .then(({data}: AxiosResponse) => {
        return { status: 200, data: data.user as IUser, message: data.message }
      })
      .catch((error: AxiosError) => {
        const { response } = error;
        dispatch({type: '[Auth] - Update User Data in Context', payload: data?.user as IUser});
        const messageData: IErrorResponse = response?.data as IErrorResponse;

        return { status: response?.status as number, message: messageData.message as string };
      });
    return resp;
  };

  const logout = () => {
    signOut();
  };

  // Update user funtions.

  const updateUserData = async(email: string, value: string | number, entity: string): Promise<{ status: number, message: string, data?: IUser }> => {
    // dispatch({ type: '[Auth] - Update User Data in Context', payload: data?.user as IUser });
    const resp = await gymApi.put(USER_UPDATE_DATA_ENDPOINT, {email, value, entity})
    .then(({data}: AxiosResponse) => {
      return { status: 200, data: data.user as IUser, message: data.message };
    })
    .catch((error: AxiosError) => {
      const { response } = error;
      const messageData: IErrorResponse = response?.data as IErrorResponse;

      return { status: response?.status as number, message: messageData.message as string, data: state.user as IUser };
    }); 
    dispatch({ type: '[Auth] - Update User Data in Context', payload: {...resp.data}});
    return resp;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      // Methods
      loginUser,
      registerUser,
      logout,
      updateUserData
    }}>
      { children }
    </AuthContext.Provider>
  );
};