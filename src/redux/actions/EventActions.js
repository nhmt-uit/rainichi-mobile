import {createAction} from 'redux-act';
import * as Utils from '../../utils/utils';
import constants from '../../utils/constants';


export const SharingApp = createAction('SharingApp');
export const ShareAppSuccess = createAction('ShareAppSuccess');
export const ShareAppFailure = createAction('ShareAppFailure');


export function shareApp() {
  return async dispatch => {
    dispatch(SharingApp());
    var params = {
      method: 'POST',
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.share,
        params,
      );
      dispatch(ShareAppSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(ShareAppFailure(e));
    }
  };
}
