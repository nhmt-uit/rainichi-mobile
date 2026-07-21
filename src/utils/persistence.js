import * as Keychain from 'react-native-keychain';

// Ported from react-native-secure-key-store (a ~2019, now-abandoned library
// whose Android build.gradle calls the long-shut-down jcenter() repository
// and can't even build on current Gradle) to react-native-keychain, the
// current standard for secure key/value storage on iOS + Android. Keychain
// stores under a (service, username) pair rather than an arbitrary
// key -> value map, so each of the old keys becomes its own `service`, with
// a fixed dummy username and the real value stored as the "password".

const AUTH_PREF_KEY = 'Authentication';
const LANG_PREF_KEY = 'Language';
const FCM_TOKEN_PREF_KEY = 'Token';
const NOTIFCATION_PREF_KEY = 'Notification';
const SHARE_PREF_KEY = 'Share';

async function setItem(service, value) {
  await Keychain.setGenericPassword('rainichi', value, {service});
}

async function getItem(service) {
  const result = await Keychain.getGenericPassword({service});
  return result ? result.password : null;
}

async function removeItem(service) {
  await Keychain.resetGenericPassword({service});
}

exports.saveAuthenticationPref = async function saveAuthenticationPref(authentication) {
  try {
    await setItem(AUTH_PREF_KEY, JSON.stringify(authentication));
  } catch (e) {
    console.log('saveAuthenticationPref error: ' + e);
  }
};

exports.clearAuthentiationPref = async function clearAuthentiationPref() {
  try {
    await removeItem(AUTH_PREF_KEY);
  } catch (e) {
    console.log('clearAuthentiationPref error: ' + e);
  }
};

exports.getAuthenticationPref = async function getAuthenticationPref() {
  try {
    const result = await getItem(AUTH_PREF_KEY);
    return JSON.parse(result);
  } catch (e) {
    console.log('getAuthenticationPref error: ' + e);
    return null;
  }
};

exports.saveLanguagePref = async function saveLanguagePref(language) {
  try {
    await setItem(LANG_PREF_KEY, JSON.stringify(language));
  } catch (e) {
    console.log('saveLanguagePref error: ' + e);
  }
};

exports.getLanguagePref = async function getLanguagePref() {
  try {
    const result = await getItem(LANG_PREF_KEY);
    return JSON.parse(result);
  } catch (e) {
    console.log('getLanguagePref error: ' + e);
    return null;
  }
};

exports.saveFcmTokenPref = async function saveFcmTokenPref(fcmToken) {
  try {
    await setItem(FCM_TOKEN_PREF_KEY, fcmToken);
  } catch (e) {
    console.log('saveFcmTokenPref error: ' + e);
  }
};

exports.getFcmTokenPref = async function getFcmTokenPref() {
  try {
    return await getItem(FCM_TOKEN_PREF_KEY);
  } catch (e) {
    console.log('getFcmTokenPref error: ' + e);
    return null;
  }
};

exports.saveNotifcationPref = async function saveNotifcationPref(value) {
  try {
    await setItem(NOTIFCATION_PREF_KEY, value.toString());
  } catch (e) {
    console.log('saveNotifcationPref error: ' + e);
  }
};

exports.getNotifcationPref = async function getNotifcationPref() {
  try {
    const result = await getItem(NOTIFCATION_PREF_KEY);
    return result == 'true';
  } catch (e) {
    console.log('getNotifcationPref error: ' + e);
    return true;
  }
};

exports.saveSharePref = async function saveSharePref(map) {
  try {
    await setItem(SHARE_PREF_KEY, JSON.stringify(map));
  } catch (e) {
    console.log('saveSharePref error: ' + e);
  }
};

exports.getSharePref = async function getSharePref() {
  try {
    const result = await getItem(SHARE_PREF_KEY);
    return JSON.parse(result);
  } catch (e) {
    console.log('getNotifcationPref error: ' + e);
    return null;
  }
};
