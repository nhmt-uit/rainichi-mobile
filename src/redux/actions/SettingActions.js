import { createAction } from "redux-act";
import * as Utils from "../../utils/utils";
import constants from "../../utils/constants";
import * as Persistence from "../../utils/persistence";
import i18n from "../../../locales";


export const ChangeLanguage = createAction("ChangeLanguage");

export const GettingLanguage = createAction("GettingLanguage");
export const GetLanguageSuccess = createAction("GetLanguageSuccess");
export const GetLanguageFailure = createAction("GetLanguageFailure");

export function changeLanguage(value) {
  return async dispatch => {
    i18n.changeLanguage(value);
    Persistence.saveLanguagePref(value);
    dispatch(ChangeLanguage(value));
  };
}

export function getSupportLanguage() {
  return async dispatch => {
    dispatch(GettingLanguage());
    var params = {
      method: "GET"
    };
    try {
      const response = await Utils.fetchApi(constants.api.language, params);
      dispatch(GetLanguageSuccess(response.data));
    } catch (e) {
      dispatch(GetLanguageFailure(e));
    }
  };
}
