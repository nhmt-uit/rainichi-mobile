import { createAction } from "redux-act";
import * as Utils from "../../utils/utils";
import constants from "../../utils/constants";

export const GettingYourExam = createAction("GettingYourExam");
export const GetYourExamSuccess = createAction("GetYourExamSuccess");
export const GetYourExamFailure = createAction("GetYourExamFailure");

export const GettingYourExamTimesDetail = createAction(
  "GettingYourExamTimesDetail"
);
export const GettingYourExamTimesDetailSuccess = createAction(
  "GettingYourExamTimesDetailSuccess"
);
export const GettingYourExamTimesDetailFailure = createAction(
  "GettingYourExamTimesDetailFailure"
);

export function getYourExam() {
  return async dispatch => {
    dispatch(GettingYourExam());
    var params = {
      method: "GET"
    };
    try {
      const response = await Utils.fetchApi(`${constants.api.your_exam}?per_page=1000`, params);
      console.log(response);
      dispatch(GetYourExamSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(GetYourExamFailure(e));
    }
  };
}

export function getYourExamTimesDetail(id) {
  return async dispatch => {
    dispatch(GettingYourExamTimesDetail());
    var params = {
      method: "GET"
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.exam_times_detail + id,
        params
      );
      console.log(response);
      dispatch(GettingYourExamTimesDetailSuccess(response.data));
    } catch (e) {
      console.log(e);
      dispatch(GettingYourExamTimesDetailFailure(e));
    }
  };
}
