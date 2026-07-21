import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import {commonStyles} from '../assets';

const deviceWidth = Dimensions.get('window').width;
const titleWidth = deviceWidth / 2;

export default function Title({title, subtitle}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title && title.toUpperCase()}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={styles.subtitle} ellipsizeMode="tail">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    ...commonStyles.defaultText,
    fontSize: 16,
    fontWeight: 'bold',
    width: titleWidth,
  },
  subtitle: {
    ...commonStyles.defaultText,
    fontSize: 12,
    width: titleWidth,
  },
});
