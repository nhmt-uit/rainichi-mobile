import { createReducer } from "redux-act";
import {
  CreatingPayment,
  CreatePaymentSuccess,
  CreatePaymentFailed,
  VerifyingPayment,
  VerifyPaymentSuccess,
  VerifyPaymentFailed,
  BuyingCourse,
  BuyCourseSuccess,
  BuyCourseFailed,
  BuyingTest,
  BuyingTestSuccess,
  BuyingTestFailed,
  CreatingPaymentOffilne,
  CreatingPaymentOffilneSuccess,
  CreatingPaymentOffilneFailed,
  CreatingPaymentTransfer,
  CreatingPaymentTransferSuccess,
  CreatingPaymentTransferFailed
} from "../actions";
const initialState = {
  data: null,
  dataPaymentOffline: null,
  dataPaymentTransfer: null,
  isCreatingPayment: false,
  isVerifyingPayment: false,
  verifyResponse: null,
  isBuyingCourse: false,
  buyCourseResponse: null,
  buyCourseError: null,
  isBuyingTest: false,
  buyTestResponse: null,
  buyTestError: null
};

export default createReducer(
  {
    [CreatingPayment]: state => {
      return {
        ...state,
        isCreatingPayment: true
      };
    },
    [CreatePaymentSuccess]: (state, response) => {
      return {
        ...state,
        isCreatingPayment: false,
        data: response.data
      };
    },
    [CreatePaymentFailed]: (state, error) => {
      return {
        ...state,
        isCreatingPayment: false,
        data: null
      };
    },
    [CreatingPaymentOffilne]: state => {
      return {
        ...state,
        isCreatingPayment: true,
        dataPaymentTransfer: null
      };
    },
    [CreatingPaymentOffilneSuccess]: (state, response) => {
      return {
        ...state,
        isCreatingPayment: false,
        dataPaymentOffline: response.data
      };
    },
    [CreatingPaymentOffilneFailed]: (state, error) => {
      return {
        ...state,
        isCreatingPayment: false,
        dataPaymentOffline: null
      };
    },
    [CreatingPaymentTransfer]: state => {
      return {
        ...state,
        isCreatingPayment: true,
        dataPaymentOffline: null
      };
    },
    [CreatingPaymentTransferSuccess]: (state, response) => {
      return {
        ...state,
        isCreatingPayment: false,
        dataPaymentTransfer: response.data
      };
    },
    [CreatingPaymentTransferFailed]: (state, error) => {
      return {
        ...state,
        isCreatingPayment: false,
        dataPaymentTransfer: null
      };
    },
    [VerifyingPayment]: state => {
      return {
        ...state,
        isVerifyingPayment: true,
        verifyResponse:null
      };
    },
    [VerifyPaymentSuccess]: (state, response) => {
      return {
        ...state,
        isVerifyingPayment: false,
        verifyResponse: response
      };
    },
    [VerifyPaymentFailed]: (state, error) => {
      return {
        ...state,
        isVerifyingPayment: false,
        verifyResponse: null
      };
    },
    [BuyingCourse]: state => {
      return {
        ...state,
        isBuyingCourse: true,
        buyCourseResponse: null,
        buyCourseError:null
      };
    },
    [BuyCourseSuccess]: (state, response) => {
      return {
        ...state,
        isBuyingCourse: false,
        buyCourseResponse: response,
        buyCourseError: null
      };
    },
    [BuyCourseFailed]: (state, error) => {
      return {
        ...state,
        isBuyingCourse: false,
        buyCourseResponse: null,
        buyCourseError: error.message
      };
    },
    [BuyingTest]: state => {
      return {
        ...state,
        isBuyingTest: true,
        buyTestResponse: null,
        buyTestError:null
      };
    },
    [BuyingTestSuccess]: (state, response) => {
      return {
        ...state,
        isBuyingTest: false,
        buyTestResponse: response,
        buyTestError: null
      };
    },
    [BuyingTestFailed]: (state, error) => {
      return {
        ...state,
        isBuyingTest: false,
        buyTestResponse: null,
        buyTestError: error.message
      };
    }
  },
  initialState
);