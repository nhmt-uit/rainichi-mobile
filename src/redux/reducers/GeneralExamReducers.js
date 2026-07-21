import { createReducer } from "redux-act";

import {
  SaveGeneralTestSection,
  AllExamSubmitting,
  AllExamSubmitSuccess,
  AllExamSubmitFailed,
  SaveGeneralTestTime
} from "../actions/GeneralExamActions";

const initialState = {
  generalExamData: null,
  isSubmittingAll: false,
  submitAllError: null,
  submitAllResult: null,
  totalExamTime: null
};

export default createReducer(
  {
    [SaveGeneralTestSection]: (state, data) => {
      return {
        ...state,
        generalExamData: data
      };
    },
    [SaveGeneralTestTime]: (state, data) => {
      return {
        ...state,
        totalExamTime: data
      };
    },
    [AllExamSubmitting]: state => {
      return {
        ...state,
        isSubmittingAll: true,
        submitAllError: null,
        submitAllResult: null
      };
    },
    [AllExamSubmitSuccess]: (state, res) => {
      return {
        ...state,
        isSubmittingAll: false,
        submitAllResult: res.data
      };
    },
    [AllExamSubmitFailed]: (state, error) => {
      return {
        ...state,
        isSubmittingAll: false,
        submitAllError: error
      };
    }
  },
  initialState
);
