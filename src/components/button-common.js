import {StyleSheet} from 'react-native';
import {colors, commonStyles, dimensions} from '../assets';
import * as utils from '../utils/utils';

// Ported from the old app's button-common.js. Dropped PropTypes/ViewPropTypes
// usage -- ViewPropTypes and Image.propTypes were removed from React Native
// core years ago (moved to deprecated-react-native-prop-types), and this was
// only ever used for dev-time typechecking, not runtime behavior.

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    alignSelf: 'center',
    borderRadius: 6,
    height: dimensions.buttonHeight,
    justifyContent: 'center',
  },
  linkButton: {
    borderRadius: 6,
    height: dimensions.buttonHeight,
    justifyContent: 'center',
    paddingEnd: dimensions.linkButtonPaddingHorizontal,
    paddingStart: dimensions.linkButtonPaddingHorizontal,
  },
  button: {
    backgroundColor: colors.defaultButton,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'flex-start',
    height: dimensions.buttonHeight,
    paddingStart: dimensions.buttonPaddingHorizontal,
    paddingEnd: dimensions.buttonPaddingHorizontal,
    justifyContent: 'center',
  },
  icon: {
    width: dimensions.buttonIconSize,
    height: dimensions.buttonIconSize,
    margin: dimensions.buttonIconMargin,
    resizeMode: 'contain',
  },
  text: {
    ...commonStyles.defaultText,
    fontWeight: 'bold',
  },
  textLink: {
    ...commonStyles.defaultText,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  leftIconEditText: {
    ...commonStyles.defaultText,
    fontWeight: 'bold',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    height: dimensions.leftIconEditText,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  leftIconTextView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    height: dimensions.leftIconEditText,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

function mergeProps(props, style) {
  const mergingProp = {
    underlayColor: '#FA9999',
    activeOpacity: 0.6,
    ...props,
  };

  return utils.mergeStyleToProps(style, mergingProp);
}

module.exports = {
  styles,
  mergeProps,
};
