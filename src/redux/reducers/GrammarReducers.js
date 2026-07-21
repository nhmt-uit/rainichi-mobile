import { createReducer } from "redux-act";
import {
  GrammarFetchingFailed,
  GrammarFetched,
  GrammarFetching,
  GrammarMoreFetching
} from "../actions";

const initialState = {
  grammar: null,
  isGrammarFetching: false,
  grammarFetchingErrorMessage: null,
  nextUrl: null
};

export default createReducer(
  {
    [GrammarFetched]: (state, response) => {
      return {
        ...state,
        isGrammarFetching: false,
        grammar: response.data,
        nextUrl: response.meta.pagination.links.next
      };
    },
    [GrammarFetching]: state => {
      return {
        ...state,
        isGrammarFetching: true,
        nextUrl: null,
        grammar: null
      };
    },
    [GrammarMoreFetching]: state => {
      return {
        ...state,
        isGrammarFetching: true
      };
    },
    [GrammarFetchingFailed]: (state, error) => {
      return {
        ...state,
        isGrammarFetching: false,
        grammarFetchingErrorMessage: error.message
      };
    }
  },
  initialState
);
