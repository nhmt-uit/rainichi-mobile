import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {i18n} from '../../locales';
import {LoadMessageOverlay} from '../components';
import {fetchListeningList} from '../redux/actions';

// Ported from the old app's ListeningLoadScreen.js + base/LoadScreen.js --
// same fetch-then-redirect-to-single-or-list pattern already ported
// standalone for ConversationLoadScreen/GrammarLoadScreen.
export default function ListeningLoadScreen({navigation, route}) {
  const dispatch = useDispatch();
  const listeningList = useSelector(state => state.Listening.listeningList);
  const isListeningLoading = useSelector(state => state.Listening.isListeningLoading);
  const fetchedListeningErrorMessage = useSelector(state => state.Listening.fetchedListeningErrorMessage);
  const prevListeningList = useRef(listeningList);

  const lessonId = route.params?.lessonId;

  useEffect(() => {
    if (lessonId != null) {
      dispatch(fetchListeningList(false, lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasData = listeningList && listeningList.length > 0;

  useEffect(() => {
    if (prevListeningList.current !== listeningList) {
      prevListeningList.current = listeningList;
      if (hasData) {
        const navParams = {
          lessonId,
          courseId: route.params?.courseId,
          title: route.params?.title,
          subtitle: route.params?.subtitle,
          isCombo: route.params?.isCombo,
          havePractice: route.params?.havePractice,
        };
        if (listeningList.length <= 1) {
          navParams.item = listeningList[0];
          navigation.replace('Listening', navParams);
        } else {
          navigation.replace('ListeningList', navParams);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeningList]);

  let error = fetchedListeningErrorMessage;
  if (!error && !hasData && !isListeningLoading) {
    error = i18n.t('error.listening_unavailable');
  }

  return (
    <View style={{flex: 1}}>
      <LoadMessageOverlay disableBackground={false} loading={isListeningLoading} errorMessage={error} />
    </View>
  );
}
