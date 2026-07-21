import { createAction } from "redux-act";
import { fetchApi } from "../../utils/restful";
import constants from "../../utils/constants";
import { i18n } from "../../../locales";

export const CreatingPayment = createAction("CreatingPayment");
export const CreatePaymentSuccess = createAction("CreatePaymentSuccess");
export const CreatePaymentFailed = createAction("CreatePaymentFailed");

export const VerifyingPayment = createAction("VerifyingPayment");
export const VerifyPaymentSuccess = createAction("VerifyPaymentSuccess");
export const VerifyPaymentFailed = createAction("VerifyPaymentFailed");

export const BuyingCourse = createAction("BuyingCourse");
export const BuyCourseSuccess = createAction("BuyCourseSuccess");
export const BuyCourseFailed = createAction("BuyCourseFailed");

export const BuyingTest = createAction("BuyingTest");
export const BuyingTestSuccess = createAction("BuyingTestSuccess");
export const BuyingTestFailed = createAction("BuyingTestFailed");

export const CreatingPaymentOffilne = createAction("CreatingPaymentOffilne");
export const CreatingPaymentOffilneSuccess = createAction(
  "CreatingPaymentOffilneSuccess"
);
export const CreatingPaymentOffilneFailed = createAction(
  "CreatingPaymentOffilneFailed"
);

export const CreatingPaymentTransfer = createAction("CreatingPaymentTransfer");
export const CreatingPaymentTransferSuccess = createAction(
  "CreatingPaymentTransferSuccess"
);
export const CreatingPaymentTransferFailed = createAction(
  "CreatingPaymentTransferFailed"
);

export function createPayment(type, credit, amount) {
  return async dispatch => {
    dispatch(CreatingPayment());
    try {
      var params = {
        method: "POST",
        body: JSON.stringify({
          payment_type: type,
          vpc_OrderInfo: credit,
          vpc_Amount: amount,
          vpc_Locale: "vn"
        })
      };
      const response = await fetchApi(constants.api.payment, params);
      dispatch(CreatePaymentSuccess(response));
    } catch (error) {
      dispatch(CreatePaymentFailed(error));
    }
  };
}

export function verifyPayment(url) {
  return async dispatch => {
    dispatch(VerifyingPayment());
    try {
      var params = {
        method: "GET"
      };
      const response = await fetchApi(url, params);
      dispatch(VerifyPaymentSuccess(response));
    } catch (error) {
      dispatch(VerifyPaymentFailed(error));
    }
  };
}

export function buyCourse(id, price) {
  return async dispatch => {
    dispatch(BuyingCourse());
    try {
      var params = {
        method: "POST",
        body: JSON.stringify({
          course_id: id,
          buying_credits: price.buying_credits,
          reward_credits: price.reward_credits,
          duration: price.price_types.duration
        })
      };
      const response = await fetchApi(constants.api.buyCourse, params);
      dispatch(BuyCourseSuccess(response));
    } catch (error) {
      dispatch(BuyCourseFailed(error));
    }
  };
}

export function buyTest(id, price) {
  return async dispatch => {
    dispatch(BuyingTest());
    try {
      var params = {
        method: "POST",
        body: JSON.stringify({
          test_id: id,
          buying_credits: price,
          reward_credits: 0,
          duration: 0
        })
      };
      const response = await fetchApi(constants.api.buyTest, params);
      dispatch(BuyingTestSuccess(response));
    } catch (error) {
      dispatch(BuyingTestFailed(error));
    }
  };
}

export function createPaymentOffline(credit, amount) {
  return async dispatch => {
    dispatch(CreatingPaymentOffilne());
    try {
      var params = {
        method: "POST",
        body: JSON.stringify({
          payment_type: "OFFLINE",
          vpc_OrderInfo: credit,
          vpc_Amount: amount
        })
      };
      const response = await fetchApi(constants.api.payment_offine, params);
      dispatch(CreatingPaymentOffilneSuccess(response));
    } catch (error) {
      dispatch(CreatingPaymentOffilneFailed(error));
    }
  };
}

export function createPaymentTransfer(credit, amount) {
  return async dispatch => {
    dispatch(CreatingPaymentTransfer());
    try {
      var params = {
        method: "POST",
        body: JSON.stringify({
          payment_type: "TRANSFER",
          vpc_OrderInfo: credit,
          vpc_Amount: amount
        })
      };
      const response = await fetchApi(constants.api.payment_offine, params);
      dispatch(CreatingPaymentTransferSuccess(response));
    } catch (error) {
      dispatch(CreatingPaymentTransferFailed(error));
    }
  };
}
