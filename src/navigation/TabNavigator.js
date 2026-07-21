import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import {i18n} from '../../locales';
import {colors, images} from '../assets';
import {TabBarIcon} from '../components';
import {safeStyles} from '../utils/theme';

const Tab = createBottomTabNavigator();

// 5 tabs of the authenticated home surface. Real screen content (Courses/
// Exams/Jobs/Events/Shop) is ported in a later Giai đoạn 2 step; for now
// each tab renders PlaceholderScreen so the navigation shell is complete
// and tappable end to end.
const tabsScreens = [
  {name: 'CoursesTab', title: () => i18n.t('tabs.courses'), icon: images.courses},
  {name: 'ExamsTab', title: () => i18n.t('tabs.exams'), icon: images.exams},
  {name: 'JobsTab', title: () => i18n.t('tabs.jobs'), icon: images.jobs},
  {name: 'EventsTab', title: () => i18n.t('tabs.events'), icon: images.events},
  {name: 'ShopTab', title: () => i18n.t('tabs.shops'), icon: images.shops},
];

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabHighLight,
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: safeStyles.marginBottom,
          height: styles.tabBar.height + safeStyles.marginBottom,
        },
      }}>
      {tabsScreens.map(({name, title, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={PlaceholderScreen}
          initialParams={{placeholderTitle: title()}}
          options={{
            tabBarIcon: ({focused, color}) => (
              <TabBarIcon focused={focused} tintColor={color} icon={icon} title={title} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBackground,
    height: 60,
  },
});
