import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {images} from '../assets';
import * as Utils from '../utils/utils';

export default function Background(props) {
  const mergedProps = Utils.mergeStyleToProps(
    {...styles.container},
    {
      resizeMode: 'cover',
      source: images.bgSideMenu,
      ...props,
    },
  );
  return <ImageBackground {...mergedProps}>{props.children}</ImageBackground>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
