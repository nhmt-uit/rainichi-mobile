import { createReducer } from "redux-act";
import constants from "../../utils/constants";

import {
  JobArticleFetching,
  JobArticleFetchSuccess,
  JobArticleFetchFailed,
  EventArticleFetching,
  EventArticleFetchSuccess,
  EventArticleFetchFailed,
  ArticleDetailFetching,
  ArticleDetailFetchSuccess,
  ArticleDetailFetchFailed,
  JobApplying,
  JobApplySuccess,
  JobApplyFailed
} from "../actions";
const initialState = {
  jobList: [],
  fetchingJobErrorMessage: null,
  isJobLoading: false,
  totalJob: 0,
  jobSlider: null,

  eventList: [],
  fetchingEventErrorMessage: null,
  isEventLoading: false,
  totalEvent: 0,
  eventSlider: null,

  isDetailLoading: false,
  articleDetail: null,
  fetchingDetailErrorMessage: null,

  isApplyJobLoading: false,
  applyJobRespone: null,
  applyingJobError: null
};

export default createReducer(
  {
    [JobArticleFetching]: state => {
      return {
        ...state,
        isJobLoading: true
      };
    },
    [JobArticleFetchSuccess]: (state, payload) => {
      return {
        ...state,
        isJobLoading: false,
        jobList:
          payload.page == 1
            ? payload.response.data.articles
            : [...state.jobList, ...payload.response.data.articles],
        totalJob: payload.response.meta.pagination.total,
        jobSlider: payload.response.data.slider.map((data, index) => {
          return data.image;
        })
      };
    },
    [JobArticleFetchFailed]: (state, error) => {
      return {
        ...state,
        jobList: null,
        isJobLoading: false,
        fetchingJobErrorMessage: error.message
      };
    },

    [EventArticleFetching]: state => {
      return {
        ...state,
        isEventLoading: true
      };
    },
    [EventArticleFetchSuccess]: (state, payload) => {
      return {
        ...state,
        isEventLoading: false,
        eventList:
          payload.page == 1
            ? payload.response.data.articles
            : [...state.eventList, ...payload.response.data.articles],
        totalEvent: payload.response.meta.pagination.total,
        eventSlider: payload.response.data.slider.map((data, index) => {
          return data.image;
        })
      };
    },
    [EventArticleFetchFailed]: (state, error) => {
      return {
        ...state,
        eventList: null,
        isEventLoading: false,
        fetchingEventErrorMessage: error.message
      };
    },

    [ArticleDetailFetching]: state => {
      return {
        ...state,
        isDetailLoading: true
      };
    },
    [ArticleDetailFetchSuccess]: (state, response) => {
      return {
        ...state,
        isDetailLoading: false,
        articleDetail: response.data
      };
    },
    [ArticleDetailFetchFailed]: (state, error) => {
      return {
        ...state,
        isDetailLoading: false,
        fetchingDetailErrorMessage: error.message
      };
    },

    [JobApplying]: state => {
      return {
        ...state,
        isApplyJobLoading: true,
        applyJobRespone: null,
        applyingJobError: null
      };
    },
    [JobApplySuccess]: (state, response) => {
      return {
        ...state,
        isApplyJobLoading: false,
        applyJobRespone: response.message
      };
    },
    [JobApplyFailed]: (state, error) => {
      return {
        ...state,
        isApplyJobLoading: false,
        applyingJobError: error
      };
    }
  },
  initialState
);
