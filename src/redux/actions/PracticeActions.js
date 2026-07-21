import {createAction} from 'redux-act';
import {fetchApi} from '../../utils/restful';
import constants from '../../utils/constants';
import {i18n} from '../../../locales';
import {calculateAnswer} from '../../utils/questionUtils';
import {submitLocalTestSection} from '../actions/GeneralExamActions';
export const PracticeFetched = createAction('PracticeFetched');
export const PracticeFetching = createAction('PracticeFetching');
export const PracticeFetchingFailed = createAction('PracticeFetchingFailed');
export const PracticeFetchingMore = createAction('PracticeFetchingMore');

// export const fetchPractice = (isInGroup, id) => async dispatch => {
//   dispatch(PracticeFetching());
//   try {
//     const url = isInGroup
//       ? constants.api.practiceInGroup
//       : constants.api.practiceInLesson;
//     const response = await fetchApi(`${url}${id}`);
//     dispatch(PracticeFetched(response));
//   } catch (error) {
//     dispatch(PracticeFetchingFailed(error));
//   }
// };

export const fetchPractice = (isExamMode, id) => async dispatch => {
  dispatch(PracticeFetching());
  try {
    const url = isExamMode
      ? constants.api.testQuestion
      : constants.api.practiceInLesson;
    const response = await fetchApi(`${url}${id}`);
    dispatch(PracticeFetched(response));
  } catch (error) {
    dispatch(PracticeFetchingFailed(error));
  }
};

export const loadMorePractice = (prevresponse, nextLink) => async dispatch => {
  dispatch(PracticeFetchingMore());
  try {
    const newResponse = await fetchApi(nextLink);
    response = mergeResponse(prevresponse, newResponse);
    dispatch(PracticeFetched(response));
  } catch (error) {
    dispatch(PracticeFetchingFailed(error));
  }
};

function mergeResponse(res1, res2) {
  return {...res1, ...res2, data: [...res1.data, ...res2.data]};
}

export const PracticeResultUpdated = createAction('PracticeResultUpdated');

export const selectAnswer = function(
  currentPracticeResult,
  {question, questionIndex, answerIndex},
) {
  return dispatch => {
    newResult = calculateAnswer(currentPracticeResult, {
      question,
      questionIndex,
      answerIndex,
    });
    dispatch(PracticeResultUpdated(newResult));
  };
};

export function isMatchSingleChoice(question, userAnswers) {
  const answers = question.answer;
  for (const prop in userAnswers) {
    if (userAnswers[prop] === true) {
      return answers[prop].is_correct;
    }
  }
  return false;
}

function isMatch(question, userAnswers) {
  if (!userAnswers) {
    return false;
  }
  const multiChoices = question.type === constants.questionType.MULTI_CHOICE;
  if (!multiChoices) {
    return isMatchSingleChoice(question, userAnswers);
  }
  const answers = question.answer;
  for (let i = 0; i < answers.length; i += 1) {
    if (answers[i].is_correct != Boolean(userAnswers[i])) {
      return false;
    }
  }
  return true;
}

function practiceResultScoring(
  practice,
  practiceResult,
  listeningResult,
  readingResult,
) {
  return (
    calculateScoreSingleQuestion(practiceResult) +
    calculateScore(listeningResult) +
    calculateScore(readingResult)
  );
}

function calculateTotalQuestion(practice) {
  let result = 0;
  practice.forEach(element => {
    childQuestions = element.child_questions;
    if (childQuestions.length == 0) {
      result += 1;
    } else {
      result += childQuestions.length;
    }
  });
  return result;
}

function calculateScoreSingleQuestion(result) {
  let score = 0;
  if (result != null) {
    result.forEach(element => {
      if (element.correct === true) {
        score += 1;
      }
    });
  }
  return score;
}

function calculateScore(results) {
  let score = 0;
  if (results != null) {
    results.map(result => {
      result.forEach(element => {
        if (element.correct === true) {
          score += 1;
        }
      });
    });
  }
  return score;
}

export const PracticeSubmitted = createAction('PracticeSubmitted');
export const PracticeSubmitting = createAction('PracticeSubmitting');
export const PracticeSubmittingFailed = createAction(
  'PracticeSubmittingFailed',
);

export const submitExam = function(
  lessonId,
  courseId,
  listeningResult,
  readingResult,
) {
  return async dispatch => {
    dispatch(PracticeSubmitting());
    try {
      const state = getReduxState();
      if (
        state &&
        state.practice &&
        state.practiceResult &&
        state.totalQuestion
      ) {
        const {practice, practiceResult, totalQuestion} = state;
        let score = practiceResultScoring(
          practice,
          practiceResult,
          listeningResult,
          readingResult,
        );
        const params = {
          method: 'POST',
          body: JSON.stringify({
            test_result: [
              {
                test_section_id: lessonId,
                score,
                total_question: totalQuestion,
              },
            ],
          }),
        };

        const url = `${constants.api.submitExam}${courseId}`;
        const response = await fetchApi(url, params);
        dispatch(
          PracticeSubmitted({
            score,
            totalQuestion,
            response,
          }),
        );
      } else {
        const error = new Error(i18n.t('error.empty_practice_result'));
        dispatch(PracticeSubmittingFailed(error));
      }
    } catch (e) {
      dispatch(PracticeSubmittingFailed(e));
    }
  };
};

export const submitPractice = function(
  lessonId,
  courseId,
  listeningResult,
  readingResult,
) {
  return async dispatch => {
    dispatch(PracticeSubmitting());
    try {
      const state = getReduxState();
      if (
        state &&
        state.practice &&
        state.practiceResult &&
        state.totalQuestion
      ) {
        const {practice, practiceResult, totalQuestion} = state;
        let score = practiceResultScoring(
          practice,
          practiceResult,
          listeningResult,
          readingResult,
        );
        const params = {
          method: 'POST',
          body: JSON.stringify({
            lesson_id: lessonId,
            score,
            total_question: totalQuestion,
            course_id: courseId,
          }),
        };

        const url = constants.api.submitPractice;
        const response = await fetchApi(url, params);
        dispatch(
          PracticeSubmitted({
            score,
            totalQuestion,
            response,
          }),
        );
      } else {
        const error = new Error(i18n.t('error.empty_practice_result'));
        dispatch(PracticeSubmittingFailed(error));
      }
    } catch (e) {
      dispatch(PracticeSubmittingFailed(e));
    }
  };
};

export const OpenNextCoursed = createAction('OpenNextCoursed');
export const OpenNextCoursing = createAction('OpenNextCoursing');
export const OpenNextCourseFailed = createAction('OpenNextCourseFailed');
export const openNextCourse = function(lessonId, courseId) {
  return async dispatch => {
    dispatch(OpenNextCoursing());
    try {
      const params = {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: lessonId,
          score: 1,
          total_question: 1,
          course_id: courseId,
        }),
      };

      const url = constants.api.submitPractice;
      const response = await fetchApi(url, params);
      dispatch(
        OpenNextCoursed({
          response,
        }),
      );
    } catch (e) {
      dispatch(OpenNextCourseFailed(e));
    }
  };
};

// Used for read-only purpose
function getReduxState() {
  // eslint-disable-next-line global-require
  const storeModule = require('../store');
  if (storeModule && storeModule.default) {
    const store = storeModule.default;
    const state = store.getState();
    if (state) {
      return state.Practice;
    }
  }
  return null;
}

export const submitExamByTestResultId = function(
  lessonId,
  testResultId,
  listeningResult,
  readingResult,
) {
  return async dispatch => {
    dispatch(PracticeSubmitting());
    try {
      const state = getReduxState();
      console.log("getReduxState", state)
      if (
        state &&
        state.practice 
        // &&
        // state.practiceResult &&
        // state.totalQuestion &&
        // state.totalScore
      ) {
        const {practice, practiceResult, totalQuestion, totalScore} = state;
        let score = practiceResultScoring(
          practice,
          practiceResult,
          listeningResult,
          readingResult,
        );

        let questions = calculateQuestion(
          practiceResult,
          listeningResult,
          readingResult,
        );

        let answers = calculateUserAnswer(
          practiceResult,
          listeningResult,
          readingResult,
        );
        const params = {
          method: 'POST',
          body: JSON.stringify({
            test_result: [
              {
                test_section_id: lessonId,
                total_score: totalScore,
                total_question: totalQuestion,
                questions,
                answers,
              },
            ],
          }),
        };
        dispatch(
          submitLocalTestSection(
            lessonId,
            totalQuestion,
            totalScore,
            questions,
            answers,
          ),
        );

        const url = `${constants.api.submitGeneralExamService}${testResultId}`;
        const response = await fetchApi(url, params);
        dispatch(
          PracticeSubmitted({
            score,
            totalQuestion,
            response,
          }),
        );
      } else {
        const error = new Error(i18n.t('error.empty_practice_result'));
        dispatch(PracticeSubmittingFailed(error));
      }
    } catch (e) {
      dispatch(PracticeSubmittingFailed(e));
    }
  };
};

function calculateQuestion(practiceResult, listeningResult, readingResult) {
  let questions = {};
  if (practiceResult != null) {
    practiceResult.forEach(element => {
      questions[element.questionId] = element.correct === true;
    });
  }

  if (listeningResult != null) {
    listeningResult.map(result => {
      result.forEach(element => {
        questions[element.questionId] = element.correct === true;
      });
    });
  }

  if (readingResult != null) {
    readingResult.map(result => {
      result.forEach(element => {
        questions[element.questionId] = element.correct === true;
      });
    });
  }
  return questions;
}

function calculateUserAnswer(practiceResult, listeningResult, readingResult) {
  let answers = {};
  if (practiceResult != null) {
    practiceResult.forEach(element => {
      answers[element.questionId] = element.answers;
    });
  }

  if (listeningResult != null) {
    listeningResult.map(result => {
      result.forEach(element => {
        answers[element.questionId] = element.answers;
      });
    });
  }
  if (readingResult != null) {
    readingResult.map(result => {
      result.forEach(element => {
        answers[element.questionId] = element.answers;
      });
    });
  }
  return answers;
}
