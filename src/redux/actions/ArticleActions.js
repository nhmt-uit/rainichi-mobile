import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";

export const JobArticleFetching = createAction("JobArticleFetching");
export const JobArticleFetchSuccess = createAction("JobArticleFetchSuccess");
export const JobArticleFetchFailed = createAction("JobArticleFetchFailed");

export const EventArticleFetching = createAction("EventArticleFetching");
export const EventArticleFetchSuccess = createAction(
  "EventArticleFetchSuccess"
);
export const EventArticleFetchFailed = createAction("EventArticleFetchFailed");

export const ArticleDetailFetching = createAction("ArticleDetailFetching");
export const ArticleDetailFetchSuccess = createAction(
  "ArticleDetailFetchSuccess"
);
export const ArticleDetailFetchFailed = createAction(
  "ArticleDetailFetchFailed"
);

export const JobApplying = createAction("JobApplying");
export const JobApplySuccess = createAction("JobApplySuccess");
export const JobApplyFailed = createAction("JobApplyFailed");

export function fetchJobList(page) {
  return async dispatch => {
    dispatch(JobArticleFetching());
    try {
      var params = {
        method: "GET"
      };
      const response = await fetchApi(
        `${constants.api.articleService}?slug=viec-lam&per_page=10&page=${page}`,
        params
      );
      dispatch(
        JobArticleFetchSuccess({
          page,
          response
        })
      );
    } catch (error) {
      dispatch(JobArticleFetchFailed(error));
    }
  };
}

export function fetchEventList(page) {
  return async dispatch => {
    dispatch(EventArticleFetching());
    try {
      var params = {
        method: "GET"
      };
      const response = await fetchApi(
        `${constants.api.articleService}?slug=su-kien&per_page=10&page=${page}`,
        params
      );
      dispatch(
        EventArticleFetchSuccess({
          page,
          response
        })
      );
    } catch (error) {
      dispatch(EventArticleFetchFailed(error));
    }
  };
}

export function fetchArticleDetail(slug) {
  return async dispatch => {
    dispatch(ArticleDetailFetching());
    try {
      var params = {
        method: "GET"
      };

      const response = await fetchApi(
        `${constants.api.articleDetailService}0?slug=${slug}`,
        params
      );
      dispatch(ArticleDetailFetchSuccess(response));
    } catch (error) {
      dispatch(ArticleDetailFetchFailed(error));
    }
  };
}

export function applyJob(id, infomation) {
  return async dispatch => {
    dispatch(JobApplying());
    try {
      let formData = new FormData();
      formData.append("name", infomation.fullName);
      formData.append("email", infomation.email);
      formData.append("info", infomation.description);
      if (infomation.fileUri && infomation.fileName) {
        formData.append("cv", {
          uri: infomation.fileUri,
          name: infomation.fileName,
          type: "multipart/form-data"
        });
      }
      var params = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: formData
      };

      const response = await fetchApi(
        `${constants.api.articleDetailService}${id}/apply`,
        params
      );
      dispatch(JobApplySuccess(response));
    } catch (error) {
      dispatch(JobApplyFailed(error.response));
    }
  };
}
