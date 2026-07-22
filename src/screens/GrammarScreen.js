import React, {useEffect, useRef} from 'react';
import {Text, View, StyleSheet, ScrollView, Dimensions, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {Background, LoadMessageOverlay} from '../components';
import {i18n} from '../../locales';
import {colors, commonStyles} from '../assets';
import * as Utils from '../utils/utils';
import {openNextCourse} from '../redux/actions';

// Ported from the old app's GrammarScreen.js. `VideoPlayer` (subclasses
// react-native-video-controls) is not ported yet -- that's genuinely part
// of the risky "Listening/Reading media nặng" Giai đoạn 2 step, not this
// one, so a plain placeholder box is shown for the (rare) grammar item that
// has a video, same stub-now-wire-later pattern used for IAP/social login.
export default function GrammarScreen({navigation, route}) {
  const dispatch = useDispatch();
  const grammar = route.params?.item;
  const havePractice = route.params?.havePractice;
  const lessonId = route.params?.lessonId;
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
    navigation.setParams({onSubmit});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);

  useEffect(() => {
    if (openNextCoursingErrorMessage && openNextCoursingErrorMessage !== prevErrorMessage.current) {
      prevErrorMessage.current = openNextCoursingErrorMessage;
      Alert.alert(i18n.t('error.title'), openNextCoursingErrorMessage);
    }
    if (openNextCoursingRes && openNextCoursingRes !== prevRes.current) {
      prevRes.current = openNextCoursingRes;
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNextCoursingErrorMessage, openNextCoursingRes]);

  let error = null;
  if (!grammar) {
    error = i18n.t('error.grammar_unavailable');
  }

  const description = grammar ? Utils.apiTranslation(grammar, 'description') : null;
  const example = grammar ? Utils.apiTranslation(grammar, 'example') : null;

  return (
    <Background style={styles.container}>
      {grammar && (
        <ScrollView>
          {grammar.video ? (
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>{i18n.t('label.title')}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.nameContainer}>
            <Text style={styles.grammarEq}>{Utils.apiTranslation(grammar, 'name')}</Text>
          </View>
          {description ? (
            <View style={styles.card}>
              <AutoHeightWebView
                source={{html: Utils.createHtmlWithCustomPadding(description, 8)}}
                style={{width: Dimensions.get('window').width - 15}}
                customStyle={`p {font-size: 16px; text-align: justify;} img { max-width:95%!important; height: auto!important; }`}
              />
            </View>
          ) : null}
          {example ? (
            <View style={[styles.card, {marginBottom: margin}]}>
              <AutoHeightWebView
                source={{html: Utils.createHtmlWithCustomPadding(example, 8)}}
                style={{width: Dimensions.get('window').width - 15}}
                customStyle={`p {font-size: 16px; text-align: justify;} img { max-width:95%!important; height: auto!important; }`}
              />
            </View>
          ) : null}
        </ScrollView>
      )}
      <LoadMessageOverlay disableBackground={true} loading={false} errorMessage={error} />
    </Background>
  );
}

const margin = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  videoContainer: {
    marginTop: margin,
    marginHorizontal: margin,
    borderRadius: 8,
    overflow: 'hidden',
    alignContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: 'white',
  },
  card: {
    ...commonStyles.defaultText,
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  grammarEq: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
    backgroundColor: colors.designBlack,
    borderRadius: 6,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
