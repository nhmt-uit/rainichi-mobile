import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Dimensions} from 'react-native';
import {SellItem, Background, LoadingIndicator} from '../components';
import constants from '../utils/constants';
import * as utils from '../utils/utils';
import {colors} from '../assets';
import {i18n} from '../../locales';

// Ported from the old app's SubCoursesScreen.js (extended BaseCourseScreen
// for its fetch-on-mount + loading/error overlay pattern). The old app's
// IndicatorViewPager/PagerDotIndicator page-based rendering was already
// dead code there (commented out, FlatList was used instead) -- not
// carried over.
export default function SubCoursesScreen({navigation, route}) {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const courseId = route.params?.courseId;

  useEffect(() => {
    async function load() {
      try {
        setFetching(true);
        const response = await utils.fetchApi(`${constants.api.courseChildren}${courseId}`);
        setData(response.data);
        setFetching(false);
      } catch (e) {
        setError(e.message);
        setFetching(false);
      }
    }
    load();
  }, [courseId]);

  function onSubCourseClicked(subCourseId) {
    const course = utils.findObjectById(data, subCourseId);
    const hasBought = course.bought;
    const description = utils.apiTranslation(course, 'description');
    const title = utils.apiTranslation(course, 'name');
    if (course.is_foundation) {
      navigation.navigate('Course', {courseId: subCourseId, title, trial: true});
    } else {
      navigation.navigate('CourseIntro', {
        courseId: subCourseId,
        description,
        title,
        hasBought,
        videoUrl: course.youtube_link,
      });
    }
  }

  function renderItem({item}) {
    return (
      <SellItem
        image={item.image}
        tags={item.tags !== i18n.t('courses.forever_time') ? item.tags : i18n.t('courses.forever')}
        title={item.title}
        marked={item.marked}
        itemId={item.id}
        style={styles.sellItem}
        sellItemClicked={onSubCourseClicked}
      />
    );
  }

  const sellData = data ? utils.courseListToSellList({courses: data}) : null;

  return (
    <Background>
      {sellData && (
        <FlatList
          data={sellData}
          renderItem={renderItem}
          keyExtractor={item => `SubCoursesScreen${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {fetching && (
        <View style={styles.overlay}>
          <LoadingIndicator isShow={true} />
        </View>
      )}
      {!utils.isEmptyOrNil(error) && (
        <View style={styles.overlay}>
          <Text style={styles.error}>{error}</Text>
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
  listContainer: {
    justifyContent: 'flex-start',
  },
  sellItem: {
    width: itemWidth,
    margin: itemMargin,
    borderRadius: itemBorderRadius,
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
