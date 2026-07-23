import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {i18n} from '../../locales';
import {LoadMessageOverlay} from '../components';
import {fetchReadingList} from '../redux/actions';

// Ported from the old app's ReadingLoadScreen.js + base/LoadScreen.js.
export default function ReadingLoadScreen({navigation, route}) {
  const dispatch = useDispatch();
  const readingList = useSelector(state => state.Reading.readingList);
  const isReadingLoading = useSelector(state => state.Reading.isReadingLoading);
  const fetchedReadingErrorMessage = useSelector(state => state.Reading.fetchedReadingErrorMessage);
  const prevReadingList = useRef(readingList);

  const lessonId = route.params?.lessonId;

  useEffect(() => {
    if (lessonId != null) {
      dispatch(fetchReadingList(false, lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasData = readingList && readingList.length > 0;

  useEffect(() => {
    if (prevReadingList.current !== readingList) {
      prevReadingList.current = readingList;
      if (hasData) {
        const navParams = {
          lessonId,
          courseId: route.params?.courseId,
          title: route.params?.title,
          subtitle: route.params?.subtitle,
          isCombo: route.params?.isCombo,
          havePractice: route.params?.havePractice,
        };
        if (readingList.length <= 1) {
          navParams.item = readingList[0];
          navigation.replace('Reading', navParams);
        } else {
          navigation.replace('ReadingList', navParams);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingList]);

  let error = fetchedReadingErrorMessage;
  if (!error && !hasData && !isReadingLoading) {
    error = i18n.t('error.reading_unavailable');
  }

  return (
    <View style={{flex: 1}}>
      <LoadMessageOverlay disableBackground={false} loading={isReadingLoading} errorMessage={error} />
    </View>
  );
}
