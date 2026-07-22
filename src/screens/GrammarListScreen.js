import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, FlatList, TouchableHighlight, Text, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator} from '../components';
import {colors, commonStyles} from '../assets';
import {loadMoreGrammar, openNextCourse} from '../redux/actions';
import * as Utils from '../utils/utils';
import {i18n} from '../../locales';

export default function GrammarListScreen({navigation, route}) {
  const dispatch = useDispatch();
  const grammar = useSelector(state => state.Grammar.grammar);
  const nextUrl = useSelector(state => state.Grammar.nextUrl);
  const isLoading = useSelector(state => state.Grammar.isGrammarFetching);
  const isOpenNextCoursing = useSelector(state => state.Practice.isOpenNextCoursing);
  const openNextCoursingErrorMessage = useSelector(state => state.Practice.openNextCoursingErrorMessage);
  const openNextCoursingRes = useSelector(state => state.Practice.openNextCoursingRes);

  // GrammarListScreen is only navigated to (from GrammarLoadScreen) once
  // `grammar` already holds more than 1 item in redux state -- same initial
  // state as the original class component's `this.state = {data: this.props.grammar}`.
  const [data, setData] = useState(grammar);
  const prevGrammar = useRef(grammar);
  const prevErrorMessage = useRef(openNextCoursingErrorMessage);
  const prevRes = useRef(openNextCoursingRes);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const lessonId = route.params?.lessonId;
  const courseId = route.params?.courseId;
  const title = route.params?.title;
  const subtitle = route.params?.subtitle;
  const isCombo = route.params?.isCombo;
  const havePractice = route.params?.havePractice;
  const isBackCourseseScreen = route.params?.isBackCourseseScreen;

  function onSubmit() {
    if (havePractice) {
      navigation.navigate('Practice', {lessonId, courseId, title, subtitle, isBackCourseseScreen});
    } else {
      dispatch(openNextCourse(lessonId, courseId));
    }
  }

  useEffect(() => {
    navigation.setParams({onSubmit});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (grammar != null && prevGrammar.current !== grammar) {
      prevGrammar.current = grammar;
      setData(prev => [...prev, ...grammar]);
    }
  }, [grammar]);

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
      dispatch(loadMoreGrammar(nextUrl));
      onEndReachedCalledDuringMomentum.current = true;
    }
  }

  function openGrammar(index) {
    navigation.navigate('Grammar', {
      lessonId,
      courseId,
      title,
      subtitle,
      isCombo,
      item: data[index],
    });
  }

  function renderRow({item, index}) {
    return (
      <TouchableHighlight underlayColor={colors.primary} activeOpacity={0.6} onPress={() => openGrammar(index)} style={styles.touchableItem}>
        <View style={styles.card}>
          <Text style={styles.itemText}>
            {index + 1}．{Utils.apiTranslation(item, 'name')}
          </Text>
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
          style={{padding: 4}}
          keyExtractor={item => item.id + ''}
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
    padding: 16,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  itemText: {
    ...commonStyles.defaultText,
    color: 'black',
  },
});
