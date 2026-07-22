import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function HorizontalProgressBar({percentage, activeColor, thumbColor, thumbHeight}) {
  let activeFlex;
  if (percentage < 1) {
    activeFlex = percentage * 100;
  } else {
    activeFlex = percentage;
  }
  const inactiveFlex = 100 - activeFlex;
  const height = thumbHeight || 3;
  return (
    <View style={{...styles.container, height}}>
      <View
        style={{
          backgroundColor: activeColor,
          flex: activeFlex,
          height,
          borderBottomLeftRadius: 5,
          borderTopLeftRadius: 5,
        }}
      />
      <View
        style={{
          backgroundColor: thumbColor,
          flex: inactiveFlex,
          height,
          borderBottomRightRadius: 5,
          borderTopRightRadius: 5,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
});
