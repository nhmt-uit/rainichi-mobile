import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ExamsScreen from '../screens/ExamsScreen';
import JobsScreen from '../screens/JobsScreen';
import EventsScreen from '../screens/EventsScreen';
import {i18n} from '../../locales';
import {colors, images} from '../assets';
import {TabBarIcon} from '../components';
import {safeStyles} from '../utils/theme';

const Tab = createBottomTabNavigator();

// 5 tabs of the authenticated home surface. Courses/Exams/Jobs/Events are
// ported for real; Shop is deferred to the Payment/IAP Giai đoạn 2 step
// since it's tightly coupled to the real purchase flow (still renders
// PlaceholderScreen until then).
const tabsScreens = [
  {name: 'CoursesTab', title: () => i18n.t('tabs.courses'), icon: images.courses, component: CoursesScreen},
  {name: 'ExamsTab', title: () => i18n.t('tabs.exams'), icon: images.exams, component: ExamsScreen},
  {name: 'JobsTab', title: () => i18n.t('tabs.jobs'), icon: images.jobs, component: JobsScreen},
  {name: 'EventsTab', title: () => i18n.t('tabs.events'), icon: images.events, component: EventsScreen},
  {name: 'ShopTab', title: () => i18n.t('tabs.shops'), icon: images.shops, component: PlaceholderScreen},
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
      {tabsScreens.map(({name, title, icon, component}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          initialParams={component === PlaceholderScreen ? {placeholderTitle: title()} : undefined}
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
