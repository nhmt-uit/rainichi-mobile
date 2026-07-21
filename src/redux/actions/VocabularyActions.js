import { createAction } from "redux-act";
import * as Utils from "../../utils/utils";
import constants from "../../utils/constants";

export const LoadingVocabularyList = createAction("LoadingVocabularyList");
export const LoadVocabularyListSuccess = createAction(
  "LoadVocabularyListSuccess"
);
export const LoadVocabularyListFailure = createAction(
  "LoadVocabularyListFailure"
);

export const LoadingVocabularyByLessonId = createAction(
  "LoadingVocabularyByLessonId"
);
export const LoadVocabularyByLessonIdSuccess = createAction(
  "LoadVocabularyByLessonIdSuccess"
);
export const LoadVocabularyByLessonIdFailure = createAction(
  "LoadVocabularyByLessonIdFailure"
);

export const LoadingKanjiByCourseId = createAction("LoadingKanjiByCourseId");
export const LoadKanjiByCourseIdSuccess = createAction(
  "LoadKanjiByCourseIdSuccess"
);
export const LoadKanjiByCourseIdFailure = createAction(
  "LoadKanjiByCourseIdFailure"
);

export function loadVocabularyList() {
  return async dispatch => {
    dispatch(LoadingVocabularyList());
    var params = {
      method: "GET"
    };
    try {
      const response = await Utils.fetchApi(
        constants.api.vocabularyService,
        params
      );
      dispatch(LoadVocabularyListSuccess(response));
    } catch (e) {
      dispatch(LoadVocabularyListFailure(e));
    }
  };
}

// Todo: Below methods can be rewitten in utils for reused.

function getNextLink(response) {
  if (!response) {
    return null;
  }
  if (!response.meta) {
    return null;
  }
  if (!response.meta.pagination) {
    return null;
  }
  const { links } = response.meta.pagination;
  if (!links) {
    return null;
  }
  return links.next;
}
function mergeResponse(res1, res2) {
  return { ...res1, ...res2, data: [...res1.data, ...res2.data] };
}
function normalizeMetaData(response) {
  if (response && response.meta) {
    const { total } = response.meta;
    return {
      ...response,
      meta: {
        total,
        count: total
      }
    };
  }
  return response;
}
export function loadCharactersByLesson(lessonId, specialType) {
  let baseUrl = constants.api.lessonVocabularyService;
  if (specialType) {
    switch (specialType) {
      case constants.specialCharacterType.KANJI:
        baseUrl = constants.api.kanjiListInLesson;
        break;
      default:
        baseUrl = constants.api.lessonVocabularyService;
        break;
    }
  }
  return loadVocabularyByLessonIdEx(lessonId, true, baseUrl);
}

export function loadVocabularyByLessonId(lessonId, isLoadAll) {
  return loadVocabularyByLessonIdEx(
    lessonId,
    isLoadAll,
    constants.api.lessonVocabularyService
  );
}
function loadVocabularyByLessonIdEx(lessonId, isLoadAll, baseUri) {
  return async dispatch => {
    dispatch(LoadingVocabularyByLessonId());
    var params = {
      method: "GET"
    };
    try {
      let response = await Utils.fetchApi(`${baseUri}/${lessonId}`, params);
      if (isLoadAll) {
        let nextLink = getNextLink(response);
        while (nextLink) {
          // Disable this eslint rule because output of one iteration used as the input to another.
          // eslint-disable-next-line no-await-in-loop
          const newResponse = await Utils.fetchApi(nextLink);
          nextLink = getNextLink(newResponse);
          response = mergeResponse(response, newResponse);
        }
      }
      dispatch(LoadVocabularyByLessonIdSuccess(response));
    } catch (e) {
      dispatch(LoadVocabularyByLessonIdFailure(e));
    }
  };
}

export function loadMoreVocabularyByLessonId(prevresponse, nextLink) {
  return async dispatch => {
    dispatch(LoadingVocabularyByLessonId());
    try {
      const newResponse = await Utils.fetchApi(nextLink);
      response = mergeResponse(prevresponse, newResponse);
      dispatch(LoadVocabularyByLessonIdSuccess(response));
    } catch (e) {
      dispatch(LoadVocabularyByLessonIdFailure(e));
    }
  };
}

export function loadKanjiByCourseId(courseId) {
  return async dispatch => {
    dispatch(LoadingKanjiByCourseId());
    try {
      const response = await Utils.fetchApi(
        `${constants.api.kanjiALl}${courseId}`
      );
      let data = response.data;
      let kanji = data.kanji;
      let wrapper = [];

      Object.keys(kanji).forEach(element => {
        let kanjiArray = kanji[element];
        data.group_by.some(item => {
          if (element == item.group_chapter_id) {
            let object = {};
            object["kanjis"] = kanjiArray;
            object["metadata"] = item;
            wrapper.push(object);
            return true;
          }
        });
      });
      console.log("wrapper", wrapper);
      dispatch(LoadKanjiByCourseIdSuccess(wrapper));
    } catch (e) {
      dispatch(LoadKanjiByCourseIdFailure(e));
    }
  };
}
