import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {images} from '../assets';

export default function LogoTitle() {
  return (
    <View style={styles.container}>
      <Image source={images.logoText} resizeMode="contain" style={{height: 30}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
