import { createReducer } from "redux-act";
import {
  ReadingFetching,
  ReadingMoreFetching,
  ReadingFetched,
  ReadingFetchingFailed
} from "../actions/ReadingActions";

const initialState = {
  readingList: null,
  isReadingLoading: false,
  fetchedReadingErrorMessage: null,
  nextUrl: null
};
export default createReducer(
  {
    [ReadingFetching]: state => {
      return {
        ...state,
        isReadingLoading: true,
        readingList: null,
        nextUrl: null
      };
    },
    [ReadingMoreFetching]: state => {
      return {
        ...state,
        isReadingLoading: true
      };
    },
    [ReadingFetched]: (state, response) => {
      return {
        ...state,
        isReadingLoading: false,
        readingList: response.data,
        fetchedReadingErrorMessage: null,
        nextUrl: response.meta.pagination.links.next
      };
    },
    [ReadingFetchingFailed]: (state, error) => {
      return {
        ...state,
        isReadingLoading: false,
        fetchedReadingErrorMessage: error.message
      };
    }
  },
  initialState
);
