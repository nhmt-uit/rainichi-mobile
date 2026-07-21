/**
 * @providesModule AuthenticateActions
 */

import {createAction} from 'redux-act';
import * as Utils from '../../utils/utils';
import * as Persistence from '../../utils/persistence';
import constants from '../../utils/constants';
import i18n from '../../../locales';
// TODO(Giai đoạn 2 - social login): re-add Google/Facebook sign-out once
// @react-native-google-signin/google-signin and react-native-fbsdk-next are
// wired up. Old app used the now-renamed @react-native-community/google-signin.

import {ChangeLanguage} from '../actions/SettingActions';
import {bindActionCreators} from 'redux';

export const LoggingIn = createAction('LoggingIn');
export const LoginSuccess = createAction('LoginSuccess');
export const LoginFailure = createAction('LoginFailure');

export const RegisteringAccount = createAction('RegisteringAccount');
export const RegisterSuccess = createAction('RegisterSuccess');
export const RegisterPending = createAction('RegisterPending');
export const RegisterFailure = createAction('RegisterFailure');

export const ActivatingAccount = createAction('ActivatingAccount');
export const ActivateSuccess = createAction('ActivateSuccess');
export const ActivateFailure = createAction('ActivateFailure');

export const GettingProfile = createAction('GettingProfile');
export const GetProfileSuccess = createAction('GetProfileSuccess');
export const GetProfileFailure = createAction('GetProfileFailure');

export const UpdatingUser = createAction('UpdatingUser');
export const UpdateUserSuccess = createAction('UpdateUserSuccess');
export const UpdateUserFailure = createAction('UpdateUserFailure');

export const LoggingOut = createAction('LoggingOut');
export const LogOutSuccess = createAction('LogOutSuccess');
export const LogOutFailure = createAction('LogOutFailure');

export const ChangingPassword = createAction('ChangingPassword');
export const ChangePassSuccess = createAction('ChangePassSuccess');
export const ChangePassFailure = createAction('ChangePassFailure');

export const RefreshingToken = createAction('RefreshingToken');
export const RefreshTokenSucess = createAction('RefreshTokenSucess');
export const RefreshTokenFailure = createAction('RefreshTokenFailure');

export const ForgettingPass = createAction('ForgettingPass');
export const ForgetPassSucess = createAction('ForgetPassSucess');
export const ForgetPassFailure = createAction('ForgetPassFailure');

export const SocialLoggingIn = createAction('SocialLoggingIn');
export const SocialLoginSuccess = createAction('SocialLoginSuccess');
export const SocialLoginFailure = createAction('SocialLoginFailure');

export function doLogin(email, password) {
  return async dispatch => {
    dispatch(LoggingIn());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/login',
        params,
      );
      // const response = await Utils.fetchApi(
      //   constants.api.authService + "/admin-login",
      //   params
      // );
      await Persistence.saveAuthenticationPref(response.data);
      dispatch(LoginSuccess(response));
    } catch (e) {
      dispatch(LoginFailure(e));
    }
  };
}

export function signUp(email) {
  return async dispatch => {
    dispatch(RegisteringAccount());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/signup',
        params,
      );
      dispatch(RegisterSuccess(response));
    } catch (e) {
      if (e.response.code == 401) {
        dispatch(RegisterPending());
      } else {
        dispatch(RegisterFailure(e));
      }
    }
  };
}

export function active(fullName, email, code, password, phone, refEmail) {
  return async dispatch => {
    dispatch(ActivatingAccount());
    var params = {
      method: 'PATCH',
      body: JSON.stringify({
        name: fullName,
        email: email,
        activation_token: code,
        password: password,
        phone: phone,
        referrer_email: refEmail,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/signup/activate',
        params,
      );
      Persistence.saveAuthenticationPref(response.data);
      dispatch(ActivateSuccess(response));
    } catch (e) {
      dispatch(ActivateFailure(e));
    }
  };
}

export function getProfile() {
  return async dispatch => {
    dispatch(GettingProfile());
    var params = {
      method: 'GET',
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/user',
        params,
      );
      dispatch(GetProfileSuccess(response));
    } catch (e) {
      dispatch(GetProfileFailure(e));
    }
  };
}

export function updateUser(fullName, phoneNumber, defaultAvatar) {
  return async dispatch => {
    dispatch(UpdatingUser());

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (fullName) {
      formData.append('name', fullName);
    }
    if (phoneNumber) {
      formData.append('phone', phoneNumber);
    }
    if (defaultAvatar) {
      if (!Utils.isHttpUrl(defaultAvatar)) {
        formData.append('avatar', {
          uri: defaultAvatar,
          name: 'avatar.jpg',
          type: 'multipart/form-data',
        });
      } else {
        formData.append('avatar_default', defaultAvatar);
      }
    }
    var params = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/user',
        params,
      );
      await mergeProfileUpdateData(response.data);
      dispatch(UpdateUserSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(UpdateUserFailure(e));
    }
  };

  async function mergeProfileUpdateData(updatedProfile) {
    const authPref = await Persistence.getAuthenticationPref();
    authPref.profile = updatedProfile;
    await Persistence.saveAuthenticationPref(authPref);
  }
}

export function logOut() {
  return async dispatch => {
    dispatch(LoggingOut());
    var params = {
      method: 'GET',
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/logout',
        params,
      );
      // TODO(Giai đoạn 2 - social login): log out google/facebook here once wired up
      //clear ref
      await Persistence.clearAuthentiationPref();
      dispatch(LogOutSuccess(response));
    } catch (e) {
      dispatch(LogOutFailure(e));
    }
  };
}

export function changePassword(oldPassword, newPassword) {
  return async dispatch => {
    dispatch(ChangingPassword());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        password: oldPassword,
        new_password: newPassword,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/update-password',
        params,
      );
      dispatch(ChangePassSuccess(response));
    } catch (e) {
      dispatch(ChangePassFailure(e));
    }
  };
}

export function refreshToken() {
  return async dispatch => {
    dispatch(RefreshingToken());
    dispatchLanguage(dispatch);

    const authPref = await Persistence.getAuthenticationPref();
    if (!authPref) {
      dispatch(RefreshTokenFailure(new Error('empty token')));
      return;
    }
    var params = {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: authPref.refresh_token,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/login/refresh',
        params,
      );
      const data = response.data;
      mergeRefreshData(authPref, data);
      dispatch(RefreshTokenSucess(data));
    } catch (e) {
      // await Persistence.clearAuthentiationPref();
      dispatch(RefreshTokenFailure(e));
    }
  };

  function mergeRefreshData(authPref, data) {
    data.profile = authPref.profile;
    Persistence.saveAuthenticationPref(data);
  }

  async function dispatchLanguage(dispatch) {
    const language = await Persistence.getLanguagePref();
    if (language) {
      dispatch(ChangeLanguage(language));
      i18n.changeLanguage(language);
    }
  }
}

export function forgetPass(email) {
  return async dispatch => {
    dispatch(ForgettingPass());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.authService + '/password/create-reset',
        params,
      );
      dispatch(ForgetPassSucess(response));
    } catch (e) {
      dispatch(ForgetPassFailure(e));
    }
  };
}

export function socialLogin(type, token) {
  return async dispatch => {
    dispatch(LoggingIn());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        token: token,
      }),
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.socialLoginService + '/' + type,
        params,
      );
      Persistence.saveAuthenticationPref(response.data);
      dispatch(LoginSuccess(response));
    } catch (e) {
      dispatch(LoginFailure(e));
    }
  };
}

export function appleLogin(token) {
  return async dispatch => {
    dispatch(LoggingIn());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        token: token,
      }),
    };
    try {
      const response = await Utils.fetchApi(constants.api.appleLogin, params);
      Persistence.saveAuthenticationPref(response.data);
      dispatch(LoginSuccess(response));
    } catch (e) {
      dispatch(LoginFailure(e));
    }
  };
}
