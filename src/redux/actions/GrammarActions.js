import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";

export const GrammarFetched = createAction("GrammarFetched");
export const GrammarFetching = createAction("GrammarFetching");
export const GrammarMoreFetching = createAction("GrammarMoreFetching");
export const GrammarFetchingFailed = createAction("GrammarFetchingFailed");

export const fetchGrammar = (isInGroup, id) => async dispatch => {
  dispatch(GrammarFetching());
  try {
    let url = constants.api.grammarInLesson;
    if (isInGroup) {
      url = constants.api.grammarInGroup;
    }
    const response = await fetchApi(url + id);
    dispatch(GrammarFetched(response));
  } catch (error) {
    dispatch(GrammarFetchingFailed(error));
  }
};


export function loadMoreGrammar(url) {
  return async dispatch => {
    dispatch(GrammarMoreFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(url, params);
      dispatch(GrammarFetched(response));
    } catch (e) {
      dispatch(GrammarFetchingFailed(e));
    }
  };
}
