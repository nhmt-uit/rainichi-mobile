import { createReducer } from "redux-act";
import {
  ListeningFetched,
  ListeningFetching,
  ListeningFetchingFailed,
  ListeningMoreFetching
} from "../actions/ListeningActions";

const initialState = {
  listeningList: null,
  isListeningLoading: false,
  fetchedListeningErrorMessage: null,
  nextUrl: null,
  
};
export default createReducer(
  {
    [ListeningFetching]: state => {
      return {
        ...state,
        isListeningLoading: true,
        listeningList: null,
        nextUrl: null,
      };
    },
    [ListeningMoreFetching]: state => {
      return {
        ...state,
        isListeningLoading: true,
      };
    },
    [ListeningFetched]: (state, response) => {
      return {
        ...state,
        isListeningLoading: false,
        listeningList: response.data,
        fetchedListeningErrorMessage: null,
        nextUrl : response.meta.pagination.links.next
      };
    },
    [ListeningFetchingFailed]: (state, error) => {
      return {
        ...state,
        isListeningLoading: false,
        fetchedListeningErrorMessage: error.message
      };
    }
  },
  initialState
);
