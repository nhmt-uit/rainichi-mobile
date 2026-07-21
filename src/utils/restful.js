import {i18n} from '../../locales';

function getAuthorization() {
  // eslint-disable-next-line global-require
  const storeModule = require('../redux/store');
  if (storeModule && storeModule.default) {
    const store = storeModule.default;
    const state = store.getState();
    if (state && state.Authenticate && state.Authenticate.data) {
      const {data} = state.Authenticate;
      if (data.access_token) {
        return `Bearer ${data.access_token}`;
      }
    }
  }
  return null;
}

function configureHeaders(params) {
  let mergedHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const author = getAuthorization();

  if (author) {
    mergedHeaders.Authorization = author;
  }

  if (params && params.headers) {
    mergedHeaders = {
      ...mergedHeaders,
      ...params.headers,
    };
  }

  return {
    ...params,
    headers: mergedHeaders,
  };
}

async function fetchApi(url, params, isKeep) {
  if (!isKeep) {
    // url = toHttps(url);
  }
  if (url.endsWith("/")){
    url = url.substring(0, url.lastIndexOf("/"))
  }
  if (url.includes("/?")){
    url = url.replace('/?', '?');
  }
  let mergedParams = {};
  if (!isCloudStorage(url)) {
    mergedParams = configureHeaders(params);
  }
  console.log("URL::", url)
  requestLog(url, mergedParams);
  const res = await fetch(url, mergedParams);
  // responseLog(res);
  const json = await responseToJson(res);
  if (res.ok) {
    let jsonString = JSON.stringify(json);
    let makeUpJson = jsonString.replace(/https:/g, 'http:');
    responseLog(json);
    // return json;
    return JSON.parse(makeUpJson);
  }
  let error = null;
  if (json.nonJsonResponse) {
    error = new Error(`${i18n.t('error.http_error')}: ${res.status}`);
  } else {
    let message = lookupErrorMessage(json);
    if (!message) {
      message = `${i18n.t('error.http_error')}: ${res.status}`;
    }
    error = new Error(message);
  }
  error.response = json;
  throw error;
}

async function responseToJson(res) {
  if (res.headers.map['content-type'] === 'application/json') {
    return res.json();
  }
  return {
    nonJsonResponse: true,
    text: await res.text(),
  };
}

function lookupErrorMessage(response) {
  const {code} = response;
  if (!code) {
    return response.message;
  }
  const message = i18n.t(`error_by_code.${code}`);
  if (!message) {
    return response.message;
  }
  if (message.match(/^\[missing "[\s\S]*" translation\]$/u)) {
    return response.message;
  }
  return message;
}

function responseLog(response) {
  // eslint-disable-next-line no-undef
  if (console && __DEV__) {
    // eslint-disable-next-line no-console
    console.log('REST API response ', response);
  }
}

function requestLog(url, params) {
  // eslint-disable-next-line no-undef
  if (console && __DEV__) {
    // eslint-disable-next-line no-console
    console.log('REST API request ', {url, params});
  }
}

// Wherever url is from storage server
function isCloudStorage(url) {
  if (url.includes('.cloudstorage.com.vn/') || url.includes('storebox.vn/')) {
    return true;
  }
  return false;
}

function toHttps(url) {
  return url.replace('http:', 'https:');
}

exports.fetchApi = fetchApi;
