import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";

export const ExamListByIdFetching = createAction("ExamListByIdFetching");

export const ExamListByIdFetchSuccess = createAction(
  "ExamListByIdFetchSuccess"
);
export const JLPTExamListFetchSuccess = createAction(
  "JLPTExamListFetchSuccess"
);
export const LTExamListFetchSuccess = createAction("LTExamListFetchSuccess");
export const ExamListByIdFetchFailed = createAction("ExamListByIdFetchFailed");

export const ExamDetailFetching = createAction("ExamDetailFetching");
export const ExamDetailFetchSuccess = createAction("ExamDetailFetchSuccess");
export const ExamDetailFetchFailed = createAction("ExamDetailFetchFailed");

export const ExamPriceFetching = createAction("ExamPriceFetching");
export const ExamPriceFetchSuccess = createAction("ExamPriceFetchSuccess");
export const ExamPriceFetchFailed = createAction("ExamPriceFetchFailed");

export const ExamSectionCreating = createAction("ExamSectionCreating");
export const ExamSectionCreateSuccess = createAction(
  "ExamSectionCreateSuccess"
);
export const ExamSectionCreateFailed = createAction("ExamSectionCreateFailed");

export function fetchExamListById(type) {
  return async dispatch => {
    dispatch(ExamListByIdFetching());
    try {
      var params = {
        method: "GET"
      };
      const response = await fetchApi(
        constants.api.testAdmin + "?type=" + type,
        params
      );
      dispatch(ExamListByIdFetchSuccess(response));
    } catch (error) {
      dispatch(ExamListByIdFetchFailed(error));
    }
  };
}

export function fetchAllExamList() {
  return async dispatch => {
    dispatch(ExamListByIdFetching());
    try {
      var params = {
        method: "GET"
      };
      const jlpt = await fetchApi(
        constants.api.testAdmin + "?type=" + constants.examType.JLPT,
        params
      );
      dispatch(JLPTExamListFetchSuccess(jlpt));

      const lt = await fetchApi(
        constants.api.testAdmin + "?type=" + constants.examType.LT,
        params
      );
      dispatch(LTExamListFetchSuccess(lt));
    } catch (error) {
      dispatch(ExamListByIdFetchFailed(error));
    }
  };
}

export function fetchAllExamListById(courseId, level) {
  return async dispatch => {
    dispatch(ExamListByIdFetching());
    try {
      var params = {
        method: "GET"
      };
      let url = constants.api.testAdmin + "?course_id=" + courseId;
      if (level) {
        url = url + "&levels=" + "[" + level + "]";
      }
      const jlpt = await fetchApi(
        url + "&type=" + constants.examType.JLPT,
        params
      );
      dispatch(JLPTExamListFetchSuccess(jlpt));

      const lt = await fetchApi(url + "&type=" + constants.examType.LT, params);
      dispatch(LTExamListFetchSuccess(lt));
    } catch (error) {
      dispatch(ExamListByIdFetchFailed(error));
    }
  };
}

export function fetchExamDetailById(id) {
  return async dispatch => {
    dispatch(ExamDetailFetching());
    try {
      var params = {
        method: "GET"
      };
      const response = await fetchApi(`${constants.api.test}${id}`, params);
      dispatch(ExamDetailFetchSuccess(response));
    } catch (error) {
      dispatch(ExamDetailFetchFailed(error));
    }
  };
}

export function fetchExamPrice(
  examQuestionsPackageId,
  levelId,
  examTypeId,
  examId
) {
  return async dispatch => {
    dispatch(ExamPriceFetching());
    var params = {
      method: "GET"
    };
    try {
      let url = constants.api.testAdmin + "?";
      console.log("=========examId", examId);
      if (examId) {
        url = url + "&test_id=" + examId;
      } else {
        if (examQuestionsPackageId) {
          url = url + "&course_type_id=" + examQuestionsPackageId + "";
        }
        if (levelId) {
          url = url + "&levels=" + "[" + levelId + "]" + "";
        }
        if (examTypeId) {
          url = url + "&type=" + examTypeId;
        }
      }
      const response = await fetchApi(url, params);
      dispatch(ExamPriceFetchSuccess(response));
    } catch (error) {
      dispatch(ExamPriceFetchFailed(error));
    }
  };
}

export function loadMoreExamPrice(nextLinkUrl) {
  return async dispatch => {
    dispatch(ExamPriceFetching());
    var params = {
      method: "GET"
    };
    try {
      const response = await fetchApi(nextLinkUrl, params);
      dispatch(ExamPriceFetchSuccess(response));
    } catch (e) {
      dispatch(ExamPriceFetchFailed(e));
    }
  };
}

export function createExamSection(examId) {
  return async dispatch => {
    dispatch(ExamSectionCreating());
    var params = {
      method: "POST"
    };
    try {
      const response = await fetchApi(`${constants.api.createExamSection}${examId}`, params);
      dispatch(ExamSectionCreateSuccess(response));
    } catch (e) {
      dispatch(ExamSectionCreateFailed(e));
    }
  };
}
