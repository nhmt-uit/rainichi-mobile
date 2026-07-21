import {Dimensions} from 'react-native';
import {i18n} from '../../locales';
import {fetchApi} from './restful';
import Url from 'url';
// TODO(Giai đoạn 2): re-add react-native-snackbar (or a modern replacement)
// and src/assets/colors once those are ported. resetNavStack below is
// rewritten for @react-navigation v7 instead of the old react-navigation v2
// imperative StackActions/NavigationActions API.

exports.fetchApi = fetchApi;

exports.test = async function() {
  try {
    const res = await fetchApi(
      'http://raw.githubusercontent.com/DiepEsc/alert-simple-js/master/demoApi',
      {ppp: 'x'},
    );
    alert(JSON.stringify(res));
  } catch (e) {
    alert(e);
  }
};

const emptyObject = {};

exports.undefined = emptyObject.undefined;

function containProps(object, props) {
  if (!props || props === {}) {
    return true;
  }
  if (!object) {
    return false;
  }
  for (const prop in props) {
    if (Reflect.getOwnPropertyDescriptor(props, prop)) {
      if (props[prop] !== object[prop]) {
        return false;
      }
    }
  }
  return true;
}
exports.containProps = containProps;

// @react-navigation v7 equivalent of the old imperative stack reset.
exports.resetNavStack = function(routeName, currentScreen) {
  const navigation = currentScreen
    ? currentScreen.props.navigation
    : this.props.navigation;
  navigation.reset({
    index: 0,
    routes: [{name: routeName}],
  });
};

function asyncDelay(milliseconds) {
  return new Promise(async resolve => {
    setTimeout(resolve, milliseconds);
  });
}
exports.asyncDelay = asyncDelay;

function objectToString(o) {
  return Reflect.apply(Object.toString, o);
}

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isString(variable) {
  return typeof variable === 'string' || variable instanceof String;
}
exports.isString = isString;

function isNumber(variable) {
  return typeof variable === 'number' || variable instanceof Number;
}
exports.isNumber = isNumber;

function isEmptyOrNil(string) {
  return string == null || string.length == 0;
}
exports.isEmptyOrNil = isEmptyOrNil;

function isValidEmail(email) {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email) != 0;
}
exports.isValidEmail = isValidEmail;

function isValidPassword(password) {
  const reg = /(^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,16}))/;
  return reg.test(password) != 0;
}
exports.isValidPassword = isValidPassword;

function isNullOrUndefined(obj) {
  if (obj === null) {
    return true;
  }
  return typeof obj === 'undefined';
}
exports.isNullOrUndefined = isNullOrUndefined;

function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != '') {
      return false;
    }
  }
  return true;
}

function getTranslation(translations) {
  let {locale} = i18n;
  if (locale && locale.length > 2) {
    locale = locale.substring(0, 2).toLocaleLowerCase();
  }
  let first = null;
  if (translations[locale]) {
    first = translations[locale];
  }
  let second = null;
  if (translations.vi) {
    second = translations.vi;
  }
  const result = combineTranslation(first, second);
  if (result != null) {
    return result;
  }
  for (const prop in translations) {
    if (Reflect.getOwnPropertyDescriptor(translations, prop)) {
      return translations[prop];
    }
  }
  return null;
}

function combineTranslation(first, second) {
  if (!first) {
    return second;
  }
  if (first && second) {
    let combinedTran = {};
    for (var key in second) {
      if (first.hasOwnProperty(key) && first[key] && first[key] != '') {
        combinedTran[key] = first[key];
      } else {
        if (second[key] && second[key] != '') {
          combinedTran[key] = second[key];
        } else {
          combinedTran[key] = null;
        }
      }
    }
    return combinedTran;
  }

  return null;
}

function apiTranslation(data, key) {
  if (!data) {
    return null;
  }
  const {translations} = data;
  if (!translations) {
    return null;
  }
  const translation = getTranslation(translations);
  if (!translation) {
    return null;
  }
  return translation[key];
}
exports.apiTranslation = apiTranslation;

export function strictApiTranslation(data, key) {
  if (!data) {
    return null;
  }
  const {translations} = data;
  if (!translations) {
    return null;
  }
  const translation = strictGetTranslation(translations);
  if (!translation) {
    return null;
  }
  return translation[key];
}

export function strictGetTranslation(translations) {
  let {locale} = i18n;
  if (locale && locale.length > 2) {
    locale = locale.substring(0, 2).toLocaleLowerCase();
  }
  if (translations[locale]) {
    return translations[locale];
  }
  if (translations.vi) {
    return translations.vi;
  }
  for (const prop in translations) {
    if (Reflect.getOwnPropertyDescriptor(translations, prop)) {
      return translations[prop];
    }
  }
  return null;
}

function getMarked(course) {
  if (course.is_top) {
    return 'TOP';
  } else if (course.is_hot) {
    return 'HOT';
  } else if (course.is_new) {
    return 'NEW';
  }
  return null;
}

function getTagsFromCourse(course) {
  const tags = [];
  const {bought, duration} = course;
  if (bought) {
    if (isNumber(duration)) {
      tags.push(`${duration} ${i18n.t('others.days')}`);
    } else if (isString(duration)) {
      tags.push(duration);
    }
  }
  return tags;
}

function courseListToSellList(listContainer) {
  if (!listContainer) {
    return [];
  }
  const {courses} = listContainer;
  const sellList = [];
  if (courses) {
    for (let i = 0; i < courses.length; i += 1) {
      const course = courses[i];
      const tags = getTagsFromCourse(course);
      sellList.push({
        image: {uri: course.image},
        tags,
        title: apiTranslation(course, 'name'),
        marked: getMarked(course),
        id: course.id,
      });
    }
  }
  return sellList;
}

exports.courseListToSellList = courseListToSellList;

function mergeStyles(styles1, styles2) {
  let combinedStyle = [];
  if (styles1) {
    combinedStyle.push(styles1);
  }
  if (styles2) {
    combinedStyle.push(styles2);
  }
  return combinedStyle;
}
exports.mergeStyles = mergeStyles;

function mergeStyleToProps(style, props) {
  let combinedStyle = [];
  if (style) {
    combinedStyle.push(style);
  }
  if (props.style) {
    combinedStyle.push(props.style);
  }
  return {...props, style: combinedStyle};
}
exports.mergeStyleToProps = mergeStyleToProps;

function findObjectById(obj, id, idPropName = 'id') {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      if (obj[i][idPropName] === id) {
        return obj[i];
      }
    }
  } else {
    for (const prop in obj) {
      if (Reflect.getOwnPropertyDescriptor(obj, prop)) {
        if (obj[prop][idPropName] === id) {
          return obj[prop];
        }
      }
    }
  }
  return null;
}

exports.findObjectById = findObjectById;

function isHttpUrl(uri) {
  if (!uri) {
    return false;
  }
  return uri.startsWith('http://') || uri.startsWith('https://');
}
exports.isHttpUrl = isHttpUrl;

function getDimension() {
  const window = Dimensions.get('window');
  return {
    height: window.height,
    width: window.width,
  };
}
exports.getDimension = getDimension;

function showSnackbar(message) {
  // TODO(Giai đoạn 2): wire up a snackbar lib once src/assets/colors is ported.
  console.warn('showSnackbar (stub):', message);
}
exports.showSnackbar = showSnackbar;

function isDefaultAvatar(url) {
  if (url) {
    if (url.includes('users/default-avatars')) {
      return true;
    }
  }
  return false;
}
exports.isDefaultAvatar = isDefaultAvatar;

const audioExts = [
  '3GA',
  'AA',
  'AA3',
  'AAC',
  'AAX',
  'ABC',
  'AC3',
  'ACD',
  'ACD-ZIP',
  'ACM',
  'ACT',
  'ADG',
  'ADTS',
  'AFC',
  'AHX',
  'AIF',
  'AIFC',
  'AIFF',
  'AL',
  'AMR',
  'AMZ',
  'AOB',
  'APC',
  'APE',
  'APF',
  'ATRAC',
  'AU',
  'AVR',
  'AWB',
  'AWB',
  'BAP',
  'BMW',
  'CAF',
  'CDA',
  'CFA',
  'CIDB',
  'COPY',
  'CPR',
  'CWP',
  'DAC',
  'DCF',
  'DCM',
  'DCT',
  'DFC',
  'DIG',
  'DSM',
  'DSS',
  'DTS',
  'DTSHD',
  'DVF',
  'EFA',
  'EFE',
  'EFK',
  'EFV',
  'EMD',
  'EMX',
  'ENC',
  'F64',
  'FL',
  'FLAC',
  'FLP',
  'FST',
  'G726',
  'GNT',
  'GPX',
  'GSM',
  'GSM',
  'HMA',
  'HTW',
  'IFF',
  'IKLAX',
  'IMW',
  'IMY',
  'ITS',
  'IVC',
  'K26',
  'KAR',
  'KFN',
  'KOE',
  'KOZ',
  'KOZ',
  'KPL',
  'KTP',
  'LQT',
  'LVP',
  'M3U',
  'M3U8',
  'M4A',
  'M4B',
  'M4P',
  'M4R',
  'MA1',
  'MID',
  'MIDI',
  'MINIUSF',
  'MIO',
  'MKA',
  'MMF',
  'MON',
  'MP2',
  'MP3',
  'MPA',
  'MPC',
  'MPU',
  'MP_',
  'MSV',
  'MT2',
  'MTE',
  'MTP',
  'MUP',
  'MXP4',
  'MZP',
  'NCOR',
  'NKI',
  'NRT',
  'NSA',
  'NTN',
  'NWC',
  'ODM',
  'OGA',
  'OGG',
  'OMA',
  'OMG',
  'OMX',
  'OTS',
  'OVE',
  'PCAST',
  'PEK',
  'PLA',
  'PLS',
  'PNA',
  'PROG',
  'PVC',
  'QCP',
  'R1M',
  'RA',
  'RAM',
  'RAW',
  'RAX',
  'REX',
  'RFL',
  'RIF',
  'RMJ',
  'RNS',
  'RSD',
  'RSO',
  'RTI',
  'RX2',
  'SA1',
  'SBR',
  'SD2',
  'SFA',
  'SGT',
  'SID',
  'SMF',
  'SND',
  'SNG',
  'SNS',
  'SPRG',
  'SSEQ',
  'SSND',
  'SWA',
  'SYH',
  'SZ',
  'TAP',
  'TRM',
  'UL',
  'USF',
  'USFLIB',
  'USM',
  'VAG',
  'VMO',
  'VOI',
  'VOX',
  'VPM',
  'VRF',
  'VY1',
  'VYF',
  'W01',
  'W64',
  'WAV',
  'WMA',
  'WPROJ',
  'WRK',
  'WUS',
  'WUT',
  'WWU',
  'XFS',
  'ZGR',
  'ZVR',
];

function getExtension(filePath) {
  if (!filePath) {
    return '';
  }
  const matches = filePath.match(/\.([^.]+)$/u);
  if (!matches) {
    return '';
  }
  return matches[1] || '';
}

function isAudioFileExtension(filePath) {
  const ext = getExtension(filePath).toUpperCase();
  return audioExts.indexOf(ext) >= 0;
}

function isAudioExtension(urlString) {
  try {
    const url = Url.parse(urlString);
    const {pathname} = url;
    if (!pathname) {
      return false;
    }
    return isAudioFileExtension(pathname);
  } catch (e) {
    console.warn(e);
    return isAudioFileExtension(urlString);
  }
}

exports.isAudioExtension = isAudioExtension;

function shallowEquals(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  for (const prop in objA) {
    if (Reflect.getOwnPropertyDescriptor(objA, prop)) {
      if (objA[prop] !== objB[prop]) {
        return false;
      }
    }
  }
  for (const prop in objB) {
    if (Reflect.getOwnPropertyDescriptor(objB, prop)) {
      if (objA[prop] !== objB[prop]) {
        return false;
      }
    }
  }
  return true;
}
exports.shallowEquals = shallowEquals;

function getNavLazyParam(navigation, key) {
  let value = navigation.getParam(key);
  if (typeof value === 'function') {
    return value(navigation);
  }
  return value;
}
exports.getNavLazyParam = getNavLazyParam;

function createHtmlWithPadding(html) {
  return `<div style="background:fff; padding:15px; box-sizing:border-box"> 
    ${html}
    <div>`;
}
exports.createHtmlWithPadding = createHtmlWithPadding;

function createHtmlWithCustomPadding(html, padding) {
  return `<div style="background:fff; padding:${padding}px; box-sizing:border-box"> 
    ${html}
    <div>`;
}
exports.createHtmlWithCustomPadding = createHtmlWithCustomPadding;

function floorScore(score) {
  return Math.round(score);
}
exports.floorScore = floorScore;

function floorScoreRemainTwoDigit(score) {
  return Math.round(score * 100) / 100;
}
exports.floorScoreRemainTwoDigit = floorScoreRemainTwoDigit;

export function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isSameDayWithToday(d1) {
  return isSameDay(d1, new Date());
}

// function sumArray(first, second) {
//   let maxSize = Math.max(first.length(), second.length());
//   let minSize = Math.min(first.length(), second.length());

//   let loopCount = maxSize - minSize;

//   if (maxSize == first.length()) {
//     for (let index = 0; index < loopCount; index++) {
//       second.push(0);
//     }
//   } else {
//     for (let index = 0; index < loopCount; index++) {
//       first.push(0);
//     }
//   }
//   let remaining = 0;

//   let inverseResult = [];

//   for (let index = maxSize - 1; index <= 0; index--) {
//     let a = first[index];
//     let b = second[index];

//     let sum = a + b + remaining;

//     let digit = sum % 10;

//     remaining = parseInt(sum / 10);
//     inverseResult.push(digit);
//     if (index == 0) {
//       if (remaining != 0) {
//         inverseResult.push(remaining);
//       }
//     }
//   }

//   console.log(inverseResult);
// }
