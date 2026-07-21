import {Image, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {commonStyles, dimensions} from '../assets';

export default function TabBarIcon({tintColor, focused, icon, title}) {
  const underLineColor = focused ? tintColor : 'transparent';
  return (
    <View style={styles.container}>
      <Image style={[styles.icon, {tintColor}]} source={icon} resizeMode="contain" />
      <Text style={{...styles.title, color: tintColor}}>{title()}</Text>
      <View
        style={{
          height: 3,
          width: 24,
          backgroundColor: underLineColor,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    ...commonStyles.defaultText,
    fontSize: 12,
  },
  icon: {
    width: dimensions.tabBarIconSize,
    height: dimensions.tabBarIconSize,
  },
});
