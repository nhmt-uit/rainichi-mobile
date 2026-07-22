import React from 'react';
import {View, Linking, StyleSheet} from 'react-native';
import {createDrawerNavigator, DrawerToggleButton} from '@react-navigation/drawer';
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
import VocabularyListScreen from '../screens/VocabularyListScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import KanjiScreen from '../screens/KanjiScreen';
import AllBasicKanjiScreen from '../screens/AllBasicKanjiScreen';
import CharacterScreen from '../screens/CharacterScreen';
import BasicConceptScreen from '../screens/BasicConceptScreen';
import GrammarListScreen from '../screens/GrammarListScreen';
import GrammarLoadScreen from '../screens/GrammarLoadScreen';
import GrammarScreen from '../screens/GrammarScreen';
import ConversationListScreen from '../screens/ConversationListScreen';
import ConversationLoadScreen from '../screens/ConversationLoadScreen';
import {colors, images, dimensions} from '../assets';
import {LogoTitle, Title, ImageButton, Button, SideMenu} from '../components';
import {i18n} from '../../locales';
import constants from '../utils/constants';

const styles = StyleSheet.create({
  headerButton: {},
  headerIcon: {
    height: dimensions.headerButtonIconSize,
  },
  submitButton: {
    alignSelf: 'center',
    borderColor: 'transparent',
    paddingStart: 2,
    paddingEnd: 22,
    marginEnd: 4,
    height: null,
    backgroundColor: colors.practiceSubmitButton,
  },
  submitButtonText: {
    fontWeight: 'normal',
    color: '#414042',
  },
  submitButtonIcon: {
    marginEnd: 12,
    width: 32,
    height: 32,
  },
});

function openMessenger() {
  Linking.openURL(constants.api.facebookMessenger);
}

// Equivalent of the old app's SideMenuDrawer.js's `navOpsWithParams`
// pattern for Vocabulary/Conversation/Grammar screens: shows a header
// "Practice"/"Continue" button that calls whatever `onSubmit` the screen
// registered via `navigation.setParams({onSubmit})`, unless the lesson is
// part of a combo course (isCombo), in which case no header button shows.
function submitHeaderOptions({route}) {
  if (route.params?.isCombo) {
    return {};
  }
  const havePractice = route.params?.havePractice;
  return {
    headerRight: () => (
      <Button
        icon={images.check}
        title={havePractice ? i18n.t('practice.practice') : i18n.t('practice.open_course')}
        style={styles.submitButton}
        textStyle={styles.submitButtonText}
        iconStyle={styles.submitButtonIcon}
        onPress={() => route.params?.onSubmit?.()}
        allUpperCase={false}
      />
    ),
  };
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
        options={{
          headerTitle: () => <LogoTitle />,
          headerLeft: () => <DrawerToggleButton tintColor="white" imageSource={images.menu} />,
          headerRight: () => <HeaderRightMessengerButton />,
        }}
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
      {/* Vocabulary/Kanji/Grammar/Conversation group (Giai đoạn 2 bước 6) */}
      <Stack.Screen name="Vocabulary" component={VocabularyScreen} options={submitHeaderOptions} />
      <Stack.Screen name="VocabularyList" component={VocabularyListScreen} />
      <Stack.Screen name="Kanji" component={KanjiScreen} options={{headerTitle: () => <Title title={i18n.t('vocabulary.chinese_character')} />}} />
      <Stack.Screen name="AllBasicKanji" component={AllBasicKanjiScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="BasicConcept" component={BasicConceptScreen} />
      <Stack.Screen name="GrammarList" component={GrammarListScreen} options={submitHeaderOptions} />
      <Stack.Screen name="GrammarLoad" component={GrammarLoadScreen} options={{headerTitle: () => <Title title={i18n.t('grammar.grammar')} />}} />
      <Stack.Screen name="Grammar" component={GrammarScreen} options={submitHeaderOptions} />
      <Stack.Screen name="ConversationList" component={ConversationListScreen} options={submitHeaderOptions} />
      <Stack.Screen
        name="ConversationLoad"
        component={ConversationLoadScreen}
        options={{headerTitle: () => <Title title={i18n.t('conversation.conversation_kaiwa')} />}}
      />
      {/* Placeholder targets navigated to from screens ported above --
          real screens ported in later Giai đoạn 2 steps: Conversation
          (needs VideoPlayer/AudioPlayer, grouped with the media-heavy
          Listening/Reading step), Practice/SpeechEvaluation, exam detail
          group, job/event detail. */}
      <Stack.Screen name="Conversation" component={PlaceholderScreen} />
      <Stack.Screen name="Practice" component={PlaceholderScreen} />
      <Stack.Screen name="SpeechEvaluation" component={PlaceholderScreen} />
      <Stack.Screen name="ListeningLoad" component={PlaceholderScreen} />
      <Stack.Screen name="ReadingLoad" component={PlaceholderScreen} />
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
