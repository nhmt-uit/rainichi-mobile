import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableHighlight} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Sound from 'react-native-sound';
import {colors, images} from '../assets';
import {Background, LoadingIndicator, SoundButton, AudioButton} from '../components';
import * as Utils from '../utils/utils';
import {loadVocabularyByLessonId, loadMoreVocabularyByLessonId} from '../redux/actions';

export default function VocabularyListScreen({navigation, route}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Vocabulary.isLoading);
  const vocabularyList = useSelector(state => state.Vocabulary.vocabularyListById);
  const nextLink = useSelector(state => state.Vocabulary.nextLink);
  const response = useSelector(state => state.Vocabulary.responseVocabularyById);
  const [isEnableAudioButton, setEnableAudioButton] = useState(true);

  const lessonId = route.params?.lessonId;

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    dispatch(loadVocabularyByLessonId(lessonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  function onEndReached() {
    if (nextLink) {
      dispatch(loadMoreVocabularyByLessonId(response, nextLink));
    }
  }

  function renderRow({item}) {
    return (
      <TouchableHighlight underlayColor={colors.primary} activeOpacity={0.6} style={styles.touchableItem}>
        <View style={styles.cardView}>
          <View style={styles.mainContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textJp}>{item.vocabulary}</Text>
              <Text style={styles.textMeaning}>{Utils.apiTranslation(item, 'meaning')}</Text>
            </View>
            <View style={styles.buttonContainer} pointerEvents={!isEnableAudioButton ? 'none' : 'auto'}>
              <AudioButton icon={images.sound} style={styles.iconStyle} audioUri={item.audio} setEnableAudio={setEnableAudioButton} />
              <SoundButton
                icon={images.mic}
                style={styles.iconStyle}
                onPress={() => navigation.navigate('SpeechEvaluation', {vocabulary: item})}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <Background>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={vocabularyList}
        renderItem={renderRow}
        style={{padding: 4}}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
      <LoadingIndicator isShow={isLoading} />
    </Background>
  );
}

const styles = StyleSheet.create({
  touchableItem: {
    borderRadius: 5,
  },
  iconStyle: {
    height: 48,
    margin: 4,
    width: 48,
  },
  buttonContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  textContainer: {
    height: '100%',
    flex: 2,
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textJp: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '300',
  },
  textMeaning: {
    color: 'black',
    fontSize: 16,
    fontWeight: '300',
  },
  cardView: {
    backgroundColor: 'white',
    margin: 4,
    padding: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
});
