import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";

export const CourseListFetched = createAction("CourseListFetched");
export const CourseListFetching = createAction("CourseListFetching");
export const CourseListFetchingFailed = createAction(
  "CourseListFetchingFailed"
);

export const ExamCourseListFetched = createAction("ExamCourseListFetched");
export const ExamCourseListFetching = createAction("ExamCourseListFetching");
export const ExamCourseListFetchingFailed = createAction(
  "ExamCourseListFetchingFailed"
);

export const MyCourseFetched = createAction("MyCourseFetched");
export const MyCourseFetching = createAction("MyCourseFetching");
export const MyCourseFetchingFailed = createAction("MyCourseFetchingFailed");

export const MyCourseByIdFetched = createAction("MyCourseByIdFetched");
export const MyCourseByIdFetching = createAction("MyCourseByIdFetching");
export const MyCourseByIdFetchingFailed = createAction(
  "MyCourseByIdFetchingFailed"
);

export const CourseLessonByIdFetched = createAction("CourseLessonByIdFetched");
export const CourseLessonByIdFetching = createAction("CourseLessonByIdFetching");
export const CourseLessonByIdFetchingFailed = createAction(
  "CourseLessonByIdFetchingFailed"
);

export const CourseDetailByIdFetched = createAction("CourseDetailByIdFetched");
export const CourseDetailByIdFetching = createAction("CourseDetailByIdFetching");
export const CourseDetailByIdFetchingFailed = createAction(
  "CourseDetailByIdFetchingFailed"
);

export const fetchCourseList = () => async dispatch => {
  dispatch(CourseListFetching());
  try {
    const response = await fetchApi(constants.api.courses);
    dispatch(CourseListFetched(response));
  } catch (error) {
    dispatch(CourseListFetchingFailed(error));
  }
};

export const fetchExamCourseList = () => async dispatch => {
  dispatch(ExamCourseListFetching());
  try {
    const response = await fetchApi(constants.api.courses + "?category=2");
    dispatch(ExamCourseListFetched(response));
  } catch (error) {
    dispatch(ExamCourseListFetchingFailed(error));
  }
};

export const fetchMyCourse = () => async dispatch => {
  dispatch(MyCourseFetching());
  try {
    const response = await fetchApi(constants.api.userService + "/my-courses" + "?per_page=1000");
    dispatch(MyCourseFetched(response));
  } catch (error) {
    dispatch(MyCourseFetchingFailed(error));
  }
};

export const fetchMyCourseById = id => async dispatch => {
  dispatch(MyCourseByIdFetching());
  try {
    const response = await fetchApi(
      constants.api.userService + "/my-course-detail/" + id 
    );
    dispatch(MyCourseByIdFetched(response));
  } catch (error) {
    dispatch(MyCourseByIdFetchingFailed(error));
  }
};

export const fetchCourseLessonById = id => async dispatch => {
  dispatch(CourseLessonByIdFetching());
  try {
    const response = await fetchApi(
      constants.api.courseLesson + id
    );
    dispatch(CourseLessonByIdFetched(response));
  } catch (error) {
    dispatch(CourseLessonByIdFetchingFailed(error));
  }
};


export const fetchCourseDetailById = id => async dispatch => {
  dispatch(CourseDetailByIdFetching());
  try {
    const response = await fetchApi(
      constants.api.courses + id
    );
    dispatch(CourseDetailByIdFetched(response));
  } catch (error) {
    dispatch(CourseDetailByIdFetchingFailed(error));
  }
};
