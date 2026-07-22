import React, {useEffect, useRef} from 'react';
import {View, ScrollView, ActivityIndicator, StyleSheet, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../assets';
import {SelfAdPanel, SellList, Background} from '../components';
import ActionSheet from '../components/ActionSheet';
import * as utils from '../utils/utils';
import {i18n} from '../../locales';
import {fetchSelfAd, fetchExamCourseList, fetchLevelType} from '../redux/actions';

export default function ExamsScreen({navigation}) {
  const dispatch = useDispatch();
  const selfAdPages = useSelector(state => state.Ad.selfAdPages);
  const selfAdFetching = useSelector(state => state.Ad.selfAdFetching);
  const examCourseList = useSelector(state => state.Course.examCourseList);
  const isExamCourseListsFetching = useSelector(state => state.Course.isExamCourseListsFetching);
  const levelTypeList = useSelector(state => state.Shop.levelTypeList);
  const actionSheetRef = useRef(null);
  const selectedSingleCourseId = useRef(null);

  useEffect(() => {
    if (!selfAdPages) {
      dispatch(fetchSelfAd());
    }
    dispatch(fetchExamCourseList());
    if (!levelTypeList) {
      dispatch(fetchLevelType());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRefresh() {
    dispatch(fetchSelfAd());
    dispatch(fetchExamCourseList());
    dispatch(fetchLevelType());
  }

  function findPackage(courseId) {
    for (let i = 0; i < examCourseList.length; i += 1) {
      const coursePackage = examCourseList[i];
      for (let j = 0; j < coursePackage.courses.length; j += 1) {
        if (coursePackage.courses[j].id === courseId) {
          return coursePackage;
        }
      }
    }
  }

  function findCourse(courseId) {
    for (let i = 0; i < examCourseList.length; i += 1) {
      const coursePackage = examCourseList[i];
      for (let j = 0; j < coursePackage.courses.length; j += 1) {
        if (coursePackage.courses[j].id === courseId) {
          return coursePackage.courses[j];
        }
      }
    }
  }

  function navigateExamList(courseId, level) {
    const course = findCourse(courseId);
    const title = utils.apiTranslation(course, 'name');
    const subtitle = utils.apiTranslation(findPackage(courseId), 'name');
    navigation.navigate('ExamList', {courseId, level, title, subtitle});
  }

  function onComboItemClicked(courseId) {
    navigateExamList(courseId);
  }

  function onSingleItemClicked(courseId) {
    selectedSingleCourseId.current = courseId;
    actionSheetRef.current?.show();
  }

  function createActionSheetOptions() {
    const options = [i18n.t('label.cancel')];
    if (levelTypeList) {
      levelTypeList.forEach(element => options.push(utils.apiTranslation(element, 'name')));
    }
    return options;
  }

  function showExamList(index) {
    if (index === 0) {
      return;
    }
    navigateExamList(selectedSingleCourseId.current, index);
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
    if (isExamCourseListsFetching) {
      return <ActivityIndicator size="small" color={colors.primary} style={styles.courseListsIndicator} />;
    }
    const elements = [];
    if (examCourseList && examCourseList.length) {
      for (let i = 0; i < examCourseList.length; i += 1) {
        const list = examCourseList[i];
        if (list && list.courses && list.courses.length > 0) {
          elements.push(renderCourseList(list));
        }
      }
    }
    return elements;
  }

  const refreshControl = <RefreshControl refreshing={isExamCourseListsFetching || selfAdFetching} onRefresh={onRefresh} />;

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
        <ActionSheet
          ref={actionSheetRef}
          title={i18n.t('exam.choose_level')}
          options={createActionSheetOptions()}
          cancelButtonIndex={0}
          onPress={index => showExamList(index)}
        />
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  courseListsIndicator: {
    margin: 40,
  },
});
