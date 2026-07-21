/**
 * @providesModule constants
 */

// stg
// const PRODUCTION_HOST = "https://stg.api.rainichi.com";
// const DEV_HOST = "https://stg.api.rainichi.com";
// const WEBSITE = "https://stg.rainichi.com/";
// const ADMIN_SITE = "http://stg.admin.rainichi.com/";

// const PRODUCTION_HOST = "http://10.0.100.71:8888/ranichi-backend/public";
// const DEV_HOST = "http://10.0.100.71:8888/ranichi-backend/public";

// const PRODUCTION_HOST = "http://localhost:8888/ranichi-backend/public";
// const DEV_HOST = "http://localhost:8888/ranichi-backend/public";

// iOS Simulator shares the host Mac's network stack, so 127.0.0.1 reaches
// the backend running on the host directly. The Android Emulator runs its
// own virtual network where 127.0.0.1 means the emulator itself -- 10.0.2.2
// is the AVD's alias for the host machine's loopback.
import {Platform} from 'react-native';
const LOCAL_BACKEND_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const PRODUCTION_HOST = `http://${LOCAL_BACKEND_HOST}:8000`;
const DEV_HOST = `http://${LOCAL_BACKEND_HOST}:8000`;

//prod
// const PRODUCTION_HOST = 'https://api-prod.rainichi.com';
// const DEV_HOST = 'https://api-prod.rainichi.com';
const WEBSITE = 'https://www.rainichi.vn/';
const ADMIN_SITE = 'https://admin.rainichi.com/';

// eslint-disable-next-line no-undef
var API_HOST = __DEV__ ? `${DEV_HOST}/api` : `${PRODUCTION_HOST}/api`;
var HOST = __DEV__ ? DEV_HOST : PRODUCTION_HOST;

export default {
  api: {
    authService: `${API_HOST}/auth`,
    courses: `${API_HOST}/course/`,
    courseLesson: `${API_HOST}/course/get-lesson-by/`,
    courseChildren: `${API_HOST}/course/children/`,
    userService: `${API_HOST}/user`,
    vocabularyService: `${API_HOST}/vocabulary`,
    vocabularyGroupService: `${API_HOST}/vocabulary-group`,
    lessonVocabularyService: `${API_HOST}/lesson/get-vocabulary`,
    kanji: `${API_HOST}/kanji/text/`,
    conversationInLesson: `${API_HOST}/conversation/in-lesson/`,
    conversationInGroup: `${API_HOST}/conversation/in-group/`,
    grammarInLesson: `${API_HOST}/grammar/in-lesson/`,
    grammarInGroup: `${API_HOST}/grammar/in-group/`,
    language: `${API_HOST}/language`,
    practiceInLesson: `${API_HOST}/exercise/in-lesson/`,
    practiceInGroup: `${API_HOST}/exercise/in-lesson/`,
    submitPractice: `${API_HOST}/exercise/submit`,
    kanjiListInLesson: `${API_HOST}/kanji/in-lesson`,
    listeningInLesson: `${API_HOST}/listening/in-lesson/`,
    readingInLesson: `${API_HOST}/reading/in-lesson/`,
    credit: `${API_HOST}/credit/`,
    courseAdmin: `${API_HOST}/course/admin/`,
    courseType: `${API_HOST}/course-type`,
    level: `${API_HOST}/level`,
    payment: `${API_HOST}/payment`,
    buyCourse: `${API_HOST}/buying/course/`,
    buyTest: `${API_HOST}/buying/test/`,
    testAdmin: `${API_HOST}/test/`,
    test: `${API_HOST}/test/`,
    testQuestion: `${API_HOST}/test/get-question-by-tab/`,
    submitExam: `${API_HOST}/test/submit-test/`,
    createExamSection: `${API_HOST}/test/submit-new-test/`,
    creditTransaction: `${API_HOST}/order/user-transaction`,
    your_exam: `${API_HOST}/user/my-tests`,
    exam_times_detail: `${API_HOST}/user/my-test-detail/`,
    payment_offine: `${API_HOST}/buying/offline`,
    socialLoginService: `${API_HOST}/auth/social-login-mobile`,
    adService: `${API_HOST}/slider/`,
    kanjiService: `${HOST}/kanji/`,
    kanjiALl: `${API_HOST}/kanji/all-in-lesson/`,
    drawKanjiService: `${API_HOST}/draw-kanji/`,
    submitGeneralExamService: `${API_HOST}/test/submit-test-detail/`,
    website: `${WEBSITE}`,
    articleService: `${API_HOST}/category/articles/`,
    articleDetailService: `${API_HOST}/article/`,
    facebookMessenger: 'https://www.messenger.com/t/578924132236581',
    adminSite: `${ADMIN_SITE}`,
    iapService: `${API_HOST}/payment-iap`,
    fcmService: `${API_HOST}/user-token-device/`,
    share: `${API_HOST}/share/`,
    reward: `${API_HOST}/reward-rule/`,
    appleLogin: `${API_HOST}/auth/login-by-mobile-apple`,
  },
  skillType: {
    VOCABULARY: 1,
    GRAMMAR: 2,
    KANJI: 3,
    READING: 4,
    LISTENING: 5,
    CONVERSATION: 6,
    SONG: 7,
    TEST: 8,
    PRACTICE: 9,
  },
  questionType: {
    SINGLE_CHOICE: 1,
    MULTI_CHOICE: 2,
  },
  vocabularyType: {
    KANJI: 1,
    KANJI_HIRAGANA: 2,
    HIRAGANA: 3,
    KATAKANA: 4,
    ALPHABET: 5,
  },
  lessonStatus: {
    LOCK: 0,
    IN_PROGRESS: 1,
    DONE: 2,
  },
  basicType: {
    SKILL: 0,
    CONCEPT: 1,
    ALPHABET: 2,
    NUMBER: 3,
    PRACTICE: 4,
    CONNECTION_WORD: 5,
  },
  specialCharacterType: {
    KANJI: 'kanji',
    NUMBER: 'number',
    CONNECTION_WORK: 'conection',
  },
  examType: {
    JLPT: 1,
    LT: 2,
  },
  questionCategoryType: {
    READING: 4,
    LISTENING: 5,
    EXERCISE: 9,
  },
  courseResult: {
    DONE: 'DONE',
    IN_PROGRESS: 'IN_PROGRESS',
    NEW: 'NEW',
  },
  shopTab: {
    COIN: 2,
    COURSE: 0,
    EXAM: 1,
  },
  examResult: {
    PASSED: 'PASSED',
    FAILED: 'FAILED',
    NONE: 'NONE',
  },
};
