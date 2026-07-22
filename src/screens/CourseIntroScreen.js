import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ScrollView, SafeAreaView, Alert} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {useDispatch, useSelector} from 'react-redux';
import {Background, Button, SimpleYouTube} from '../components';
import {colors, commonStyles} from '../assets';
import {i18n} from '../../locales';
import * as Utils from '../utils/utils';
import constants from '../utils/constants';
import {fetchCourseDetailById} from '../redux/actions';

export default function CourseIntroScreen({navigation, route}) {
  const dispatch = useDispatch();
  const courseDetail = useSelector(state => state.Course.courseDetailById);
  const prevCourseDetail = useRef(courseDetail);

  const courseId = route.params?.courseId;
  const description = route.params?.description;
  const videoUrl = route.params?.videoUrl;
  const hasBought = route.params?.hasBought;
  const title = route.params?.title;

  useEffect(() => {
    dispatch(fetchCourseDetailById(courseId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (prevCourseDetail.current !== courseDetail && courseDetail) {
      prevCourseDetail.current = courseDetail;
      if (!courseDetail.bought) {
        showDiscountDialog();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDetail]);

  function showDiscountDialog() {
    let message = '';
    courseDetail.prices.forEach(element => {
      if (element.reward_credits) {
        message += '\n -' + element.buying_credits + ' ' + i18n.t('shop.coin') + ' ' + i18n.t('event.reward_course') + ' ' + element.reward_credits + ' ' + i18n.t('shop.coin');
      }
    });
    if (message) {
      Alert.alert(
        i18n.t('event.title'),
        i18n.t('event.discount_course') + ' ' + message,
        [
          {text: i18n.t('label.cancel'), style: 'cancel'},
          {
            text: i18n.t('label.ok'),
            onPress: () => navigation.navigate('ShopTab', {activeTab: constants.shopTab.COURSE, exactlyCourseId: courseDetail.id}),
          },
        ],
        {cancelable: false},
      );
    }
  }

  function renderButtons() {
    const studyButtonText = hasBought ? i18n.t('label.study_now') : i18n.t('label.study_trial');
    return (
      <View style={styles.buttonContainer}>
        <Button
          title={studyButtonText}
          style={[styles.button, styles.trialButton]}
          textStyle={styles.trialButtonText}
          onPress={() => navigation.replace('Course', {courseId, trial: !hasBought, title})}
        />
        {hasBought ? null : (
          <Button
            title={i18n.t('label.buy_now')}
            style={[styles.button, styles.buyButton]}
            textStyle={styles.buyButtonText}
            onPress={() => navigation.navigate('ShopTab', {activeTab: constants.shopTab.COURSE, exactlyCourseId: courseId})}
          />
        )}
      </View>
    );
  }

  const descriptionTitle = i18n.t('courses.content');

  return (
    <Background>
      <View style={styles.bottomBackground} />
      <View style={styles.content}>
        {renderButtons()}
        <SafeAreaView style={styles.videoContainer}>
          {videoUrl ? <SimpleYouTube style={styles.video} youTubeUrl={videoUrl} useIframe={true} /> : null}
        </SafeAreaView>
        <ScrollView style={styles.descriptionScrollView}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>{descriptionTitle && descriptionTitle.toUpperCase()}</Text>
            <View style={styles.descriptionTitleUnderLine} />
            {description ? (
              <AutoHeightWebView
                source={{html: Utils.createHtmlWithPadding(description)}}
                enableAnimation={true}
                style={styles.description}
              />
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Background>
  );
}

const contentHorizontalMargin = 4;

const styles = StyleSheet.create({
  descriptionScrollView: {
    flex: 1,
    marginBottom: 4,
  },
  descriptionContainer: {
    marginStart: contentHorizontalMargin,
    marginEnd: contentHorizontalMargin,
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    width: Utils.getDimension().width - 2 * contentHorizontalMargin,
  },
  descriptionTitle: {
    ...commonStyles.defaultText,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 18,
  },
  descriptionTitleUnderLine: {
    height: 1,
    marginTop: 7,
    marginBottom: 18,
    width: 26,
    backgroundColor: colors.primary,
  },
  video: {
    flex: 1,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: '#eefbe6',
    marginStart: contentHorizontalMargin,
    marginEnd: contentHorizontalMargin,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    top: 0,
    flexDirection: 'column-reverse',
  },
  trialButtonText: {
    color: '#FFDE2F',
  },
  button: {
    borderWidth: 0,
    marginTop: 20,
    marginBottom: 20,
  },
  trialButton: {
    backgroundColor: colors.designBlack,
    marginEnd: 8,
  },
  buyButtonText: {
    color: colors.primary,
  },
  buyButton: {
    backgroundColor: 'white',
    marginStart: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    height: 170,
    backgroundColor: colors.primary,
  },
});
