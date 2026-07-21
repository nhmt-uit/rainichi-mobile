import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";
import { i18n } from "../../../locales";

export const ReadingFetching = createAction("ReadingFetching");
export const ReadingMoreFetching = createAction("ReadingMoreFetching");
export const ReadingFetched = createAction("ReadingFetched");
export const ReadingFetchingFailed = createAction("ReadingFetchingFailed");

export function fetchReadingList(isInGroup, lessonId) {
  return async dispatch => {
    dispatch(ReadingFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(
        `${constants.api.readingInLesson}${lessonId}`,
        params
      );
      dispatch(ReadingFetched(response));
    } catch (e) {
      dispatch(ReadingFetchingFailed(e));
    }
  };
}

export function loadMoreReadingList(url) {
  return async dispatch => {
    dispatch(ReadingMoreFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(url, params);
      dispatch(ReadingFetched(response));
    } catch (e) {
      dispatch(ReadingFetchingFailed(e));
    }
  };
}
