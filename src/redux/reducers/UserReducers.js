import {createReducer} from 'redux-act';
import {
  GettingAvatar,
  GetAvatarSuccess,
  GetAvatarFailure,
  UpdatingFcmToken,
  UpdateFcmSuccess,
  UpdateFcmFailure,
  RemovingFcmToken,
  RemoveFcmSuccess,
  RemoveFcmFailure,
} from '../actions/UserActions';

const initialState = {
  isLoading: false,
  errorMessage: null,
  defaultAvatar: null,

  isUpdatingFcm: false,
  updateFcmResponse: null,
  updateFcmError: null,

  isRemovingFcm: false,
  removeFcmResponse: null,
  removeFcmError: null,
};
export default createReducer(
  {
    [GettingAvatar]: state => {
      return({
      ...state,
      isLoading: true,
      defaultAvatar: null,
      errorMessage: null,
    })},
    [GetAvatarSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      defaultAvatar: data,
      errorMessage: null,
    }),
    [GetAvatarFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      defaultAvatar: null,
      errorMessage: error.message,
    }),

    [UpdatingFcmToken]: state => ({
      ...state,
      isUpdatingFcm: true,
      updateFcmResponse: null,
      updateFcmError: null,
    }),
    [UpdateFcmSuccess]: (state, data) => ({
      ...state,
      isUpdatingFcm: false,
      updateFcmResponse: data,
      updateFcmError: null,
    }),
    [UpdateFcmFailure]: (state, error) => ({
      ...state,
      isUpdatingFcm: false,
      updateFcmResponse: null,
      updateFcmError: error.message,
    }),

    [RemovingFcmToken]: state => ({
      ...state,
      isRemovingFcm: true,
      removeFcmResponse: null,
      removeFcmError: null,
    }),
    [RemoveFcmSuccess]: (state, data) => ({
      ...state,
      isRemovingFcm: false,
      removeFcmResponse: data,
      removeFcmError: null,
    }),
    [RemoveFcmFailure]: (state, error) => ({
      ...state,
      isRemovingFcm: false,
      updateFcmResponse: null,
      removeFcmError: error.message,
    }),
  },
  initialState,
);
