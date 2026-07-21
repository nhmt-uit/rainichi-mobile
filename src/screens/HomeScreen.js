import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getProfile, logOut} from '../redux/actions';

// Placeholder home screen for Giai đoạn 1 -- just proves the store/API/nav
// wiring works end to end (fetches the real logged-in profile from the
// backend). Real tab/drawer navigation shell is ported in Giai đoạn 2.
export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const {userInfo, data} = useSelector(state => state.Authenticate);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!data) {
      navigation.reset({index: 0, routes: [{name: 'Login'}]});
    }
  }, [data, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập thành công</Text>
      <Text style={styles.label}>Email: {userInfo?.email ?? data?.profile?.email}</Text>
      <Text style={styles.label}>Name: {userInfo?.name ?? data?.profile?.name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => dispatch(logOut())}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
