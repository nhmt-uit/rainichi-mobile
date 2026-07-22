import React, {useEffect, useRef} from 'react';
import {View, ScrollView, ActivityIndicator, StyleSheet, RefreshControl, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../assets';
import {SelfAdPanel, SellList, Background} from '../components';
import * as utils from '../utils/utils';
import {fetchSelfAd, fetchCourseList, selectCourseComboType, selectCourseBasicType, getProfile, shareApp} from '../redux/actions';
import * as Persistence from '../utils/persistence';
import {i18n} from '../../locales';
import Share from 'react-native-share';

// Ported from the old app's CoursesScreen.js. Firebase push-notification
// setup (setupFirebaseMessenging) is deferred to a later Giai đoạn 2 step
// (todo #14) -- not wired up here yet. Share-to-social still works since
// react-native-share doesn't depend on Firebase.
export default function CoursesScreen({navigation}) {
  const dispatch = useDispatch();
  const selfAdPages = useSelector(state => state.Ad.selfAdPages);
  const selfAdFetching = useSelector(state => state.Ad.selfAdFetching);
  const courseLists = useSelector(state => state.Course.courseLists);
  const isCourseListsFetching = useSelector(state => state.Course.isCourseListsFetching);
  const userInfo = useSelector(state => state.Authenticate.userInfo);
  const shareAppRespone = useSelector(state => state.Event.shareResponse);
  const prevShareResponse = useRef(shareAppRespone);

  useEffect(() => {
    dispatch(fetchSelfAd());
    dispatch(fetchCourseList());
    dispatch(getProfile());
    checkShareDialog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevShareResponse.current !== shareAppRespone && shareAppRespone != null) {
      prevShareResponse.current = shareAppRespone;
      utils.showSnackbar(i18n.t('event.share_successfully'));
      saveShareDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareAppRespone]);

  async function checkShareDialog() {
    if (await isShareAvailableToday()) {
      showShareDialog();
    }
  }

  function showShareDialog() {
    Alert.alert(
      i18n.t('event.title'),
      i18n.t('event.share_app'),
      [
        {text: i18n.t('label.cancel'), style: 'cancel'},
        {text: i18n.t('label.ok'), onPress: () => shareAppToSocial()},
      ],
      {cancelable: false},
    );
  }

  function shareAppToSocial() {
    const shareOptions = {
      title: i18n.t('label.share'),
      failOnCancel: false,
      message:
        i18n.t('event.let_download') +
        '\n Android : https://play.google.com/store/apps/details?id=com.rainichi' +
        '\n iOS: https://apps.apple.com/us/app/rainichi/id1472177022',
    };
    Share.open(shareOptions)
      .then(async () => {
        if (await isShareAvailableToday()) {
          dispatch(shareApp());
        }
      })
      .catch(() => {});
  }

  async function isShareAvailableToday() {
    const shareMap = await Persistence.getSharePref();
    if (shareMap && userInfo) {
      const lastShareDate = shareMap[userInfo.id];
      if (lastShareDate) {
        return !utils.isSameDayWithToday(new Date(lastShareDate));
      }
    }
    return true;
  }

  async function saveShareDate() {
    let shareMap = await Persistence.getSharePref();
    if (!shareMap) {
      shareMap = {};
    }
    if (userInfo) {
      shareMap[userInfo.id] = new Date().toUTCString();
      await Persistence.saveSharePref(shareMap);
    }
  }

  function onRefresh() {
    dispatch(fetchSelfAd());
    dispatch(fetchCourseList());
    dispatch(getProfile());
  }

  function findCourse(courseId, hasSubCourse) {
    let course = null;
    for (let i = 0; i < courseLists.length; i += 1) {
      const list = courseLists[i];
      if (list.has_course_children === hasSubCourse) {
        course = utils.findObjectById(list.courses, courseId);
        if (course) {
          break;
        }
      }
    }
    return course;
  }

  function onComboItemClicked(courseId) {
    dispatch(selectCourseComboType(true));
    dispatch(selectCourseBasicType(false));
    const course = findCourse(courseId, false);
    const title = utils.apiTranslation(course, 'name');
    const hasBought = course.bought;
    const description = utils.apiTranslation(course, 'description');
    if (course.is_foundation) {
      dispatch(selectCourseBasicType(true));
      navigation.navigate('SubCourses', {courseId, title});
    } else {
      navigation.navigate('CourseIntro', {
        courseId,
        description,
        title,
        hasBought,
        videoUrl: course.youtube_link,
      });
    }
  }

  function onSingleItemClicked(courseId) {
    dispatch(selectCourseComboType(false));
    dispatch(selectCourseBasicType(false));
    const course = findCourse(courseId, true);
    const title = utils.apiTranslation(course, 'name');
    navigation.navigate('SubCourses', {courseId, title});
  }

  function showMore(title, listData, onItemClicked) {
    navigation.navigate('SellList', {sellItemData: listData, onItemClicked, title});
  }

  function renderCourseList(list) {
    const title = utils.apiTranslation(list, 'name');
    const onItemClicked = list.has_course_children ? onSingleItemClicked : onComboItemClicked;
    const sellListData = utils.courseListToSellList(list);
    return (
      <SellList
        title={title}
        key={title}
        onShowMore={() => showMore(title, sellListData, onItemClicked)}
        hideShowMoreButton={sellListData.length <= 3}
        sellItemData={sellListData}
        onItemClicked={onItemClicked}
      />
    );
  }

  function renderCourseLists() {
    if (isCourseListsFetching) {
      return <ActivityIndicator size="small" color={colors.primary} style={styles.courseListsIndicator} />;
    }
    const elements = [];
    if (courseLists && courseLists.length) {
      for (let i = 0; i < courseLists.length; i += 1) {
        const list = courseLists[i];
        if (list && list.courses && list.courses.length > 0) {
          elements.push(renderCourseList(list));
        }
      }
    }
    return elements;
  }

  const refreshControl = <RefreshControl refreshing={isCourseListsFetching || selfAdFetching} onRefresh={onRefresh} />;

  return (
    <Background>
      <ScrollView refreshControl={refreshControl}>
        <View style={{flexDirection: 'column'}}>
          <SelfAdPanel
            dataSource={selfAdPages}
            fetching={selfAdFetching}
            style={{backgroundColor: colors.primary, aspectRatio: 828 / 338}}
            onPagePress={() => {}}
          />
          {renderCourseLists()}
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  courseListsIndicator: {
    margin: 40,
  },
});
