import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";
import { i18n } from "../../../locales";

export const ListeningFetched = createAction("ListeningFetched");
export const ListeningFetching = createAction("ListeningFetching");
export const ListeningMoreFetching = createAction("ListeningMoreFetching");
export const ListeningFetchingFailed = createAction("ListeningFetchingFailed");

export function fetchListeningList(isInGroup, lessonId) {
  return async dispatch => {
    dispatch(ListeningFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(
        `${constants.api.listeningInLesson}${lessonId}`,
        params
      );
      dispatch(ListeningFetched(response));
    } catch (e) {
      dispatch(ListeningFetchingFailed(e));
    }
  };
}

export function loadMoreListeningList(url) {
  return async dispatch => {
    dispatch(ListeningMoreFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(url, params);
      dispatch(ListeningFetched(response));
    } catch (e) {
      dispatch(ListeningFetchingFailed(e));
    }
  };
}
