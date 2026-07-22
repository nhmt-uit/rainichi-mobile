import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import constants from '../utils/constants';
import * as utils from '../utils/utils';
import {SellItem, Background, LoadingIndicator} from '../components';
import {fetchCourseLessonById} from '../redux/actions';
import {i18n} from '../../locales';
import {colors} from '../assets';

// Ported from the old app's CourseScreen.js (extended BaseCourseScreen,
// but never actually used its fetch mechanism -- used redux instead, only
// borrowed the render structure -- so ported here as a plain screen rather
// than replicating a base-class hook). Fixed a real bug from the old code:
// `courseId = ...` inside renderItem was missing `const`, leaking an
// implicit global.
export default function CourseScreen({navigation, route}) {
  const dispatch = useDispatch();
  const isComboClicked = useSelector(state => state.CourseType.isComboClicked);
  const isBasicClicked = useSelector(state => state.BasicCourse.isBasicClicked);
  const lessonList = useSelector(state => state.Course.courseLessonList);
  const isFetching = useSelector(state => state.Course.isCouseLessonByIdFetching);
  const errorMessage = useSelector(state => state.Course.fetchCourseLessonByIdErrorMessage);
  const [isDelay, setIsDelay] = useState(false);
  const prevLessonList = useRef(lessonList);

  const courseId = route.params?.courseId;
  const trial = route.params?.trial;
  const title = route.params?.title;

  useEffect(() => {
    dispatch(fetchCourseLessonById(courseId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchCourseLessonById(courseId));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, courseId]);

  function isSpecialKanjiLesson(data) {
    if (data && data.length === 1) {
      const item = data[0];
      if (item.chapters.length > 0) {
        return item.type === constants.basicType.ALPHABET && item.chapters[0].type === constants.skillType.KANJI;
      }
    }
    return false;
  }

  function isSpecialNumberLesson(data) {
    if (data && data.length === 1) {
      const item = data[0];
      if (item.chapters.length > 0) {
        return item.type === constants.basicType.NUMBER;
      }
    }
    return false;
  }

  function isSpecialBasicKanjiLesson(data) {
    if (data && data.length > 1) {
      const item = data[0];
      return item.type && item.type === constants.basicType.ALPHABET && item.chapters.length > 0 && item.chapters[0].type === constants.skillType.KANJI;
    }
    return false;
  }

  function isSpecialLesson(data) {
    return isSpecialKanjiLesson(data) || isSpecialNumberLesson(data) || isSpecialBasicKanjiLesson(data);
  }

  function fakeNavigate(lessonId, specialType) {
    navigation.replace('Character', {lessonId, specialType, title});
  }

  function fakeNavigateForBasicKaji() {
    navigation.replace('AllBasicKanji', {courseId, title});
  }

  useEffect(() => {
    if (prevLessonList.current !== lessonList) {
      prevLessonList.current = lessonList;
      if (isSpecialKanjiLesson(lessonList)) {
        fakeNavigate(lessonList[0].id, constants.specialCharacterType.KANJI);
      } else if (isSpecialNumberLesson(lessonList)) {
        fakeNavigate(lessonList[0].id, constants.specialCharacterType.NUMBER);
      } else if (isSpecialBasicKanjiLesson(lessonList)) {
        fakeNavigateForBasicKaji();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonList]);

  function checkPracticeExists(chapters) {
    return chapters.some(e => e.type === constants.skillType.PRACTICE);
  }

  function navigateByItemType(item) {
    let routeName = null;
    const navParams = {
      lessonId: item.id,
      courseId,
      title: utils.apiTranslation(item, 'name'),
      subtitle: title,
      isCombo: isComboClicked,
      isExam: true,
      havePractice: checkPracticeExists(item.chapters),
      isBackCourseseScreen: route.params?.isBackCourseseScreen,
    };
    switch (item.chapters[0].type) {
      case constants.skillType.VOCABULARY:
        routeName = 'Vocabulary';
        break;
      case constants.skillType.GRAMMAR:
        routeName = 'GrammarLoad';
        break;
      case constants.skillType.CONVERSATION:
        routeName = 'ConversationLoad';
        break;
      case constants.skillType.PRACTICE:
        routeName = 'Practice';
        break;
      case constants.skillType.LISTENING:
        routeName = 'ListeningLoad';
        break;
      case constants.skillType.READING:
        routeName = 'ReadingLoad';
        break;
    }
    navigation.navigate(routeName, navParams);
  }

  function navigateByBasicItemType(item) {
    const navParams = {
      lessonId: item.id,
      courseId,
      title: utils.apiTranslation(item, 'name'),
      subtitle: title,
      isCombo: isComboClicked,
    };
    let routeName = null;
    if (item.type) {
      switch (item.type) {
        case constants.basicType.CONCEPT:
          routeName = 'BasicConcept';
          navParams.description = utils.apiTranslation(item, 'description');
          break;
        case constants.basicType.ALPHABET:
          routeName = 'Character';
          break;
        case constants.basicType.PRACTICE:
          routeName = 'Practice';
          break;
        case constants.basicType.CONNECTION_WORD:
          routeName = 'Character';
          navParams.specialType = constants.specialCharacterType.CONNECTION_WORK;
          break;
      }
    } else if (item.chapters.length > 0) {
      switch (item.chapters[0].type) {
        case constants.skillType.VOCABULARY:
          routeName = 'VocabularyList';
          break;
      }
    }

    if (item.type && item.type === constants.basicType.ALPHABET && item.chapters.length > 0 && item.chapters[0].type === constants.skillType.KANJI) {
      routeName = 'Character';
      navParams.specialType = constants.specialCharacterType.KANJI;
    }

    if (routeName) {
      setIsDelay(true);
      setTimeout(() => {
        setIsDelay(false);
        navigation.navigate(routeName, navParams);
      }, 300);
    }
  }

  function onItemClick(item) {
    if (isComboClicked) {
      if (isBasicClicked) {
        navigateByBasicItemType(item);
      } else if (item.type === constants.basicType.PRACTICE) {
        navigateByItemType(item);
      } else {
        navigation.navigate('SkillList', {
          lesson: item,
          courseId,
          title: utils.apiTranslation(item, 'name'),
          subtitle: title,
          isCombo: isComboClicked,
          isExam: true,
        });
      }
    } else {
      navigateByItemType(item);
    }
  }

  function renderItem({item}) {
    let locked = false;
    if (trial) {
      locked = !item.has_trial;
    } else {
      locked = item.status === constants.lessonStatus.LOCK;
    }
    return (
      <SellItem
        locked={locked}
        trial={trial}
        style={styles.sellItem}
        image={{uri: item.image}}
        itemId={item.id}
        followingId={item.following}
        title={utils.apiTranslation(item, 'name')}
        onBuyNow={() => navigation.navigate('ShopTab', {activeTab: constants.shopTab.COURSE, exactlyCourseId: courseId})}
        onCompleteNeeded={id => {
          const followingCourse = lessonList.filter(it => it.id === id);
          Alert.alert(i18n.t('label.title'), i18n.t('label.you_must_complete') + utils.apiTranslation(followingCourse[0], 'name'));
        }}
        sellItemClicked={() => onItemClick(item)}
        starNumber={item.stars === 99 ? undefined : item.stars}
      />
    );
  }

  function renderContent() {
    if (lessonList && !isSpecialLesson(lessonList)) {
      return (
        <FlatList
          data={lessonList}
          renderItem={renderItem}
          keyExtractor={item => `courseLesson${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
    return null;
  }

  return (
    <Background>
      {renderContent()}
      {(isFetching || isDelay) && (
        <View style={styles.overlay}>
          <LoadingIndicator isShow={true} />
        </View>
      )}
      {!utils.isEmptyOrNil(errorMessage) && (
        <View style={styles.overlay}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      )}
    </Background>
  );
}

const deviceWidth = Dimensions.get('window').width;
const itemMargin = 5;
const itemPerLine = 2;
const itemWidth = (deviceWidth - 2 * itemPerLine * itemMargin) / itemPerLine;
const itemBorderRadius = 10;

const styles = StyleSheet.create({
  sellItem: {
    width: itemWidth,
    margin: itemMargin,
    borderRadius: itemBorderRadius,
  },
  listContainer: {
    justifyContent: 'flex-start',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: colors.error,
  },
});
