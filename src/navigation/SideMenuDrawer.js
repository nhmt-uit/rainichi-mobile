import React from 'react';
import {View, Linking, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import SettingScreen from '../screens/SettingScreen';
import CourseScreen from '../screens/CourseScreen';
import SubCoursesScreen from '../screens/SubCoursesScreen';
import CourseIntroScreen from '../screens/CourseIntroScreen';
import SkillListScreen from '../screens/SkillListScreen';
import SellListScreen from '../screens/SellListScreen';
import YourCourseScreen from '../screens/YourCourseScreen';
import YourCourseDetailScreen from '../screens/YourCourseDetailScreen';
import {colors, images, dimensions} from '../assets';
import {LogoTitle, Title, ImageButton, SideMenu} from '../components';
import {i18n} from '../../locales';
import constants from '../utils/constants';

const styles = StyleSheet.create({
  headerButton: {},
  headerIcon: {
    height: dimensions.headerButtonIconSize,
  },
});

function openMessenger() {
  Linking.openURL(constants.api.facebookMessenger);
}

function HeaderLeftMenuButton({navigation}) {
  // `navigation` here belongs to MainStack (the native-stack nested inside
  // the Drawer as its "Main" screen) -- it has no openDrawer() of its own,
  // so reach up to the parent (Drawer) navigation, which does.
  return (
    <View style={{justifyContent: 'center'}}>
      <ImageButton
        style={{...styles.headerButton, marginLeft: dimensions.headerButtonMargin}}
        onPress={() => navigation.getParent()?.openDrawer()}
        icon={images.menu}
        iconStyle={styles.headerIcon}
      />
    </View>
  );
}

function HeaderRightMessengerButton() {
  return (
    <View style={{justifyContent: 'center'}}>
      <ImageButton
        style={{...styles.headerButton, marginRight: dimensions.headerButtonMargin}}
        onPress={openMessenger}
        icon={images.messenger}
        iconStyle={styles.headerIcon}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

// Equivalent of the old app's SideMenuDrawer.js's `mainScreen` stack. Old
// app registered ~50 screens here directly (Course, Vocabulary, Kanji,
// Grammar, Exam, Payment, ...); those get added here incrementally as each
// Giai đoạn 2 group is ported (see the plan's todo list) -- for now only
// TabNavigator plus the drawer-linked screens exist, the rest render
// PlaceholderScreen so every SideMenu link works end to end.
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerStyle: {backgroundColor: colors.actionBar},
        headerTintColor: 'white',
        // Equivalent of the old app's navigator-level `navigationOptions`,
        // which read `title`/`subtitle` from route params as the default
        // header for every screen in this stack unless overridden below.
        headerTitle: () => <Title title={route.params?.title} subtitle={route.params?.subtitle} />,
      })}>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={({navigation}) => ({
          headerTitle: () => <LogoTitle />,
          headerLeft: () => <HeaderLeftMenuButton navigation={navigation} />,
          headerRight: () => <HeaderRightMessengerButton />,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={PlaceholderScreen}
        initialParams={{placeholderTitle: i18n.t('sideMenu.profile')}}
        options={{headerTitle: () => <Title title={i18n.t('sideMenu.profile')} />}}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerTitle: () => <Title title={i18n.t('sideMenu.setting')} />}}
      />
      <Stack.Screen
        name="AboutUs"
        component={PlaceholderScreen}
        initialParams={{placeholderTitle: i18n.t('about_us.about_us')}}
        options={{headerTitle: () => <Title title={i18n.t('about_us.about_us')} />}}
      />
      <Stack.Screen
        name="YourCourse"
        component={YourCourseScreen}
        options={{headerTitle: () => <Title title={i18n.t('your_course.your_course')} />}}
      />
      <Stack.Screen
        name="YourExam"
        component={PlaceholderScreen}
        initialParams={{placeholderTitle: i18n.t('your_exam.exam')}}
        options={{headerTitle: () => <Title title={i18n.t('your_exam.exam')} />}}
      />
      <Stack.Screen
        name="Credit"
        component={PlaceholderScreen}
        initialParams={{placeholderTitle: i18n.t('credit.credit')}}
        options={{headerTitle: () => <Title title={i18n.t('credit.credit')} />}}
      />
      <Stack.Screen
        name="EarnCoin"
        component={PlaceholderScreen}
        initialParams={{placeholderTitle: i18n.t('sideMenu.saving_method')}}
        options={{headerTitle: () => <Title title={i18n.t('sideMenu.saving_method')} />}}
      />
      {/* Course detail group (Giai đoạn 2 bước 5) */}
      <Stack.Screen name="Course" component={CourseScreen} />
      <Stack.Screen name="SubCourses" component={SubCoursesScreen} />
      <Stack.Screen name="CourseIntro" component={CourseIntroScreen} />
      <Stack.Screen name="SkillList" component={SkillListScreen} />
      <Stack.Screen name="SellList" component={SellListScreen} />
      <Stack.Screen name="YourCourseDetail" component={YourCourseDetailScreen} />
      {/* Placeholder targets navigated to from CourseScreen/SkillListScreen
          etc -- real screens ported in later Giai đoạn 2 steps (vocabulary/
          kanji/grammar/conversation, listening/reading, practice, exam
          detail group, job/event detail). */}
      <Stack.Screen name="Vocabulary" component={PlaceholderScreen} />
      <Stack.Screen name="VocabularyList" component={PlaceholderScreen} />
      <Stack.Screen name="GrammarLoad" component={PlaceholderScreen} />
      <Stack.Screen name="ConversationLoad" component={PlaceholderScreen} />
      <Stack.Screen name="Practice" component={PlaceholderScreen} />
      <Stack.Screen name="ListeningLoad" component={PlaceholderScreen} />
      <Stack.Screen name="ReadingLoad" component={PlaceholderScreen} />
      <Stack.Screen name="BasicConcept" component={PlaceholderScreen} />
      <Stack.Screen name="Character" component={PlaceholderScreen} />
      <Stack.Screen name="AllBasicKanji" component={PlaceholderScreen} />
      <Stack.Screen name="ExamList" component={PlaceholderScreen} />
      <Stack.Screen name="Job" component={PlaceholderScreen} />
      <Stack.Screen name="Event" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function SideMenuDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, swipeEnabled: false}}
      drawerContent={props => <SideMenu {...props} />}>
      <Drawer.Screen name="Main" component={MainStack} />
    </Drawer.Navigator>
  );
}
