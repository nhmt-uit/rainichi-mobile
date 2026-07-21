import { createReducer } from "redux-act";
// import { SelfAdFetched, SelfAdFetching } from "../actions";
import {
  LoggingIn,
  LoginSuccess,
  LoginFailure,

  RegisteringAccount,
  RegisterSuccess,
  RegisterFailure,
  RegisterPending,

  ActivatingAccount,
  ActivateSuccess,
  ActivateFailure,

  GettingProfile,
  GetProfileSuccess,
  GetProfileFailure,

  UpdatingUser,
  UpdateUserSuccess,
  UpdateUserFailure,

  LoggingOut,
  LogOutSuccess,
  LogOutFailure,

  ChangingPassword,
  ChangePassSuccess,
  ChangePassFailure,

  RefreshingToken,
  RefreshTokenSucess,
  RefreshTokenFailure,
  
  ForgettingPass,
  ForgetPassSucess,
  ForgetPassFailure,
  
} from "../actions/AuthenticateActions";
import { i18n } from "../../../locales";
const initialState = {
  isLoading: false,
  error: null,
  data: null,
  message: null,
  userInfo: null,

  forgetPassError: null,
  forgetResult: null,

  refreshTokenError: null,
};

export default createReducer(
  {
    [LoggingIn]: state => ({
      ...state,
      isLoading: true,
      error: null,
      data: null,
      message: null,
    }),
    [LoginSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      data: data.data,
      message: null,
      userInfo: data.data.profile
    }),
    [LoginFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      data: null,
      message: error.message,
    }),
    [RegisteringAccount]: state => ({
      ...state,
      isLoading: true,
      error: null,
      data: null,
      message: null,
    }),
    [RegisterSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      data: null,
      message: data.message,
    }),
    [RegisterFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      data: null,
      message: null,
    }),
    [RegisterPending]: state => ({
      ...state,
      isLoading: false,
      error: null,
      data: null,
      message: "Activate",
    }),
    [ActivatingAccount]: state => ({
      ...state,
      isLoading: true,
      error: null,
      data: null,
      message: null,
    }),
    [ActivateSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      data: data.data,
      message: data.message,
      userInfo: data.data.profile
    }),
    [ActivateFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      data: null,
      message: null,
    }),
    [GettingProfile]: (state) => ({
      ...state,
      isLoading: true,
      error: null,
      message: null,
    }),
    [GetProfileSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      message: null,
      userInfo: data.data
    }),
    [GetProfileFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      message: error.message,
    }),
    [UpdatingUser]: state => ({
      ...state,
      isLoading: true,
    }),
    [UpdateUserSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      userInfo : data
    }),
    [UpdateUserFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      message: error.message
    }),
    [LoggingOut]: state => ({
      ...state,
      isLoading: true,
      error: null,
      message: null
    }),
    [LogOutSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      data: null,
      message: null
    }),
    [LogOutFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      message: error.message
    }),
    [ChangingPassword]: state => ({
      ...state,
      isLoading: true,
      error: null,
      message: null,
    }),
    [ChangePassSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      error: null,
      data: data.data,
      message: i18n.t("setting.password_changed"),
      userInfo: data.data.profile
    }),
    [ChangePassFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      error: error,
      message: error.message
    }),
    [RefreshingToken]: state => ({
      ...state,
      isLoading: true,
    }),
    [RefreshTokenSucess]: (state, data) => ({
      ...state,
      isLoading: false,
      refreshTokenError: null,
      data: data,
      message: null,
      userInfo: data.profile
    }),
    [RefreshTokenFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      refreshTokenError: error,
      message: error.message
    }),

    [ForgettingPass]: state => ({
      ...state,
      isLoading: true,
      forgetPassError: null,
      forgetResult: null
    }),
    [ForgetPassSucess]: (state, data) => ({
      ...state,
      isLoading: false,
      forgetPassError: null,
      forgetResult: data
    }),
    [ForgetPassFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      forgetPassError: error,
      forgetResult: null
    }),
  },
  initialState
);
