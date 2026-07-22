import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {commonStyles, colors, images} from '../assets';
import * as Utils from '../utils/utils';
import AudioButton from './AudioButton';

// Ported from the old app's Example.js -- react-native-cardview replaced
// with a plain View + shadow/elevation style, same as SellItem.js.
export default function Example({title, example, meaning, audioUri, setEnableAudio, style}) {
  const fullWidth = Utils.getDimension().width;
  const padding = 8 * 2;
  const margin = 8 * 2;
  const exampleWidth = fullWidth - styles.iconStyle.height - padding - margin;

  return (
    <View style={{...styles.card, ...style}}>
      <View style={styles.container}>
        <View style={[styles.meaningContainer, {width: exampleWidth}]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.example}>{example}</Text>
          {meaning && <Text style={styles.meaning}>{meaning}</Text>}
        </View>
        <View style={styles.meaningContainer}>
          <View style={styles.audioParent}>
            <AudioButton audioUri={audioUri} icon={images.sound} style={styles.iconStyle} setEnableAudio={setEnableAudio} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    backgroundColor: 'white',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    ...commonStyles.defaultText,
    color: colors.primary,
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  example: {
    ...commonStyles.defaultText,
    color: 'black',
  },
  meaning: {
    ...commonStyles.defaultText,
    color: 'black',
  },
  iconStyle: {
    height: 48,
    margin: 4,
    width: 48,
  },
  audioParent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  meaningContainer: {
    alignSelf: 'flex-end',
  },
});
