import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ActivationScreen from '../screens/ActivationScreen';
import ForgotPassScreen from '../screens/ForgotPassScreen';

const Stack = createNativeStackNavigator();

// Equivalent of the old app's AuthenticationNavigator.js. Old app used
// react-navigation-transitions for a custom slide transition here; v7's
// native-stack already does native slide transitions by default, so that
// custom transitionConfig isn't needed.
export default function AuthenticationNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Activation" component={ActivationScreen} />
      <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
    </Stack.Navigator>
  );
}
