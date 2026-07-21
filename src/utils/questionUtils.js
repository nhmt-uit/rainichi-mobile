import constants from "./constants";

export function isMatch(question, userAnswers) {
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

export function isMatchSingleChoice(question, userAnswers) {
  const answers = question.answer;
  for (const prop in userAnswers) {
    if (userAnswers[prop] === true) {
      return answers[prop].is_correct;
    }
  }
  return false;
}

export function calculateAnswer(
  currentPracticeResult,
  { question, questionIndex, answerIndex }
) {
  const selectedMap = currentPracticeResult[questionIndex];
  const checkEnabled = question.type === constants.questionType.MULTI_CHOICE;
  let isCheck = true;
  if (selectedMap) {
    isCheck = selectedMap[answerIndex] !== true;
  }
  let newMap = null;
  if (checkEnabled) {
    newMap = { ...selectedMap, [answerIndex]: isCheck };
  } else {
    newMap = { [answerIndex]: isCheck };
  }
  answers = []
  for (const [key, value] of Object.entries(newMap)) {
    if (!isNaN(key) ){
      answers.push(question.answer[key].id)
    }
  }

  newMap.correct = isMatch(question, newMap);
  newMap.questionId = question.id
  newMap.answers = answers
  const newResult = currentPracticeResult.map(map => map);
  newResult[questionIndex] = newMap;
  console.log("newResult", newResult)
  return newResult;
}
