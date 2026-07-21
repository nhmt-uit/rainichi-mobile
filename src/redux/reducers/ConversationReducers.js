import { createReducer } from "redux-act";
import {
  ConversationFetched,
  ConversationFetching,
  ConversationFetchingFailed,
  ConversationMoreFetching
} from "../actions";
import {
  SubFetched,
  SubFetching,
  SubFetchingFailed
} from "../actions/ConversationActions";

const initialState = {
  conversations: null,
  isConversationsFetching: false,
  fetchingConversationsErrorMessage: null,
  subtitles: null,
  isSubtitlesFetching: false,
  fetchingSubtitlesErrorMessage: null,
  nextUrl: null
};
export default createReducer(
  {
    [ConversationFetched]: (state, response) => {
      return {
        ...state,
        isConversationsFetching: false,
        conversations: response.data,
        fetchingConversationsErrorMessage: null,
        nextUrl: response.meta.pagination.links.next
      };
    },
    [ConversationFetching]: state => {
      return {
        ...state,
        isConversationsFetching: true,
        conversations: null,
        nextUrl: null
      };
    },
    [ConversationMoreFetching]: state => {
      return {
        ...state,
        isConversationsFetching: true
      };
    },
    [ConversationFetchingFailed]: (state, error) => {
      return {
        ...state,
        isConversationsFetching: false,
        fetchingConversationsErrorMessage: error.message
      };
    },
    [SubFetching]: state => ({
      ...state,
      isSubtitlesFetching: true,
      fetchingSubtitlesErrorMessage: null
    }),
    [SubFetched]: (state, subtitles) => ({
      ...state,
      subtitles,
      isSubtitlesFetching: false
    }),
    [SubFetchingFailed]: (state, error) => ({
      ...state,
      fetchingSubtitlesErrorMessage: error.message,
      isSubtitlesFetching: false
    })
  },
  initialState
);
