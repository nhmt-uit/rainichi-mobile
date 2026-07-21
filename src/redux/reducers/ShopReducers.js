import { createReducer } from "redux-act";
import {
  CoinPriceFetching,
  CoinPriceFetched,
  CoinPriceFetchingFailed,
  CoursePriceFetching,
  CoursePriceFetched,
  CoursePriceFetchingFailed,
  CourseTypeFetching,
  CourseTypeFetched,
  CourseTypeFetchingFailed,
  LevelTypeFetching,
  LevelTypeFetched,
  LevelTypeFetchingFailed,
  ExamQuestionsPackageTypeFetching,
  ExamQuestionsPackageTypeFetched,
  ExamQuestionsPackageTypeFetchingFailed
} from "../actions/ShopActions";

const initialState = {
  coinList: null,
  isShopLoading: false,
  fetchedShopErrorMessage: null,
  courseList: null,
  courseNextLink:null,
  courseTypeList: null,
  examQuestionsTypeList: null,
  levelTypeList: null,
};
export default createReducer(
  {
    [CoinPriceFetching]: state => {
      return {
        ...state,
        isShopLoading: true,
        coinList: null
      };
    },
    [CoinPriceFetched]: (state, response) => {
      return {
        ...state,
        isShopLoading: false,
        coinList: response.data,
        fetchedShopErrorMessage: null
      };
    },
    [CoinPriceFetchingFailed]: (state, error) => {
      return {
        ...state,
        isShopLoading: false,
        fetchedShopErrorMessage: error.message
      };
    },
    [CoursePriceFetching]: state => {
      return {
        ...state,
        isShopLoading: true,
        courseList: null,
        courseNextLink: null
      };
    },
    [CoursePriceFetched]: (state, response) => {
      return {
        ...state,
        isShopLoading: false,
        courseList: response.data,
        fetchedShopErrorMessage: null,
        courseNextLink: response.meta.pagination.links.next
      };
    },
    [CoursePriceFetchingFailed]: (state, error) => {
      return {
        ...state,
        isShopLoading: false,
        fetchedShopErrorMessage: error.message
      };
    },

    [CourseTypeFetching]: state => {
      return {
        ...state,
        courseTypeList: null
      };
    },
    [CourseTypeFetched]: (state, response) => {
      return {
        ...state,
        courseTypeList: response.data
      };
    },
    [CourseTypeFetchingFailed]: (state, error) => {
      return {
        ...state
      };
    },

    [LevelTypeFetching]: state => {
      return {
        ...state,
        levelTypeList: null
      };
    },
    [LevelTypeFetched]: (state, response) => {
      return {
        ...state,
        levelTypeList: response.data
      };
    },
    [LevelTypeFetchingFailed]: (state, error) => {
      return {
        ...state
      };
    },
    [ExamQuestionsPackageTypeFetching]: state => {
      return {
        ...state,
        examQuestionsTypeList: null
      };
    },
    [ExamQuestionsPackageTypeFetched]: (state, response) => {
      return {
        ...state,
        examQuestionsTypeList: response.data
      };
    },
    [ExamQuestionsPackageTypeFetchingFailed]: (state, error) => {
      return {
        ...state
      };
    },
  },
  initialState
);