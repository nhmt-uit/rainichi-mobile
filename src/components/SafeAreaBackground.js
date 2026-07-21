import React from 'react';
import {ImageBackground, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Ported as a function component using hooks (useSafeAreaInsets,
// useWindowDimensions) instead of the old class + withSafeAreaInsets HOC +
// Utils.getDimension() combo.
export default function SafeAreaBackground(props) {
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  return (
    <ImageBackground
      {...props}
      style={{
        ...props.style,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        width,
        height,
      }}
    />
  );
}
