

import { createContext, FC } from 'react';
import { IAlertMessageState } from '../../interfaces';


interface ContextProps {
    isMenuOpen: boolean;
    isEditionMode: boolean;
    alertMessageState: IAlertMessageState;

    // Methods
    toggleSideMenu: () => void;
    handleEditionMode: (set: boolean) => void;
    handleAlertMessage: (alertMessageState: IAlertMessageState) => void;
}


export const UiContext = createContext({} as ContextProps );