import {initialWindowMetrics} from 'react-native-safe-area-context';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {isIphoneX_V2} from './deviceUtils';
const STATUSBAR_DEFAULT_HEIGHT = 20;

const HEIGHT =
  Platform.OS == 'ios' ? STATUSBAR_DEFAULT_HEIGHT : StatusBar.currentHeight;

export const safeStyles = StyleSheet.create({
  marginTop: Platform.select({
    ios: isIphoneX_V2()
      ? 0
      : Math.max(initialWindowMetrics.insets.top - HEIGHT, 0),
    android: HEIGHT,
  }),
  marginBottom: Platform.select({
    ios: isIphoneX_V2() ? 0 : initialWindowMetrics.insets.bottom,
    android: 0,
  }),
});
