import {StyleSheet} from 'react-native';
import colors from './colors';
export default StyleSheet.create({
  defaultText: {
    color: 'white',
    // Font
  },
  indicatorHidden: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    opacity: 0,
  },
  indicatorShow: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  pagerDotIndicator: {
    backgroundColor: colors.primary,
  },
  audioPlayerContainer: {
    width: '100%',
    backgroundColor: 'white',
  },
  audioPlayer: {
    margin: 8,
  },
});
