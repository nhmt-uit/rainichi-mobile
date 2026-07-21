import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";
import WebVVT from "node-webvtt";
import { i18n } from "../../../locales";

export const ConversationFetched = createAction("ConversationFetched");
export const ConversationFetching = createAction("ConversationFetching");
export const ConversationMoreFetching = createAction("ConversationMoreFetching");
export const ConversationFetchingFailed = createAction(
  "ConversationFetchingFailed"
);
export const SubFetched = createAction("SubFetched");
export const SubFetching = createAction("SubFetching");
export const SubFetchingFailed = createAction("SubFetchingFailed");

export const fetchConversations = (isInGroup, id) => async dispatch => {
  dispatch(ConversationFetching());
  const url = isInGroup
    ? constants.api.conversationInGroup
    : constants.api.conversationInLesson;
  try {
    const response = await fetchApi(`${url}${id}`);
    dispatch(ConversationFetched(response));
  } catch (error) {
    dispatch(ConversationFetchingFailed(error));
  }
};

export function loadMoreConversations(url) {
  return async dispatch => {
    dispatch(ConversationMoreFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(url, params);
      dispatch(ConversationFetched(response));
    } catch (e) {
      dispatch(ConversationFetchingFailed(e));
    }
  };
}

export const fetchSubtitles = url => async dispatch => {
  dispatch(SubFetching());
  try {
    const response = await fetchApi(url, null, true);
    try {
      const { cues } = WebVVT.parse(response.text);
      if (cues) {
        const filtered = cues.flatMap(cue => (cue.end && [cue]) || []);
        dispatch(SubFetched(filtered));
      } else {
        const error = new Error(i18n.t("error.vvt_parse_fail"));
        dispatch(SubFetchingFailed(error));
      }
    } catch (error) {
      const passingError = new Error(
        `${i18n.t("error.vvt_parse_fail")}. ${i18n.t("error.reason")}: ${
          error.message
        }`
      );
      passingError.stack = error.stack;
      dispatch(SubFetchingFailed(passingError));
    }
  } catch (error) {
    const passingError = new Error(
      `${i18n.t("error.vvt_download_fail")}. ${i18n.t("error.reason")}: ${
        error.message
      }`
    );
    passingError.stack = error.stack;
    dispatch(SubFetchingFailed(passingError));
  }
};
