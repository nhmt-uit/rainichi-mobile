import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../assets';
import {i18n} from '../../locales';
import * as Utils from '../utils/utils';
import {LearningResultItem, Background, LoadingIndicator} from '../components';
import {fetchMyCourse, selectCourseComboType, selectCourseBasicType} from '../redux/actions';

export default function YourCourseScreen({navigation}) {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.Authenticate.userInfo);
  const isMyCouseFetching = useSelector(state => state.Course.isMyCouseFetching);
  const myCourseList = useSelector(state => state.Course.myCourseList);

  useEffect(() => {
    dispatch(fetchMyCourse());
  }, [dispatch]);

  function renderRow({item}) {
    return (
      <LearningResultItem
        item={item}
        onDetailPress={it => {
          navigation.navigate('YourCourseDetail', {
            title: i18n.t('your_course.detail') + ' ' + Utils.apiTranslation(it, 'name'),
            id: it.id,
          });
        }}
        onContinuePress={it => {
          dispatch(selectCourseComboType(!it.has_course_children));
          dispatch(selectCourseBasicType(it.has_course_children));
          navigation.navigate('Course', {
            courseId: it.id,
            title: Utils.apiTranslation(it, 'name'),
            trial: false,
          });
        }}
      />
    );
  }

  return (
    <Background>
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <View style={styles.mainContainer}>
          <Text style={{color: colors.primary, fontWeight: 'bold'}}>{i18n.t('your_course.learning_result').toUpperCase()}</Text>
          <View style={styles.underline} />
          <View style={styles.studentContainer}>
            <Text style={{fontSize: 16}}>{i18n.t('your_course.student')}</Text>
            <Text style={styles.studentText}>{userInfo?.name}</Text>
          </View>
        </View>
        {myCourseList && myCourseList.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={myCourseList}
            renderItem={renderRow}
            style={{padding: 4, marginVertical: 8}}
            keyExtractor={item => item.id + ''}
          />
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontWeight: '200', fontSize: 16}}>{i18n.t('your_course.no_course')}</Text>
          </View>
        )}
      </View>
      <LoadingIndicator isShow={isMyCouseFetching} />
    </Background>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  underline: {
    width: 30,
    height: 1,
    backgroundColor: colors.primary,
    margin: 4,
  },
  studentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.highLight,
    width: '100%',
    padding: 16,
    marginTop: 16,
    borderRadius: 10,
  },
  studentText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
});
