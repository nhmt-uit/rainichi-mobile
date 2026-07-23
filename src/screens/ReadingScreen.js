import React, {useEffect, useRef} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background} from '../components';
import ReadingQuestion from '../components/question/ReadingQuestion';
import {openNextCourse} from '../redux/actions';
import {i18n} from '../../locales';

// Ported from the old app's ReadingScreen.js.
export default function ReadingScreen({navigation, route}) {
  const dispatch = useDispatch();
  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);

  const item = route.params?.item;
  const lessonId = route.params?.lessonId;
  const courseId = route.params?.courseId;
  const title = route.params?.title;
  const subtitle = route.params?.subtitle;
  const havePractice = route.params?.havePractice;

  function onSubmit() {
    if (havePractice) {
      navigation.navigate('Practice', {lessonId, courseId, title, subtitle, isBackCourseseScreen: route.params?.isBackCourseseScreen});
    } else {
      dispatch(openNextCourse(lessonId, courseId));
    }
  }

  useEffect(() => {
    navigation.setParams({onSubmit});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Background style={styles.container}>
      <ReadingQuestion question={item} enableCheckAnser shouldShowMeaningButton />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
