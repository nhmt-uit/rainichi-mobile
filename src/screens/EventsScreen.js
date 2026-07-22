import React, {useEffect, useRef} from 'react';
import {View, Image, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator, DefaultTouchableHiglight, SelfAdPanel} from '../components';
import {images, colors} from '../assets';
import {fetchEventList} from '../redux/actions';
import * as Utils from '../utils/utils';

export default function EventsScreen({navigation}) {
  const dispatch = useDispatch();
  const eventList = useSelector(state => state.Article.eventList);
  const isEventLoading = useSelector(state => state.Article.isEventLoading);
  const totalEvent = useSelector(state => state.Article.totalEvent);
  const eventSlider = useSelector(state => state.Article.eventSlider);
  const currentPage = useRef(1);

  useEffect(() => {
    dispatch(fetchEventList(currentPage.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onEndReached() {
    if (eventList.length < totalEvent) {
      currentPage.current += 1;
      dispatch(fetchEventList(currentPage.current));
    }
  }

  function onRefresh() {
    currentPage.current = 1;
    dispatch(fetchEventList(currentPage.current));
  }

  function onPressEvent(item) {
    navigation.navigate('Event', {
      slug: Utils.apiTranslation(item, 'slug'),
      name: Utils.apiTranslation(item, 'name'),
      date: item.created_at,
    });
  }

  function renderRow({item}) {
    const imageUri = item.image ? item.image : images.logo;
    return (
      <DefaultTouchableHiglight underlayColor={colors.primary} onPress={() => onPressEvent(item)} style={styles.touchableItem}>
        <View style={styles.card}>
          <View style={styles.container}>
            <View style={styles.infoContainer}>
              <Text style={styles.itemTitleText}>{Utils.apiTranslation(item, 'name')}</Text>
              <View style={styles.dateContainer}>
                <Image source={images.calendar} resizeMode="contain" style={styles.icon} />
                <Text style={styles.detailText}>{item.created_at}</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              {typeof imageUri === 'string' ? (
                <Image source={{uri: imageUri}} resizeMode="stretch" style={styles.itemImage} />
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Image source={imageUri} resizeMode="contain" style={{width: 80, height: 100}} />
                </View>
              )}
            </View>
          </View>
        </View>
      </DefaultTouchableHiglight>
    );
  }

  return (
    <Background>
      <View style={{flexDirection: 'column', paddingBottom: 4, flex: 1}}>
        <SelfAdPanel
          dataSource={eventSlider}
          fetching={isEventLoading}
          style={{backgroundColor: colors.primary, aspectRatio: 1920 / 400}}
          resizeMode="stretch"
        />
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={eventList}
          renderItem={renderRow}
          keyExtractor={item => item.id + ''}
          style={{padding: 4}}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          refreshControl={<RefreshControl refreshing={isEventLoading} onRefresh={onRefresh} />}
        />
      </View>
      <LoadingIndicator isShow={isEventLoading} />
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
    padding: 8,
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
  itemImage: {
    minHeight: 100,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 100,
  },
  infoContainer: {
    flex: 2,
    marginRight: 8,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 8,
  },
});
