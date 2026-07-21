import { createReducer } from "redux-act";
import {
  LoadingVocabularyList,
  LoadVocabularyListSuccess,
  LoadVocabularyListFailure,
  LoadingVocabularyByLessonId,
  LoadVocabularyByLessonIdSuccess,
  LoadVocabularyByLessonIdFailure,
  LoadingKanjiByCourseId,
  LoadKanjiByCourseIdSuccess,
  LoadKanjiByCourseIdFailure
} from "../actions/VocabularyActions";

const initialState = {
  isLoading: false,
  vocabularyList: null,
  errorMessage: null,
  vocabularyListById: null,
  total: null,
  nextLink: null,
  responseVocabularyById: null,

  isKanjiFetching: false,
  kanjiList: null,
  kanjiFetchingErrorMessage: null
};

export default createReducer(
  {
    [LoadingVocabularyList]: state => ({
      ...state,
      isLoading: true,
      errorMessage: null,
      vocabularyList: null,
      vocabularyListById: null
    }),
    [LoadVocabularyListSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      vocabularyList: data.data,
      errorMessage: null
    }),
    [LoadVocabularyListFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      vocabularyList: null,
      errorMessage: error.message
    }),
    [LoadingVocabularyByLessonId]: state => ({
      ...state,
      isLoading: true,
      errorMessage: null,
      // vocabularyListById: null,
      total: null,
      nextLink: null,
      responseVocabularyById: null
    }),
    [LoadVocabularyByLessonIdSuccess]: (state, data) => ({
      ...state,
      isLoading: false,
      vocabularyListById: data.data,
      errorMessage: null,
      total: data.meta.pagination.total,
      nextLink: data.meta.pagination.links.next,
      responseVocabularyById: data
    }),
    [LoadVocabularyByLessonIdFailure]: (state, error) => ({
      ...state,
      isLoading: false,
      vocabularyListById: null,
      errorMessage: error.message,
      total: null,
      nextLink: null,
      responseVocabularyById: null
    }),

    [LoadingKanjiByCourseId]: state => ({
      ...state,
      isKanjiFetching: true
    }),
    [LoadKanjiByCourseIdSuccess]: (state, data) => ({
      ...state,
      isKanjiFetching: false,
      kanjiList: data
    }),
    [LoadKanjiByCourseIdFailure]: (state, error) => ({
      ...state,
      isKanjiFetching: false,
      kanjiFetchingErrorMessage: error.message
    })
  },
  initialState
);
