import { createReducer } from "redux-act";
import {
  GettingYourExam,
  GetYourExamSuccess,
  GetYourExamFailure,
  GettingYourExamTimesDetail,
  GettingYourExamTimesDetailSuccess,
  GettingYourExamTimesDetailFailure
} from "../actions/YourExamActions";

const initialState = {
  isLoading: false,
  yourExamList: null,
  errorMessage: null,
  yourExamTimesDetailList: null
};

export default createReducer(
  {
    [GettingYourExam]: state => ({
      ...state,
      isLoading: true,
    }),
    [GetYourExamSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      yourExamList: data,
    }),
    [GetYourExamFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      errorMessage: error.message
    }),
    [GettingYourExamTimesDetail]: state => ({
      ...state,
      isLoading: true,
    }),
    [GettingYourExamTimesDetailSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      yourExamTimesDetailList: data,
    }),
    [GettingYourExamTimesDetailFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      errorMessage: error.message
    }),
  },
  initialState
);
