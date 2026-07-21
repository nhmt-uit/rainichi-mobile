import {
  PracticeFetched,
  PracticeFetching,
  PracticeFetchingFailed,
  fetchPractice,
  PracticeResultUpdated,
  selectAnswer,
  PracticeSubmitted,
  PracticeSubmitting,
  PracticeSubmittingFailed,
  submitPractice,
  OpenNextCoursed,
  OpenNextCoursing,
  OpenNextCourseFailed,
  openNextCourse,
  submitExam,
  loadMorePractice,
  submitExamByTestResultId,
} from './PracticeActions';
import {createAction} from 'redux-act';

import * as AdActions from './AdActions';
import * as CourseActions from './CourseActions';
import * as UserActions from './UserActions';
import * as AuthenticateActions from './AuthenticateActions';
import * as VocabularyActions from './VocabularyActions';
import * as ConversationActions from './ConversationActions';
import * as GrammarActions from './GrammarActions';
import * as SettingActions from './SettingActions';
import * as ListeningActions from './ListeningActions';
import * as ReadingActions from './ReadingActions';
import * as ShopActions from './ShopActions';
import * as PaymentActions from './PaymentActions';
import * as ExamActions from './ExamActions';
import * as CreditActions from './CreditActions';
import * as YourExamActions from './YourExamActions';
import * as GeneralExamActions from './GeneralExamActions';
import * as ArticleActions from './ArticleActions';
import * as IAPActions from './IAPActions';
import * as EventActions from './EventActions';


const SplashFinish = createAction('SplashFinish');

const SelectingCourseType = createAction('SelectingCourseType');

const SelectingBasicCourseType = createAction('SelectingBasicCourseType');

const startSplashTimeout = () => dispatch => {
  setTimeout(() => {
    dispatch(SplashFinish());
  }, 1000);
};

const selectCourseComboType = isCombo => dispatch => {
  dispatch(SelectingCourseType(isCombo));
};

const selectCourseBasicType = isBasic => dispatch => {
  dispatch(SelectingBasicCourseType(isBasic));
};

module.exports = {
  PracticeFetched,
  PracticeFetching,
  PracticeFetchingFailed,
  fetchPractice,
  loadMorePractice,
  PracticeResultUpdated,
  selectAnswer,
  PracticeSubmitted,
  PracticeSubmitting,
  PracticeSubmittingFailed,
  OpenNextCoursed,
  OpenNextCoursing,
  OpenNextCourseFailed,
  submitPractice,
  openNextCourse,
  submitExam,
  submitExamByTestResultId,
  ...AdActions,
  ...CourseActions,
  ...UserActions,
  ...AuthenticateActions,
  ...VocabularyActions,
  ...ConversationActions,
  ...GrammarActions,
  ...SettingActions,
  ...ListeningActions,
  ...ReadingActions,
  ...ShopActions,
  ...PaymentActions,
  ...ExamActions,
  ...CreditActions,
  ...YourExamActions,
  ...GeneralExamActions,
  ...ArticleActions,
  ...IAPActions,
  ...EventActions,
  SplashFinish,
  startSplashTimeout,
  SelectingCourseType,
  selectCourseComboType,
  SelectingBasicCourseType,
  selectCourseBasicType,
};
