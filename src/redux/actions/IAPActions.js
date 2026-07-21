import {createAction} from 'redux-act';
import * as RNIap from '../../utils/iapStub';
import {fetchApi} from '../../utils/restful';
import constants from '../../utils/constants';
export const IAPProductFetching = createAction('IAPProductFetching');
export const IAPProductFetched = createAction('IAPProductFetched');
export const IAPProductFetchingFailed = createAction(
  'IAPProductFetchingFailed',
);

export const IAPProductValidating = createAction('IAPProductValidating');
export const IAPProductValidateSuccess = createAction(
  'IAPProductValidateSuccess',
);
export const IAPProductValidateFailed = createAction(
  'IAPProductValidateFailed',
);

const itemSkus = Platform.select({
  ios: ['com.rainichi.package.test'],
  android: ['com.rainichi.package.test'],
});

export const fetchIAPProduct = () => async dispatch => {
  dispatch(IAPProductFetching());
  try {
    const response = await fetchApi(
      constants.api.credit + '?column=credit&order_by_type=ASC',
      params,
    );

    let rainichiCoinList = response.data;
    //Markup package id
    rainichiCoinList.forEach(element => {
      element.packageId = 'com.rainichi.package.test';
    });
    // filter Out data

    const products = await RNIap.getProducts(itemSkus);
    console.log('fetchIAPProduct', products);
    dispatch(IAPProductFetched(products));
  } catch (error) {
    dispatch(IAPProductFetchingFailed(error));
  }
};

export const validateReceipt = (receipt, signature) => async dispatch => {
  dispatch(IAPProductValidating());
  var params = {
    method: 'POST',
    body: JSON.stringify({
      receipt,
      signature,
    }),
  };
  try {
    const response = await fetchApi(constants.api.iapService, params);
    console.log('validateReceipt', response);
    dispatch(IAPProductValidateSuccess(response));
  } catch (error) {
    dispatch(IAPProductValidateFailed(error));
  }
};
