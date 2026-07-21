import React, {useState, useRef, useEffect} from 'react';
import {Text, View, StyleSheet, Image, Alert, ScrollView} from 'react-native';
import * as Utils from '../utils/utils';
import {colors, images} from '../assets';
import {LeftIconEditText, Button, LoadingIndicator, OrangeBackButton, SafeAreaBackground} from '../components';
import {i18n} from '../../locales';
import {useDispatch, useSelector} from 'react-redux';
import {forgetPass} from '../redux/actions';

export default function ForgotPassScreen({navigation}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Authenticate.isLoading);
  const error = useSelector(state => state.Authenticate.forgetPassError);
  const result = useSelector(state => state.Authenticate.forgetResult);
  const [email, setEmail] = useState(null);
  const prevError = useRef(error);
  const prevResult = useRef(result);

  useEffect(() => {
    if (error != null && prevError.current !== error) {
      prevError.current = error;
      Alert.alert(i18n.t('error.title'), error.message);
      return;
    }
    if (result != null && prevResult.current !== result) {
      prevResult.current = result;
      Utils.showSnackbar(i18n.t('forgot.sucessfully'));
      navigation.goBack();
    }
  }, [error, result, navigation]);

  function validate() {
    if (Utils.isEmptyOrNil(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_email'));
      return false;
    }
    if (!Utils.isValidEmail(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.invalid_email'));
      return false;
    }
    return true;
  }

  function confirm() {
    if (validate()) {
      dispatch(forgetPass(email));
    }
  }

  return (
    <SafeAreaBackground source={images.bgLogin} style={{width: '100%', height: '100%'}}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Image source={images.logo} style={styles.logoImage} />
            <Text style={styles.signInLabel}>{i18n.t('forgot.label').toUpperCase()}</Text>
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.email}
              hint={i18n.t('login.email')}
              onChangeText={setEmail}
            />
            <Button title={i18n.t('forgot.confirm').toUpperCase()} style={styles.loginButton} onPress={confirm} />
          </View>
        </View>
      </ScrollView>
      <OrangeBackButton onPress={() => navigation.goBack()} />
      <LoadingIndicator isShow={isLoading} />
    </SafeAreaBackground>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  mainContainer: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
  },
  logoImage: {
    padding: 10,
    margin: 5,
    height: 150,
    width: 150,
    marginTop: 32,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  signInLabel: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12,
  },
});
