import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, View, StyleSheet, Text, Image, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, SubtitlesList, LoadingIndicator, LoadMessageOverlay} from '../components';
import VideoPlayer from '../components/player/VideoPlayer';
import AudioPlayer from '../components/player/AudioPlayer';
import {commonStyles, colors} from '../assets';
import * as Utils from '../utils/utils';
import {fetchSubtitles, openNextCourse} from '../redux/actions';
import {i18n} from '../../locales';

function exportJapanese(subTitleText) {
  if (!subTitleText) {
    return subTitleText;
  }
  return subTitleText
    .split('<br>')[0]
    .trim()
    .replace(/<br>/g, '\n')
    .replace(/<br\/>/g, '\n');
}
function exportMeaning(subTitleText) {
  if (!subTitleText) {
    return subTitleText;
  }
  return subTitleText
    .split('<br>')[1]
    ?.trim()
    .replace(/<br>/g, '\n')
    .replace(/<br\/>/g, '\n');
}

// Ported from the old app's ConversationScreen.js (media-heavy: renders
// either VideoPlayer+subtitles or AudioPlayer+subtitles depending on the
// conversation's media type). react-native-cardview -> View+shadow.
export default function ConversationScreen({navigation, route}) {
  const dispatch = useDispatch();
  const subtitles = useSelector(state => state.Conversation.subtitles);
  const isSubtitlesFetching = useSelector(state => state.Conversation.isSubtitlesFetching);
  const fetchingSubtitlesErrorMessage = useSelector(state => state.Conversation.fetchingSubtitlesErrorMessage);
  const isOpenNextCoursing = useSelector(state => state.Practice.isOpenNextCoursing);
  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);

  const [activeCue, setActiveCue] = useState(null);
  const player = useRef(null);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);

  const conversation = route.params?.item;
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
    if (conversation) {
      const subTitleUrl = Utils.apiTranslation(conversation, 'sub_title');
      dispatch(fetchSubtitles(subTitleUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

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

  function onMicClicked(cue) {
    player.current?.pause();
    const japanese = exportJapanese(cue.text);
    const meaning = exportMeaning(cue.text);
    navigation.navigate('SpeechEvaluation', {japanese, meaning, title, subtitle});
  }

  function onSubtitleItemClicked(cue) {
    player.current?.seekTo(cue.start);
  }

  function renderSubtitlesList() {
    if (isSubtitlesFetching) {
      return <LoadingIndicator isShow />;
    }
    if (fetchingSubtitlesErrorMessage) {
      return <Text style={styles.error}>{fetchingSubtitlesErrorMessage}</Text>;
    }
    if (subtitles) {
      return (
        <SubtitlesList cues={subtitles} style={styles.subtitleList} activeCue={activeCue} onMicClicked={onMicClicked} onItemClicked={onSubtitleItemClicked} />
      );
    }
    return null;
  }

  if (!conversation || !conversation.media) {
    return (
      <Background style={styles.errorContainer}>
        <Text style={styles.error}>{i18n.t('error.conversation_unavailable')}</Text>
      </Background>
    );
  }

  const isAudio = Utils.isAudioExtension(conversation.media);

  return (
    <Background>
      <View style={styles.container}>
        <SafeAreaView style={styles.videoParentContainer}>
          <View style={styles.videoContainer}>
            {!isAudio ? (
              <VideoPlayer
                ref={player}
                source={{uri: conversation.media || ''}}
                subTitlesTimes={subtitles}
                subTitlesCallback={setActiveCue}
                style={styles.video}
              />
            ) : (
              <Image source={{uri: conversation.image}} style={{flex: 1}} />
            )}
          </View>
        </SafeAreaView>
        <View style={styles.conversationContainer}>
          <Text style={styles.conversationName}>{Utils.apiTranslation(conversation, 'name')}</Text>
        </View>

        {isAudio ? (
          <View style={styles.withAudioContainer}>
            <View style={commonStyles.audioPlayerContainer}>
              <AudioPlayer style={commonStyles.audioPlayer} source={{uri: conversation.media || ''}} ref={player} subTitlesTimes={subtitles} subTitlesCallback={setActiveCue} />
            </View>
            {renderSubtitlesList()}
          </View>
        ) : (
          renderSubtitlesList()
        )}
      </View>
      <LoadMessageOverlay loading={isOpenNextCoursing} disableBackground />
    </Background>
  );
}

const margin = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoParentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: 260,
    marginTop: 4,
    marginHorizontal: 4,
  },
  videoContainer: {
    width: '100%',
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    alignContent: 'center',
    alignItems: 'center',
  },
  video: {},
  conversationContainer: {
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
    borderRadius: 6,
    minHeight: 40,
    backgroundColor: colors.designBlack,
  },
  conversationName: {
    ...commonStyles.defaultText,
    padding: 8,
    color: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  withAudioContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
  },
  subtitleList: {
    flex: 1,
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
  },
  error: {
    ...commonStyles.defaultText,
    color: colors.error,
    margin: 16,
    alignSelf: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    start: 0,
    end: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
