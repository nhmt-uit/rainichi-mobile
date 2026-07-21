import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../assets';

// Temporary placeholder for screens not ported yet in Giai đoạn 2 -- keeps
// the navigation graph fully wired (so no drawer/tab link 404s) while the
// real screen content gets ported group by group.
export default function PlaceholderScreen({route}) {
  const title = route?.params?.placeholderTitle ?? route?.name ?? '';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.subtext}>Sắp ra mắt trong Giai đoạn 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#888',
  },
});
