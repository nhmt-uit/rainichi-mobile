import {createReducer} from 'redux-act';
import {
  IAPProductFetching,
  IAPProductFetched,
  IAPProductFetchingFailed,

  IAPProductValidating,
  IAPProductValidateSuccess,
  IAPProductValidateFailed


} from '../actions';

const initialState = {
  products: null,
  isProductLoading: false,
  loadProductError: null,

  isValidatingIAP:false,
  validateIAPResponse: null,
  validateIAPError: null,
};

export default createReducer(
  {
    [IAPProductFetching]: state => {
      return {
        ...state,
        isProductLoading: true,
        products: null,
        loadProductError: null,
      };
    },
    [IAPProductFetched]: (state, response) => {
      return {
        ...state,
        isProductLoading: false,
        products: response,
      };
    },

    [IAPProductFetchingFailed]: (state, error) => {
      return {
        ...state,
        isProductLoading: false,
        loadProductError: error.message,
      };
    },


    [IAPProductValidating]: state => {
      return {
        ...state,
        isValidatingIAP: true,
        validateIAPResponse: null,
        validateIAPError: null,
      };
    },
    [IAPProductValidateSuccess]: (state, response) => {
      return {
        ...state,
        isValidatingIAP: false,
        validateIAPResponse: response.data,
      };
    },

    [IAPProductValidateFailed]: (state, error) => {
      return {
        ...state,
        isValidatingIAP: false,
        validateIAPError: error.message,
      };
    },
  },
  initialState,
);
