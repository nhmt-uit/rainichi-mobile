import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, FlatList, TouchableHighlight, Text, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator} from '../components';
import {colors} from '../assets';
import {loadMoreConversations, openNextCourse} from '../redux/actions';
import * as Utils from '../utils/utils';
import {i18n} from '../../locales';

function getItemName(item) {
  const name = Utils.apiTranslation(item, 'name');
  return name || item.name;
}

// Ported from the old app's ConversationListScreen.js + base/LoadedListScreen.js.
// LoadedListScreen was only ever used by this one screen, so ported as a
// standalone screen rather than recreating the shared base class.
export default function ConversationListScreen({navigation, route}) {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.Conversation.conversations);
  const nextUrl = useSelector(state => state.Conversation.nextUrl);
  const isLoading = useSelector(state => state.Conversation.isConversationsFetching);
  const isOpenNextCoursing = useSelector(state => state.Practice.isOpenNextCoursing);
  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);

  const [data, setData] = useState(conversations);
  const prevConversations = useRef(conversations);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const lessonId = route.params?.lessonId;
  const courseId = route.params?.courseId;
  const title = route.params?.title;
  const subtitle = route.params?.subtitle;
  const isCombo = route.params?.isCombo;
  const havePractice = route.params?.havePractice;

  function onSubmit() {
    if (havePractice) {
      navigation.navigate('Practice', {lessonId, courseId, title, subtitle, isBackCourseseScreen: route.params?.isBackCourseseScreen});
    } else {
      dispatch(openNextCourse(lessonId, courseId));
    }
  }

  useEffect(() => {
    navigation.setParams({onSubmit});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conversations != null && prevConversations.current !== conversations) {
      prevConversations.current = conversations;
      setData(prev => [...prev, ...conversations]);
    }
  }, [conversations]);

  useEffect(() => {
    if (openNextCoursingErrorMessage && openNextCoursingErrorMessage !== prevErrorMessage.current) {
      prevErrorMessage.current = openNextCoursingErrorMessage;
      Alert.alert(i18n.t('error.title'), openNextCoursingErrorMessage);
    }
    if (openNextCoursingRes && openNextCoursingRes !== prevRes.current) {
      prevRes.current = openNextCoursingRes;
      navigation.goBack(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNextCoursingErrorMessage, openNextCoursingRes]);

  function onEndReached() {
    if (nextUrl && !isLoading && !onEndReachedCalledDuringMomentum.current) {
      dispatch(loadMoreConversations(nextUrl));
      onEndReachedCalledDuringMomentum.current = true;
    }
  }

  function onItemClick(index) {
    navigation.navigate('Conversation', {
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
        <LoadingIndicator isShow={isLoading || isOpenNextCoursing} />
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
