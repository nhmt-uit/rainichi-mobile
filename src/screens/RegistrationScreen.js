import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Image, Alert, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Utils from '../utils/utils';
import {colors, images} from '../assets';
import {LeftIconEditText, Button, LoadingIndicator, SafeAreaBackground} from '../components';
import {i18n} from '../../locales';
import {signUp} from '../redux/actions';

// Ported from the old app's RegistrationScreen.js. Social login (Google/
// Facebook/Apple) is stubbed for now -- same pattern as AuthenticateActions'
// logout stub from Giai đoạn 1 -- and gets wired up for real in a later
// Giai đoạn 2 step once the SDKs are installed.
export default function RegistrationScreen({navigation}) {
  const dispatch = useDispatch();
  const {isLoading, error, data: auth, message} = useSelector(state => state.Authenticate);
  const [email, setEmail] = useState(null);
  const prevError = useRef(error);
  const prevMessage = useRef(message);
  const prevAuth = useRef(auth);

  useEffect(() => {
    if (prevError.current !== error) {
      prevError.current = error;
      if (error) {
        Alert.alert(i18n.t('error.title'), error.message);
      }
      return;
    }
    if (prevMessage.current !== message && message != null) {
      prevMessage.current = message;
      navigation.navigate('Activation', {email});
      return;
    }
    if (prevAuth.current !== auth && auth != null) {
      prevAuth.current = auth;
      // RegistrationScreen lives inside the nested AuthenticationNavigator
      // stack -- reach up to the root navigator to clear the whole auth
      // flow from history, same reasoning as LoginScreen.
      navigation.getParent('RootStack')?.reset({index: 0, routes: [{name: 'SideMenu'}]});
    }
  }, [error, message, auth, email, navigation]);

  function verifyEmail() {
    if (Utils.isEmptyOrNil(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_email'));
      return;
    }
    if (!Utils.isValidEmail(email)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.invalid_email'));
      return;
    }
    dispatch(signUp(email));
  }

  // TODO(Giai đoạn 2 - social login): wire up @react-native-google-signin,
  // react-native-fbsdk-next, @invertase/react-native-apple-authentication.
  function socialSignInStub(provider) {
    console.warn(`${provider} sign-in not wired up yet`);
  }

  return (
    <SafeAreaBackground source={images.bgLogin} style={{width: '100%', height: '100%'}}>
      <ScrollView>
        <View style={{flex: 1, width: null, height: null, backgroundColor: 'transparent'}}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Image
              source={images.logo}
              style={{padding: 10, margin: 5, height: 150, width: 150, marginTop: 32, resizeMode: 'contain', alignItems: 'center'}}
            />
            <Text style={{color: colors.yellow, fontSize: 20, fontWeight: '700', marginTop: 4, marginBottom: 4}}>
              {i18n.t('registration.now').toUpperCase()}
            </Text>
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.email}
              hint={i18n.t('login.email')}
              color={colors.yellow}
              onChangeText={text => setEmail(text)}
            />
            <Text style={{marginBottom: 8}}>{i18n.t('registration.note')}</Text>
            <Button
              title={i18n.t('registration.register').toUpperCase()}
              style={{width: '80%', alignSelf: 'center'}}
              backgroundColor={colors.yellow}
              onPress={verifyEmail}
            />
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '80%', marginTop: 16}}>
              <Text style={{color: colors.yellow, fontSize: 13, fontWeight: '400', marginTop: 4, marginBottom: 4}}>
                {i18n.t('registration.already')}
              </Text>
              <Image style={{height: 14, width: 80, resizeMode: 'contain', marginLeft: 4}} source={images.rainichi} />
            </View>
            <Button
              title={i18n.t('login.sign_in_now').toUpperCase()}
              style={{width: '80%', alignSelf: 'center', marginTop: 8}}
              onPress={() => navigation.navigate('Login', {transition: 1111})}
            />
            <Text style={{color: colors.yellow, fontSize: 13, fontWeight: '400', marginTop: 12, marginBottom: 12}}>
              {i18n.t('registration.social')}
            </Text>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '80%'}}>
              <TouchableOpacity onPress={() => socialSignInStub('google')}>
                <Image style={{width: 34, height: 34, marginRight: 4}} source={images.google} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => socialSignInStub('facebook')}>
                <Image style={{width: 35, height: 35, marginLeft: 4}} source={images.facebook} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => socialSignInStub('apple')}>
                <Image style={{width: 35, height: 35, marginLeft: 4}} source={images.apple} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <LoadingIndicator isShow={isLoading} />
    </SafeAreaBackground>
  );
}
