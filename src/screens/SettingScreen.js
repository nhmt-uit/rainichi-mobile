import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {logOut} from '../redux/actions';
import {colors} from '../assets';
import {i18n} from '../../locales';

// Minimal real SettingScreen for Giai đoạn 2's navigation shell -- only
// wires up logout for now (the only way out of the authenticated shell),
// full settings UI (notification toggle etc.) ported later in this Giai
// đoạn per the todo list.
export default function SettingScreen({navigation}) {
  const dispatch = useDispatch();

  function handleLogOut() {
    dispatch(logOut());
    navigation.navigate('Authentication');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogOut}>
        <Text style={styles.buttonText}>{i18n.t('setting.log_out').toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
