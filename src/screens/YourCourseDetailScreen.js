import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../assets';
import {i18n} from '../../locales';
import {LearningResultItem, Background, LoadingIndicator} from '../components';
import {fetchMyCourseById} from '../redux/actions';

export default function YourCourseDetailScreen({navigation, route}) {
  const dispatch = useDispatch();
  const isMyCouseDetailFetching = useSelector(state => state.Course.isMyCouseDetailFetching);
  const myCourseDetail = useSelector(state => state.Course.myCourseDetail);

  const id = route.params?.id;
  const title = route.params?.title;

  useEffect(() => {
    dispatch(fetchMyCourseById(id));
  }, [dispatch, id]);

  function renderRow({item}) {
    return (
      <LearningResultItem
        item={item}
        hideDetailButton={true}
        onContinuePress={() => navigation.navigate('Course', {courseId: id, title, trial: false})}
      />
    );
  }

  return (
    <Background>
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <View style={styles.mainContainer}>
          <Text style={{color: colors.primary, fontWeight: 'bold'}}>{i18n.t('your_course.learning_result').toUpperCase()}</Text>
          <View style={styles.underline} />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={myCourseDetail}
          renderItem={renderRow}
          style={{padding: 4, marginVertical: 8}}
          keyExtractor={item => item.id + ''}
        />
      </View>
      <LoadingIndicator isShow={isMyCouseDetailFetching} />
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
});
