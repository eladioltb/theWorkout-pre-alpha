import { IAlertMessageState } from '../../interfaces';
import { UiState } from './';


type UiActionType = 
   | { type: '[UI] - ToggleMenu' } 
   | { type: '[UI] - Edition Mode', payload: boolean }
   | { type: '[UI] - Display Alert', payload: IAlertMessageState }


export const uiReducer = ( state: UiState, action: UiActionType ): UiState => {

  switch (action.type) {
  case '[UI] - ToggleMenu':
    return {
      ...state,
      isMenuOpen: !state.isMenuOpen
    };
  case '[UI] - Edition Mode':
    return {
      ...state,
      isEditionMode: action.payload
    };
  case '[UI] - Display Alert':
    return {
      ...state,
      alertMessageState: action.payload
    };

  default:
    return state;
  }

};