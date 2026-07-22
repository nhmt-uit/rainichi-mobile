import React from 'react';
import Background from './Background';
import {View, StyleSheet, Text} from 'react-native';
import * as Utils from '../utils/utils';
import LoadingIndicator from './LoadingIndicator';
import {colors, commonStyles} from '../assets';

export default function LoadMessageOverlay({disableBackground, loading, errorMessage, style}) {
  const Container = disableBackground ? View : Background;
  if (!loading && !errorMessage) {
    return null;
  }
  return (
    <Container style={Utils.mergeStyles(styles.overlay, style)}>
      {loading ? <LoadingIndicator isShow={true} /> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...commonStyles.defaultText,
    color: colors.error,
    margin: 16,
    alignSelf: 'center',
  },
});
