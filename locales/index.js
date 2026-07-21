import i18n from "i18n-js";
import en from "./en";
import vi from "./vi";
let Languages = { en, vi };
module.exports = { Languages };
// TODO: port device-locale detection when the Language/Setting screens are
// ported (Giai đoạn 2) -- the old app used react-native-languages, which is
// unmaintained. Defaulting to 'vi' since that's the app's primary language.
i18n.locale = "vi";
i18n.fallbacks = true;
i18n.translations = Languages;
module.exports.i18n = i18n;

module.exports.changeLanguage = function changeLanguage(value){
    i18n.locale = value
}