import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {doLogin} from '../redux/actions';
import * as Utils from '../utils/utils';
import {colors, images} from '../assets';
import {
  LeftIconEditText,
  Button,
  LoadingIndicator,
  OrangeBackButton,
  SafeAreaBackground,
} from '../components';
import {i18n} from '../../locales';

// Ported from the old app's LoginScreen.js (class component + redux
// `connect`) to a function component using hooks (useState/useDispatch/
// useSelector) and @react-navigation v7's navigation.reset() -- same visual
// design (LeftIconEditText, Button, bg_login image, etc.), same validation
// and API call (doLogin), just modernized React/navigation API.
export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const {isLoading, error, data: auth} = useSelector(state => state.Authenticate);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    if (error) {
      Alert.alert(i18n.t('error.title'), error.message);
    }
  }, [error]);

  useEffect(() => {
    if (auth) {
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    }
  }, [auth, navigation]);

  function validate() {
    if (Utils.isEmptyOrNil(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_email'));
      return false;
    }
    if (!Utils.isValidEmail(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.invalid_email'));
      return false;
    }
    if (Utils.isEmptyOrNil(password)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_password'));
      return false;
    }
    return true;
  }

  function handleLogin() {
    if (validate()) {
      dispatch(doLogin(email, password));
    }
  }

  return (
    <SafeAreaBackground source={images.bgLogin} style={{width: '100%', height: '100%'}}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Image source={images.logo} style={styles.logoImage} />
            <Text style={styles.signInLabel}>{i18n.t('login.sign_in').toUpperCase()}</Text>
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.email}
              hint={i18n.t('login.email')}
              onChangeText={text => setEmail(text)}
            />
            <LeftIconEditText
              secureTextEntry={true}
              leftIcon={images.password}
              hint={i18n.t('login.password')}
              onChangeText={text => setPassword(text)}
            />
            {/* TODO(Giai đoạn 2): wire up once ForgotPassScreen is ported */}
            <TouchableOpacity onPress={() => console.warn('ForgotPass screen not ported yet')}>
              <View style={styles.buttonContainer}>
                <Text style={styles.forgotText}>{i18n.t('login.forgot')}</Text>
                <Image source={images.forgotPass} style={{height: 16, width: 16, marginLeft: 8}} />
              </View>
            </TouchableOpacity>

            <Button
              title={i18n.t('login.sign_in_now').toUpperCase()}
              style={styles.loginButton}
              onPress={handleLogin}
            />
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
  forgotText: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    justifyContent: 'flex-end',
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
  buttonContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
  },
});
