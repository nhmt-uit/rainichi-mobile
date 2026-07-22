import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator, DefaultTouchableHiglight, SelfAdPanel} from '../components';
import {colors} from '../assets';
import {i18n} from '../../locales';
import {fetchJobList} from '../redux/actions';
import * as Utils from '../utils/utils';
import Moment from 'moment';

export default function JobsScreen({navigation}) {
  const dispatch = useDispatch();
  const jobList = useSelector(state => state.Article.jobList);
  const isJobLoading = useSelector(state => state.Article.isJobLoading);
  const totalJob = useSelector(state => state.Article.totalJob);
  const jobSlider = useSelector(state => state.Article.jobSlider);
  const currentPage = useRef(1);

  useEffect(() => {
    dispatch(fetchJobList(currentPage.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onEndReached() {
    if (jobList.length < totalJob) {
      currentPage.current += 1;
      dispatch(fetchJobList(currentPage.current));
    }
  }

  function onRefresh() {
    currentPage.current = 1;
    dispatch(fetchJobList(currentPage.current));
  }

  function onPressJob(item) {
    navigation.navigate('Job', {
      slug: Utils.apiTranslation(item, 'slug'),
      name: Utils.apiTranslation(item, 'name'),
      date: Moment(item.expired_at).format('DD-MM-YYYY'),
      offer: Utils.apiTranslation(item, 'offer'),
    });
  }

  function renderRow({item}) {
    return (
      <DefaultTouchableHiglight underlayColor={colors.primary} onPress={() => onPressJob(item)} style={styles.touchableItem}>
        <View style={styles.card}>
          <Text style={styles.itemTitleText}>{Utils.apiTranslation(item, 'name')}</Text>
          <View>
            <Text style={styles.detailText}>
              {i18n.t('job.expired_at')}: {Moment(item.expired_at).format('DD-MM-YYYY')}
            </Text>
            <Text style={styles.detailText}>
              {i18n.t('job.offer')}: <Text style={[styles.detailText, {fontWeight: 'bold'}]}>{Utils.apiTranslation(item, 'offer')}</Text>
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.detailText}>
              {i18n.t('job.work_at')}: {Utils.apiTranslation(item, 'work_at')}
            </Text>
          </View>
        </View>
      </DefaultTouchableHiglight>
    );
  }

  return (
    <Background>
      <View style={{flexDirection: 'column', paddingBottom: 4, flex: 1}}>
        <SelfAdPanel
          dataSource={jobSlider}
          fetching={isJobLoading}
          style={{backgroundColor: colors.primary, aspectRatio: 1920 / 400}}
          resizeMode="stretch"
        />
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={jobList}
          renderItem={renderRow}
          keyExtractor={item => item.id + ''}
          style={{padding: 4}}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={isJobLoading} onRefresh={onRefresh} />}
        />
      </View>
      <LoadingIndicator isShow={isJobLoading} />
    </Background>
  );
}

const styles = StyleSheet.create({
  touchableItem: {
    margin: 4,
    borderRadius: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  itemTitleText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 16,
    marginVertical: 6,
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
  },
});
