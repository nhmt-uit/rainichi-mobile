import {Platform} from 'react-native';
import {createAction} from 'redux-act';
import {fetchApi} from '../../utils/restful';
import constants from '../../utils/constants';
import {i18n} from '../../../locales';
import * as RNIap from '../../utils/iapStub';

export const CoinPriceFetching = createAction('CoinPriceFetching');
export const CoinPriceFetched = createAction('CoinPriceFetched');
export const CoinPriceFetchingFailed = createAction('CoinPriceFetchingFailed');

export const CoursePriceFetching = createAction('CoursePriceFetching');
export const CoursePriceFetched = createAction('CoursePriceFetched');
export const CoursePriceFetchingFailed = createAction(
  'CoursePriceFetchingFailed',
);

export const CourseTypeFetching = createAction('CourseTypeFetching');
export const CourseTypeFetched = createAction('CourseTypeFetched');
export const CourseTypeFetchingFailed = createAction(
  'CourseTypeFetchingFailed',
);

export const ExamQuestionsPackageTypeFetching = createAction(
  'ExamQuestionsPackageTypeFetching',
);
export const ExamQuestionsPackageTypeFetched = createAction(
  'ExamQuestionsPackageTypeFetched',
);
export const ExamQuestionsPackageTypeFetchingFailed = createAction(
  'ExamQuestionsPackageTypeFetchingFailed',
);

export const LevelTypeFetching = createAction('LevelTypeFetching');
export const LevelTypeFetched = createAction('LevelTypeFetched');
export const LevelTypeFetchingFailed = createAction('LevelTypeFetchingFailed');

// const itemSkus = Platform.select({
//   ios: [
//     'com.rainichi.package.test',
//     'android.test.purchased',
//     'android.test.canceled',
//     'android.test.item_unavailable',
//   ],
//   android: [
//     'com.rainichi.package.test',
//     'android.test.purchased',
//     'android.test.canceled',
//     'android.test.item_unavailable',
//   ],
// });

export function fetchCoinPrice() {
  return async dispatch => {
    dispatch(CoinPriceFetching());
    var params = {
      method: 'GET',
    };
    try {
      const response = await fetchApi(
        constants.api.credit + '?column=credit&order_by_type=ASC&per_page=100',
        params,
      );

      let android = [];
      let ios = [];

      let rainichiCoinList = response.data;
      rainichiCoinList.forEach(element => {
        console.log(element.packageId)
        android.push(element.packageId);
        ios.push(element.packageId);
        // ios.push("com.rainichi.package.test");
      });
      let itemSkus = Platform.select({android, ios});
      //Markup package id
      // rainichiCoinList.forEach(element => {
      // element.packageId = 'com.rainichi.package.test';
      // });

      const products = await RNIap.getProducts(itemSkus);

      let displayProduct = [];
      products.forEach(product => {
        rainichiCoinList.some(coin => {
          if (coin.packageId == product.productId) {
            displayProduct.push(coin);
            return true;
          }
        });
      });

      displayProduct.sort((a, b) => {
        return a.price - b.price;
      });

      //mark up
      response.data = displayProduct;

      console.log('RNIap.getProducts', products);
      dispatch(CoinPriceFetched(response));
    } catch (e) {
      dispatch(CoinPriceFetchingFailed(e));
    }
  };
}

export function fetchCoursePrice(courseTypeId, levelId, courseId) {
  return async dispatch => {
    dispatch(CoursePriceFetching());
    var params = {
      method: 'GET',
    };
    try {
      let url = constants.api.courseAdmin + '?is_shop=1&customer_type_id=1,2';
      if (courseId) {
        url = url + '&course_id=' + courseId;
      } else {
        if (courseTypeId) {
          url = url + '&course_type=' + courseTypeId + '';
        }
        if (levelId) {
          url = url + '&levels=' + '[' + levelId + ']';
        }
      }

      const response = await fetchApi(url, params);
      dispatch(CoursePriceFetched(response));
    } catch (e) {
      dispatch(CoursePriceFetchingFailed(e));
    }
  };
}

export function loadMoreCourse(nextLinkUrl) {
  return async dispatch => {
    dispatch(CoursePriceFetching());
    var params = {
      method: 'GET',
    };
    try {
      const response = await fetchApi(nextLinkUrl, params);
      dispatch(CoursePriceFetched(response));
    } catch (e) {
      dispatch(CoursePriceFetchingFailed(e));
    }
  };
}

export function fetchCourseType() {
  return async dispatch => {
    dispatch(CourseTypeFetching());
    var params = {
      method: 'GET',
    };
    try {
      const response = await fetchApi(constants.api.courseType, params);
      dispatch(CourseTypeFetched(response));
    } catch (e) {
      dispatch(CourseTypeFetchingFailed(e));
    }
  };
}

export function fetchExamQuestionsPackageType() {
  return async dispatch => {
    dispatch(ExamQuestionsPackageTypeFetching());
    var params = {
      method: 'GET',
    };
    try {
      const response = await fetchApi(
        constants.api.courseType + '?category=2',
        params,
      );
      dispatch(ExamQuestionsPackageTypeFetched(response));
    } catch (e) {
      dispatch(ExamQuestionsPackageTypeFetchingFailed(e));
    }
  };
}

export function fetchLevelType() {
  return async dispatch => {
    dispatch(LevelTypeFetching());
    var params = {
      method: 'GET',
    };
    try {
      const response = await fetchApi(constants.api.level, params);
      dispatch(LevelTypeFetched(response));
    } catch (e) {
      dispatch(LevelTypeFetchingFailed(e));
    }
  };
}
