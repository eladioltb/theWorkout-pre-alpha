import { FC, useReducer } from 'react';
import { IAlertMessageState } from '../../interfaces';
import { UiContext, uiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
    isEditionMode: boolean;
    alertMessageState: IAlertMessageState
}


const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
  isEditionMode: false,
  alertMessageState: {
    alertMessage: '',
    displayAlert: false,
    severity: "warning"
  }
};

interface Props {
  children: React.ReactNode;
}

export const UiProvider:FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer( uiReducer , UI_INITIAL_STATE );

  const toggleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
  };
  const handleEditionMode = (set: boolean) => {
    dispatch({ type: '[UI] - Edition Mode', payload: set });
  };
  const handleAlertMessage = (alertMessageState: IAlertMessageState) => {
    dispatch({ type: '[UI] - Display Alert', payload: alertMessageState });
  };

  return (
    <UiContext.Provider value={{
      ...state,

      // Methods
      toggleSideMenu,
      handleEditionMode,
      handleAlertMessage
    }}>
      { children }
    </UiContext.Provider>
  );
};