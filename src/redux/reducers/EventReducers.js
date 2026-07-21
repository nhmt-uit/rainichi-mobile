import {createReducer} from 'redux-act';
import {
  SharingApp,
  ShareAppSuccess,
  ShareAppFailure,
} from '../actions/EventActions';

const initialState = {
  isSharing: false,
  shareErrorMessage: null,
  shareResponse: null,

};

export default createReducer(
  {
    [SharingApp]: state => ({
      ...state,
      isSharing: true,
      shareResponse: null,
      shareErrorMessage: null,
    }),
    [ShareAppSuccess]: (state, data) => ({
      ...state,
      isSharing: false,
      shareResponse: data,
      shareErrorMessage: null,
    }),
    [ShareAppFailure]: (state, error) => ({
      ...state,
      isSharing: false,
      shareResponse: null,
      shareErrorMessage: error.message,
    }),
  },
  initialState,
);
