import { createReducer } from "redux-act";

import {
  CourseListFetched,
  CourseListFetching,
  CourseListFetchingFailed,
  ExamCourseListFetching,
  ExamCourseListFetched,
  ExamCourseListFetchingFailed,
  MyCourseFetching,
  MyCourseFetched,
  MyCourseFetchingFailed,
  MyCourseByIdFetched,
  MyCourseByIdFetching,
  MyCourseByIdFetchingFailed,
  CourseLessonByIdFetched,
  CourseLessonByIdFetching,
  CourseLessonByIdFetchingFailed,

  CourseDetailByIdFetched,
  CourseDetailByIdFetching,
  CourseDetailByIdFetchingFailed
} from "../actions";
const initialState = {
  courseLists: null,
  isCourseListsFetching: false,
  fetchingErrorMessage: null,

  examCourseList: null,
  isExamCourseListsFetching: false,
  fetchingExamCourseErrorMessage: null,

  isMyCouseFetching: false,
  myCourseList: null,
  fetchMyCourseErrorMessage: null,

  isMyCouseDetailFetching: false,
  myCourseDetail: null,
  fetchMyCourseDetailErrorMessage: null,

  isCouseLessonByIdFetching: false,
  courseLessonList: null,
  fetchCourseLessonByIdErrorMessage: null,

  courseDetailById: null
};
export default createReducer(
  {
    [CourseListFetched]: (state, response) => {
      return {
        ...state,
        isCourseListsFetching: false,
        courseLists: response.data
      };
    },
    [CourseListFetching]: state => {
      return {
        ...state,
        isCourseListsFetching: true
      };
    },
    [CourseListFetchingFailed]: (state, error) => {
      return {
        isCourseListsFetching: false,
        fetchingErrorMessage: error.message
      };
    },

    [ExamCourseListFetched]: (state, response) => {
      return {
        ...state,
        isExamCourseListsFetching: false,
        examCourseList: response.data
      };
    },
    [ExamCourseListFetching]: state => {
      return {
        ...state,
        isExamCourseListsFetching: true
      };
    },
    [ExamCourseListFetchingFailed]: (state, error) => {
      return {
        isExamCourseListsFetching: false,
        fetchingExamCourseErrorMessage: error.message
      };
    },

    [MyCourseFetched]: (state, response) => {
      return {
        ...state,
        isMyCouseFetching: false,
        myCourseList: response.data
      };
    },
    [MyCourseFetching]: state => {
      return {
        ...state,
        isMyCouseFetching: true,
        myCourseList: null
      };
    },
    [MyCourseFetchingFailed]: (state, error) => {
      return {
        ...state,
        isMyCouseFetching: false,
        fetchMyCourseErrorMessage: error.message
      };
    },

    [MyCourseByIdFetched]: (state, response) => {
      return {
        ...state,
        isMyCouseDetailFetching: false,
        myCourseDetail: response.data
      };
    },
    [MyCourseByIdFetching]: state => {
      return {
        ...state,
        isMyCouseDetailFetching: true,
        myCourseDetail: null
      };
    },
    [MyCourseByIdFetchingFailed]: (state, error) => {
      return {
        ...state,
        isMyCouseDetailFetching: false,
        fetchMyCourseDetailErrorMessage: error.message
      };
    },

    [CourseLessonByIdFetched]: (state, response) => {
      return {
        ...state,
        isCouseLessonByIdFetching: false,
        courseLessonList: response.data
      };
    },
    [CourseLessonByIdFetching]: state => {
      return {
        ...state,
        isCouseLessonByIdFetching: true,
        courseLessonList: null,
        fetchCourseLessonByIdErrorMessage: null
      };
    },
    [CourseLessonByIdFetchingFailed]: (state, error) => {
      return {
        ...state,
        isCouseLessonByIdFetching: false,
        fetchCourseLessonByIdErrorMessage: error.message
      };
    },


    [CourseDetailByIdFetched]: (state, response) => {
      return {
        ...state,
        courseDetailById: response.data
      };
    },
    [CourseDetailByIdFetching]: state => {
      return {
        ...state,
        courseDetailById: null,
      };
    },
    [CourseDetailByIdFetchingFailed]: (state, error) => {
      return {
        ...state,
        courseDetailById: null,
      };
    },

  },
  initialState
);