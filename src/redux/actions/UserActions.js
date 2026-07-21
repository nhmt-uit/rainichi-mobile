import {createAction} from 'redux-act';
import * as Utils from '../../utils/utils';
import constants from '../../utils/constants';
import {Platform} from 'react-native';
// import {FormData} from "react-native";

// export const UpdatingUser = createAction("UpdatingUser");
// export const UpdateUserSuccess = createAction("UpdateUserSuccess");
// export const UpdateUserFailure = createAction("UpdateUserFailure");

export const GettingAvatar = createAction('GettingAvatar');
export const GetAvatarSuccess = createAction('GetAvatarSuccess');
export const GetAvatarFailure = createAction('GetAvatarFailure');

export const UpdatingFcmToken = createAction('UpdatingFcmToken');
export const UpdateFcmSuccess = createAction('UpdateFcmSuccess');
export const UpdateFcmFailure = createAction('UpdateFcmFailure');

export const RemovingFcmToken = createAction('RemovingFcmToken');
export const RemoveFcmSuccess = createAction('RemoveFcmSuccess');
export const RemoveFcmFailure = createAction('RemoveFcmFailure');

export function getDefaultAvatar() {
  return async dispatch => {
    dispatch(GettingAvatar());
    var params = {
      method: 'GET',
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.userService + '/default-avatar',
        params,
      );
      console.log(response);
      dispatch(GetAvatarSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(GetAvatarFailure(e));
    }
  };
}

export function updateFirebaseToken(userId, fcmToken, oldFcmToken) {
  return async dispatch => {
    dispatch(UpdatingFcmToken());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        token_device: fcmToken,
        token_device_old: oldFcmToken ? oldFcmToken : "null",
        // token_device_old: oldFcmToken,
        device_type: Platform.OS.toUpperCase(),
      }),
    };
    try {
      const response = await Utils.fetchApi(
        `${constants.api.fcmService}${userId}`,
        params,
      );
      dispatch(UpdateFcmSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(UpdateFcmFailure(e));
    }
  };
}

export function removeFirebaseToken(fcmToken) {
  return async dispatch => {
    dispatch(RemovingFcmToken());
    var params = {
      method: 'POST',
      body: JSON.stringify({
        token_device: fcmToken,
        device_type: Platform.OS.toUpperCase(),
      }),
    };
    try {
      const response = await Utils.fetchApi(
        `${constants.api.fcmService}delete`,
        params,
      );
      dispatch(RemoveFcmSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(RemoveFcmFailure(e));
    }
  };
}


