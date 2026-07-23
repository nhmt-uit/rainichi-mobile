import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, FlatList, TouchableHighlight, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator} from '../components';
import {colors} from '../assets';
import {loadMoreReadingList} from '../redux/actions';
import * as Utils from '../utils/utils';

function getItemName(item) {
  return Utils.apiTranslation(item, 'name') || item.name;
}

// Ported from the old app's ReadingListScreen.js + base/LoadedListScreen.js.
export default function ReadingListScreen({navigation, route}) {
  const dispatch = useDispatch();
  const readingList = useSelector(state => state.Reading.readingList);
  const nextUrl = useSelector(state => state.Reading.nextUrl);
  const isLoading = useSelector(state => state.Reading.isReadingLoading);

  const [data, setData] = useState(readingList);
  const prevReadingList = useRef(readingList);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const lessonId = route.params?.lessonId;
  const courseId = route.params?.courseId;
  const title = route.params?.title;
  const subtitle = route.params?.subtitle;
  const isCombo = route.params?.isCombo;

  useEffect(() => {
    if (readingList != null && prevReadingList.current !== readingList) {
      prevReadingList.current = readingList;
      setData(prev => [...prev, ...readingList]);
    }
  }, [readingList]);

  function onEndReached() {
    if (nextUrl && !isLoading && !onEndReachedCalledDuringMomentum.current) {
      dispatch(loadMoreReadingList(nextUrl));
      onEndReachedCalledDuringMomentum.current = true;
    }
  }

  function onItemClick(index) {
    navigation.navigate('Reading', {
      lessonId,
      courseId,
      title,
      subtitle,
      itemIndex: index,
      isCombo,
      isBackCourseseScreen: true,
      item: data[index],
    });
  }

  function renderRow({item, index}) {
    return (
      <TouchableHighlight underlayColor={colors.primary} activeOpacity={0.6} onPress={() => onItemClick(index)} style={styles.touchableItem}>
        <View style={styles.card}>
          <View style={{padding: 8, margin: 8}}>
            <Text>
              {index + 1}．{getItemName(item)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <Background style={styles.container}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderRow}
          keyExtractor={getItemName}
          horizontal={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
        />
        <LoadingIndicator isShow={isLoading} />
      </View>
    </Background>
  );
}

const margin = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  touchableItem: {
    marginTop: margin,
    marginStart: margin,
    marginEnd: margin,
    marginBottom: margin,
    borderRadius: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
});
