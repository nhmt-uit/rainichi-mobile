import {createReducer} from 'redux-act';
import {
  PracticeFetchingFailed,
  PracticeFetched,
  PracticeFetching,
  PracticeResultUpdated,
  PracticeSubmitting,
  PracticeSubmitted,
  PracticeSubmittingFailed,
  OpenNextCoursed,
  OpenNextCoursing,
  OpenNextCourseFailed,
  PracticeFetchingMore,
} from '../actions';
const initialState = {
  total: null,
  practice: null,
  responsePractice: null,
  nextLink: null,
  isPracticeFetching: false,
  practiceFetchingErrorMessage: null,
  practiceResult: [],
  isPracticeSubmitting: false,
  practiceSubmittedScore: -1,
  practiceSubmittingErrorMessage: null,
  practiceTotalQuestion: 0,
  praticeSubmittingStatus: null,
  praticeSubmittingData: null,
  totalQuestion: null,
  isOpenNextCoursing: false,
  openNextCoursingErrorMessage: null,
  openNextCoursingRes: null,
};

export default createReducer(
  {
    [PracticeFetched]: (state, response) => {
      return {
        ...state,
        isPracticeFetching: false,
        practice: response.data,
        total: response.meta.pagination ? response.meta.pagination.total : null,
        totalQuestion: response.meta.total_question,
        totalScore: response.meta.total_score,
        nextLink: response.meta.pagination
          ? response.meta.pagination.links.next
          : null,
        responsePractice: response,
      };
    },
    [PracticeFetching]: state => {
      return {
        ...state,
        isPracticeFetching: true,
        practiceResult: [],
        practiceFetchingErrorMessage: null,
      };
    },
    [PracticeFetchingMore]: state => {
      return {
        ...state,
        isPracticeFetching: true,
      };
    },
    [PracticeFetchingFailed]: (state, error) => {
      return {
        ...state,
        isPracticeFetching: false,
        practiceFetchingErrorMessage: error.message,
      };
    },
    [PracticeResultUpdated]: (state, practiceResult) => {
      return {
        ...state,
        practiceResult,
      };
    },
    [PracticeSubmitting]: state => ({
      ...state,
      isPracticeSubmitting: true,
      practiceSubmittedScore: -1,
      practiceSubmittingErrorMessage: null,
      practiceTotalQuestion: 0,
      praticeSubmittingStatus: null,
      praticeSubmittingData: null,
    }),
    [PracticeSubmitted]: (state, payload) => ({
      ...state,
      isPracticeSubmitting: false,
      practiceSubmittedScore: payload.score,
      practiceSubmittingErrorMessage: null,
      practiceTotalQuestion: payload.totalQuestion,
      praticeSubmittingStatus: payload.response.data.status,
      praticeSubmittingData: payload.response.data,
    }),
    [PracticeSubmittingFailed]: (state, error) => ({
      ...state,
      isPracticeSubmitting: false,
      practiceSubmittingErrorMessage: error.message,
      praticeSubmittingStatus: null,
    }),
    [OpenNextCoursing]: state => ({...state, isOpenNextCoursing: true}),
    [OpenNextCoursed]: (state, payload) => ({
      ...state,
      openNextCoursingRes: payload,
      isOpenNextCoursing: false,
    }),
    [OpenNextCourseFailed]: (state, error) => ({
      ...state,
      isOpenNextCoursing: false,
      openNextCoursingErrorMessage: error.message,
    }),
  },
  initialState,
);
