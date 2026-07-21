import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LanguageScreen from '../screens/LanguageScreen';
import AuthenticationNavigator from './AuthenticationNavigator';
import SideMenuDrawer from './SideMenuDrawer';

const Stack = createNativeStackNavigator();

// Root shell, equivalent of the old app's App.js `createSwitchNavigator`:
// Splash -> (first run) Language -> Authentication -> SideMenu. The `id`
// lets deeply nested screens (inside AuthenticationNavigator or the
// SideMenuDrawer's stack) call `navigation.getParent('RootStack')` to
// reset this root stack directly, rather than the nested navigator they
// actually live in.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      id="RootStack"
      initialRouteName="Splash"
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Authentication" component={AuthenticationNavigator} />
      <Stack.Screen name="SideMenu" component={SideMenuDrawer} />
    </Stack.Navigator>
  );
}
