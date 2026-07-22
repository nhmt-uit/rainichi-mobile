import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useDispatch, useSelector} from 'react-redux';
import {VocabularyPage, Background, LoadingIndicator} from '../components';
import {i18n} from '../../locales';
import {commonStyles, colors} from '../assets';
import {loadVocabularyByLessonId, loadMoreVocabularyByLessonId, openNextCourse} from '../redux/actions';

// Ported from the old app's VocabularyScreen.js -- `ViewPager` from the old
// `rn-viewpager` fork replaced with `react-native-pager-view` per the
// port's technical decisions.
export default function VocabularyScreen({navigation, route}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Vocabulary.isLoading);
  const vocabularyList = useSelector(state => state.Vocabulary.vocabularyListById);
  const total = useSelector(state => state.Vocabulary.total);
  const response = useSelector(state => state.Vocabulary.responseVocabularyById);
  const nextLink = useSelector(state => state.Vocabulary.nextLink);
  const isComboClicked = useSelector(state => state.CourseType.isComboClicked);
  const isOpenNextCoursing = useSelector(state => state.Practice.isOpenNextCoursing);
  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);

  const [currentPosition, setCurrentPosition] = useState(route.params?.vocabularyIndex || 0);
  const pagerRef = useRef(null);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);

  const lessonId = route.params?.lessonId;
  const havePractice = route.params?.havePractice;
  const courseId = route.params?.courseId;
  const title = route.params?.title;
  const subtitle = route.params?.subtitle;
  const isBackCourseseScreen = route.params?.isBackCourseseScreen;

  function onSubmit() {
    if (havePractice) {
      navigation.navigate('Practice', {lessonId, courseId, title, subtitle, isBackCourseseScreen});
    } else {
      dispatch(openNextCourse(lessonId, courseId));
    }
  }

  useEffect(() => {
    if (isComboClicked === false) {
      navigation.setParams({onSubmit});
    }
    navigation.setParams({isCombo: isComboClicked});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(loadVocabularyByLessonId(lessonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    if (openNextCoursingErrorMessage && openNextCoursingErrorMessage !== prevErrorMessage.current) {
      prevErrorMessage.current = openNextCoursingErrorMessage;
      Alert.alert(i18n.t('error.title'), openNextCoursingErrorMessage);
    }
    if (openNextCoursingRes && openNextCoursingRes !== prevRes.current) {
      prevRes.current = openNextCoursingRes;
      navigation.goBack(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNextCoursingErrorMessage, openNextCoursingRes]);

  function onKanjiClicked(character) {
    navigation.navigate('Kanji', {character});
  }

  function onMicClicked(vocabulary) {
    navigation.navigate('SpeechEvaluation', {vocabulary, title, subTitle: route.params?.subTitle});
  }

  function goPreviousVocabulary() {
    pagerRef.current?.setPage(currentPosition - 1);
  }

  function goNextVocabulary() {
    pagerRef.current?.setPage(currentPosition + 1);
  }

  function onPageSelected(e) {
    const position = e.nativeEvent.position;
    if (vocabularyList && vocabularyList.length - 1 === position && vocabularyList.length < total) {
      dispatch(loadMoreVocabularyByLessonId(response, nextLink));
    }
    setCurrentPosition(position);
  }

  function renderPageSelectedHeader() {
    const pagePosition = (currentPosition || 0) + 1;
    if (total) {
      return (
        <View>
          <Text style={styles.textIndicator}>{`${pagePosition}/${total}`}</Text>
          <View style={styles.textIndicatorUnderLine} />
        </View>
      );
    }
    return null;
  }

  return (
    <Background style={{flex: 1}}>
      {renderPageSelectedHeader()}
      <PagerView ref={pagerRef} initialPage={currentPosition} style={styles.pager} onPageSelected={onPageSelected}>
        {vocabularyList &&
          vocabularyList.map((vocabulary, i) => (
            <View key={`vocabulary${i}`}>
              <VocabularyPage
                vocabulary={vocabulary}
                pageCount={vocabularyList.length}
                pageNumber={i}
                onMicClicked={onMicClicked}
                onKanjiClicked={onKanjiClicked}
                onArrowLeftClick={goPreviousVocabulary}
                onArrowRightClick={goNextVocabulary}
              />
            </View>
          ))}
      </PagerView>
      <LoadingIndicator isShow={isLoading || isOpenNextCoursing} />
    </Background>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  textIndicator: {
    ...commonStyles.defaultText,
    color: colors.primary,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 8,
  },
  textIndicatorUnderLine: {
    backgroundColor: colors.primary,
    width: 30,
    marginTop: 6,
    alignSelf: 'center',
    height: 1.5,
  },
});
