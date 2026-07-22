import {Image, TouchableHighlight, StyleSheet} from 'react-native';
import React from 'react';

export default function SelfAdPage({source, position, onPagePress, resizeMode}) {
  function onPress() {
    if (onPagePress) {
      onPagePress(source, position);
    }
  }

  return (
    <TouchableHighlight style={{flex: 1}} onPress={onPress}>
      <Image source={source} resizeMode={resizeMode || 'cover'} style={styles.image} />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: null,
    height: null,
  },
});
