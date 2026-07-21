import React, {useState, useRef, useEffect} from 'react';
import {Text, View, Image, Alert, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors, images} from '../assets';
import {i18n} from '../../locales';
import {LeftIconEditText, Button, LoadingIndicator, OrangeBackButton, SafeAreaBackground} from '../components';
import * as Utils from '../utils/utils';
import {active} from '../redux/actions';

export default function ActivationScreen({navigation, route}) {
  const dispatch = useDispatch();
  const {isLoading, error, data, message} = useSelector(state => state.Authenticate);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [code, setCode] = useState(null);
  const [referrerEmail, setReferrerEmail] = useState(null);
  const prevError = useRef(error);
  const prevData = useRef(data);
  const email = route.params?.email;

  useEffect(() => {
    if (prevError.current !== error) {
      prevError.current = error;
      if (error) {
        Alert.alert(i18n.t('error.title'), error.message);
      }
      return;
    }
    if (prevData.current !== data && data != null) {
      prevData.current = data;
      Utils.showSnackbar(message);
      // ActivationScreen lives inside the nested AuthenticationNavigator
      // stack -- reach up to the root navigator, same reasoning as
      // LoginScreen/RegistrationScreen.
      navigation.getParent('RootStack')?.reset({index: 0, routes: [{name: 'SideMenu'}]});
    }
  }, [error, data, message, navigation]);

  function activeAccount() {
    if (Utils.isEmptyOrNil(fullName)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_fullname'));
      return;
    }
    if (Utils.isEmptyOrNil(phoneNumber)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_phone'));
      return;
    }
    if (Utils.isEmptyOrNil(password)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_password'));
      return;
    }
    if (Utils.isEmptyOrNil(code)) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.empty_code'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(i18n.t('error.title'), i18n.t('error.password_not_match'));
      return;
    }
    if (!Utils.isValidPassword(password)) {
      Alert.alert(i18n.t('error.title'), i18n.t('activation.password_wrong_format'));
      return;
    }
    dispatch(active(fullName, email, code, password, phoneNumber, referrerEmail));
  }

  return (
    <SafeAreaBackground source={images.bgActivation} style={{width: '100%', height: '100%'}}>
      <ScrollView>
        <View style={{flex: 1, width: null, height: null, backgroundColor: 'transparent'}}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Image
              source={images.logo}
              style={{padding: 10, margin: 5, height: 150, width: 150, marginTop: 32, resizeMode: 'contain', alignItems: 'center'}}
            />
            <Text style={{color: colors.primary, fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 12}}>
              {i18n.t('activation.active_member').toUpperCase()}
            </Text>
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.user}
              hint={i18n.t('activation.full_name')}
              onChangeText={setFullName}
            />
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.phone}
              isPhone={true}
              hint={i18n.t('activation.phone_number')}
              onChangeText={setPhoneNumber}
            />
            <LeftIconEditText
              secureTextEntry={true}
              leftIcon={images.password}
              hint={i18n.t('login.password')}
              onChangeText={setPassword}
            />
            <LeftIconEditText
              secureTextEntry={true}
              leftIcon={images.password}
              hint={i18n.t('activation.repeat_password')}
              onChangeText={setConfirmPassword}
            />
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.code}
              hint={i18n.t('activation.code')}
              onChangeText={setCode}
            />
            <LeftIconEditText
              secureTextEntry={false}
              leftIcon={images.email}
              hint={i18n.t('activation.referrer_email')}
              onChangeText={setReferrerEmail}
            />
            <Text>{i18n.t('activation.code_in_email')}</Text>
            <Button
              title={i18n.t('activation.active').toUpperCase()}
              style={{width: '80%', alignSelf: 'center', marginTop: 20}}
              onPress={activeAccount}
            />
          </View>
        </View>
      </ScrollView>
      <OrangeBackButton onPress={() => navigation.goBack()} />
      <LoadingIndicator isShow={isLoading} />
    </SafeAreaBackground>
  );
}
