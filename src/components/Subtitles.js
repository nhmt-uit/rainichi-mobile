import React from 'react';
import {View, StyleSheet, TouchableHighlight, Text} from 'react-native';
import SoundButton from './SoundButton';
import {images, commonStyles, colors} from '../assets';

function formatTime(allSeconds) {
  const seconds = Math.round(allSeconds % 60);
  const minus = Math.floor(allSeconds / 60);
  return `${minus}:${seconds > 9 ? '' : 0}${seconds}`;
}

export default function Subtitles({cue, isActive, onClicked, onMicClicked, style}) {
  const content = cue.text;

  function onPress() {
    onClicked?.(cue);
  }
  function onMicPress() {
    onMicClicked?.(cue);
  }

  return (
    <View style={[styles.card, style]}>
      <TouchableHighlight activeOpacity={0.6} underlayColor="#f2efbe" onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.timesContainer}>
            <Text style={styles.times}>{formatTime(cue.start)}</Text>
            <Text style={styles.times}>-</Text>
            <Text style={styles.times}>{formatTime(cue.end)}</Text>
          </View>
          <View style={styles.subContainer}>
            <SoundButton icon={images.mic} style={styles.soundButton} onPress={onMicPress} />
            <Text style={isActive ? styles.textActive : styles.text}>{content.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n')}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const borderRadius = 6;
const contentPadding = 4;

const styles = StyleSheet.create({
  card: {
    borderRadius,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  container: {
    flexDirection: 'row',
  },
  timesContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius,
    backgroundColor: '#eaeaea',
    margin: 2,
    minWidth: 44,
    paddingTop: contentPadding,
    paddingBottom: contentPadding,
  },
  times: {
    ...commonStyles.defaultText,
    color: 'black',
  },
  subContainer: {
    margin: contentPadding,
    flex: 1,
    flexDirection: 'row-reverse',
  },
  soundButton: {
    width: 48,
    aspectRatio: 1,
  },
  text: {
    ...commonStyles.defaultText,
    flex: 1,
    color: 'black',
    marginStart: 6,
    marginEnd: 6,
  },
  textActive: {
    ...commonStyles.defaultText,
    flex: 1,
    color: colors.primary,
    marginStart: 6,
    marginEnd: 6,
  },
});
