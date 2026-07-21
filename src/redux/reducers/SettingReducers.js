import { createReducer } from "redux-act";
import {
  ChangeLanguage,
  GettingLanguage,
  GetLanguageFailure,
  GetLanguageSuccess
} from "../actions/SettingActions";

const initialState = {
  isLoading: false,
  language: null,
  supportLanguage: null
};

export default createReducer(
  {
    [ChangeLanguage]: (state, data) => ({
      ...state,
      language: data
    }),
    [GettingLanguage]: state => ({
      ...state,
      isLoading: true,
      supportLanguage : null,
    }),
    [GetLanguageSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      supportLanguage: data
    }),
    [GetLanguageFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      supportLanguage: null
    })
  },
  initialState
);
