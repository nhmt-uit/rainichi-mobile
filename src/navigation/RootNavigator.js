import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Giai đoạn 1 skeleton: Login -> Home only, enough to prove the
// navigation/Redux/API wiring works against the real backend. Splash,
// Language, the Drawer+Tab shell (SideMenuDrawer/TabNavigator) and the rest
// of the ~66 screens get ported in Giai đoạn 2.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
