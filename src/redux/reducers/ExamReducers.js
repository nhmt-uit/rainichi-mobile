import { createReducer } from "redux-act";
import constants from "../../utils/constants";

import {
  ExamListByIdFetching,
  ExamListByIdFetchSuccess,
  ExamListByIdFetchFailed,
  LTExamListFetchSuccess,
  JLPTExamListFetchSuccess,
  ExamDetailFetching,
  ExamDetailFetchSuccess,
  ExamDetailFetchFailed,
  ExamPriceFetching,
  ExamPriceFetchSuccess,
  ExamPriceFetchFailed,
  ExamSectionCreating,
  ExamSectionCreateSuccess,
  ExamSectionCreateFailed
} from "../actions";
const initialState = {
  jlptExamList: null,
  ltExamList: null,
  isExamListFetching: false,
  fetchingExamErrorMessage: null,
  isExamDetailFetching: false,
  examDetail: null,
  fetchingExamDetailErrorMessage: null,
  examPriceList: null,
  isExamPriceListFetching: false,
  examNextLink: null,

  isCreatingExamSection: false,
  examSectionData: null
};

export default createReducer(
  {
    [ExamListByIdFetching]: state => {
      return {
        ...state,
        isExamListFetching: true
      };
    },
    [ExamListByIdFetchSuccess]: (state, response) => {
      return {
        ...state,
        isExamListFetching: false,
        jlptExamList: response.data
      };
    },
    [JLPTExamListFetchSuccess]: (state, response) => {
      return {
        ...state,
        isExamListFetching: false,
        jlptExamList: response.data
      };
    },
    [LTExamListFetchSuccess]: (state, response) => {
      return {
        ...state,
        isExamListFetching: false,
        ltExamList: response.data
      };
    },
    [ExamListByIdFetchFailed]: (state, error) => {
      return {
        ...state,
        jlptExamList: null,
        isExamListFetching: false,
        fetchingErrorMessage: error.message
      };
    },

    [ExamDetailFetching]: state => {
      return {
        ...state,
        isExamDetailFetching: true
      };
    },
    [ExamDetailFetchSuccess]: (state, response) => {
      return {
        ...state,
        isExamDetailFetching: false,
        examDetail: response.data,
        fetchingExamDetailErrorMessage: null
      };
    },
    [ExamDetailFetchFailed]: (state, error) => {
      return {
        ...state,
        examDetail: null,
        isExamDetailFetching: false,
        fetchingExamDetailErrorMessage: error.message
      };
    },
    [ExamPriceFetching]: (state, error) => {
      return {
        ...state,
        isExamPriceListFetching: true
      };
    },
    [ExamPriceFetchSuccess]: (state, response) => {
      return {
        ...state,
        isExamPriceListFetching: false,
        examPriceList: response.data,
        examNextLink: response.meta.pagination.links.next
      };
    },
    [ExamPriceFetchFailed]: (state, error) => {
      return {
        ...state,
        isExamPriceListFetching: false,
        fetchingExamDetailErrorMessage: null
      };
    },

    [ExamSectionCreating]: (state, error) => {
      return {
        ...state,
        isCreatingExamSection: true
      };
    },
    [ExamSectionCreateSuccess]: (state, response) => {
      return {
        ...state,
        isCreatingExamSection: false,
        examSectionData: response.data
      };
    },
    [ExamSectionCreateFailed]: (state, error) => {
      return {
        ...state,
        isCreatingExamSection: false
      };
    }
  },
  initialState
);
