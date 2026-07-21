import React from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageButton from './ImageButton';
import {images} from '../assets';

// Ported as a function component using the useSafeAreaInsets hook -- the old
// app used the class-based withSafeAreaInsets HOC from an older version of
// react-native-safe-area-context; the hook is the current API.
export default function OrangeBackButton({onPress}) {
  const insets = useSafeAreaInsets();
  return (
    <ImageButton
      icon={images.backOrange}
      style={{...styles.backButton, top: insets.top}}
      iconStyle={styles.backIcon}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 32,
    top: 32,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
});
