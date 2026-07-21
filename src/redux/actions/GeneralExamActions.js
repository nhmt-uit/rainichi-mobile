import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";
import { PracticeSubmitted } from "../actions/PracticeActions";
export const SaveGeneralTestSection = createAction("SaveGeneralTestSection");
export const SaveGeneralTestTime = createAction("SaveGeneralTestTime");

export const AllExamSubmitting = createAction("AllExamSubmitting");
export const AllExamSubmitSuccess = createAction("AllExamSubmitSuccess");
export const AllExamSubmitFailed = createAction("AllExamSubmitFailed");

export function saveLocalTestSection(data) {
  return async dispatch => {
    markUp = markUpData(data);
    dispatch(SaveGeneralTestSection(markUp));
  };
}

export function saveLocalTestTime(time) {
  return async dispatch => {
    dispatch(SaveGeneralTestTime(time));
  };
}

export function calculateRemainTime(timeInSecond) {
  return async dispatch => {
    state = getGeneralReduxState();
    if (state && state.totalExamTime) {
      oldTimeInMinutes = state.totalExamTime;
      remainTime = oldTimeInMinutes - timeInSecond / 60;
      console.log(
        "calculateRemainTime",
        remainTime,
        oldTimeInMinutes,
        timeInSecond
      );
      dispatch(SaveGeneralTestTime(remainTime));
    }
  };
}

export function clearLocalTestSection() {
  return async dispatch => {
    dispatch(SaveGeneralTestSection(null));
  };
}

export function submitLocalTestSection(
  id,
  totalQuestion,
  totalScore,
  questions,
  answers
) {
  return async dispatch => {
    state = getGeneralReduxState();
    if (state && state.generalExamData) {
      let data = state.generalExamData;
      data.test_section.forEach(element => {
        if (element.id == id) {
          element.submitted = true;
          element.totalQuestion = totalQuestion;
          element.totalScore = totalScore;
          element.localQuestions = questions;
          element.answers = answers;
        }
      });
      dispatch(SaveGeneralTestSection(data));
    }
  };
}

export function submitAllExam(testResultId) {
  return async dispatch => {
    dispatch(AllExamSubmitting());
    try {
      test_result = buildSubmitAllData();
      const params = {
        method: "POST",
        body: JSON.stringify({
          test_result
        })
      };
      const url = `${constants.api.submitGeneralExamService}${testResultId}`;
      const response = await fetchApi(url, params);
      dispatch(
        PracticeSubmitted({
          score:0,
          totalQuestion:0,
          response
        })
      );
      dispatch(AllExamSubmitSuccess(response));
    } catch (e) {
      dispatch(AllExamSubmitFailed(e));
    }
  };
}

function buildSubmitAllData() {
  result = [];
  state = getGeneralReduxState();
  if (state && state.generalExamData) {
    let data = state.generalExamData;
    data.test_section.forEach(element => {
      //   totalScore = element.totalScore;
      //   totalQuestion = element.totalQuestion;
      if (element.submitted == false){
        totalScore = element.totalScore == null ? 0 : element.totalScore;
        totalQuestion = element.totalQuestion == null ? 0 : element.totalQuestion;
        questions = element.localQuestions == null ? {} : element.localQuestions;
        answers = element.answers == null ? {} : element.answers;
        let testResult = {
          test_section_id: element.id,
          total_score: totalScore,
          total_question: totalQuestion,
          questions: questions,
          answers: answers
        };
        result.push(testResult);
      }
    });
  }
  return result;
}

function markUpData(data) {
  data.test_section.forEach(element => {
    element.submitted = false;
  });
  return data;
}

function getGeneralReduxState() {
  // eslint-disable-next-line global-require
  const storeModule = require("../store");
  if (storeModule && storeModule.default) {
    const store = storeModule.default;
    const state = store.getState();
    if (state) {
      return state.General;
    }
  }
  return null;
}
