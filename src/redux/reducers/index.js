import PracticeReducers from './PracticeReducers';
import GrammarReducers from './GrammarReducers';
import {combineReducers} from 'redux';
import {createReducer} from 'redux-act';
import AdReducers from './AdReducers';
import AuthenticateReducers from './AuthenticateReducers';
import CourseReducers from './CourseReducers';
import UserReducers from './UserReducers';
import VocabularyReducers from './VocabularyReducers';
import ConversationReducers from './ConversationReducers';
import SettingReducers from './SettingReducers';
import ListeningReducers from './ListeningReducers';
import ReadingReducers from './ReadingReducers';
import ShopReducers from './ShopReducers';
import PaymentReducers from './PaymentReducers';
import ExamReducers from './ExamReducers';
import CreditReducers from './CreditReducers';
import YourExamReducer from './YourExamReducer';
import GeneralExamReducers from './GeneralExamReducers';
import ArticleReducers from './ArticleReducers';
import IAPReducers from './IAPReducers';
import EventReducers from './EventReducers';

import {
  SplashFinish,
  SelectingCourseType,
  SelectingBasicCourseType,
} from '../actions';
const initialState = {
  splashFinished: false,
};

const SplashReducers = createReducer(
  {
    [SplashFinish]: state => ({
      ...state,
      splashFinished: true,
    }),
  },
  initialState,
);

const CourseTypeSelectionReducers = createReducer(
  {
    [SelectingCourseType]: (state, data) => ({
      ...state,
      isComboClicked: data,
    }),
  },
  {
    isComboClicked: false,
  },
);

const BasicCourseSelectionReducers = createReducer(
  {
    [SelectingBasicCourseType]: (state, data) => ({
      ...state,
      isBasicClicked: data,
    }),
  },
  {
    isBasicClicked: false,
  },
);

export default combineReducers({
  Practice: PracticeReducers,
  Grammar: GrammarReducers,
  Splash: SplashReducers,
  Ad: AdReducers,
  Authenticate: AuthenticateReducers,
  Course: CourseReducers,
  User: UserReducers,
  Vocabulary: VocabularyReducers,
  CourseType: CourseTypeSelectionReducers,
  Conversation: ConversationReducers,
  Setting: SettingReducers,
  BasicCourse: BasicCourseSelectionReducers,
  Listening: ListeningReducers,
  Reading: ReadingReducers,
  Shop: ShopReducers,
  Payment: PaymentReducers,
  Exam: ExamReducers,
  Credit: CreditReducers,
  YourExam: YourExamReducer,
  General: GeneralExamReducers,
  Article: ArticleReducers,
  IAP: IAPReducers,
  Event: EventReducers,
});
