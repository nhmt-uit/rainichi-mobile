import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {commonStyles} from '../assets';

export function MeaningRow({meaningKey, meaningValue}) {
  return (
    <View style={styles.meaningRow}>
      <Text style={styles.meaningKey}>{meaningKey}</Text>
      <Text style={styles.meaningValue}>: {meaningValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  meaningRow: {
    flexDirection: 'row',
  },
  meaningKey: {
    ...commonStyles.defaultText,
    color: 'black',
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  meaningValue: {
    ...commonStyles.defaultText,
    color: 'black',
    flex: 1,
    fontSize: 14,
  },
});
