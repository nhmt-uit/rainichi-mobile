import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadMessageOverlay, CharacterPage, SoundButton, AudioButton, AnimatedKanjiView} from '../components';
import {loadCharactersByLesson} from '../redux/actions';
import * as Utils from '../utils/utils';
import {commonStyles, images, colors} from '../assets';
import constants from '../utils/constants';

const rowNumber = 8;
const columnNumber = 5;
const maxInPage = rowNumber * columnNumber;

const defaultModelMapper = {
  getChar: item => item.vocabulary,
  getDescription: item => item.spelling,
  getAudio: item => item.audio,
  getSvgUri: item => item.svg || item.image,
  getKanji: item => item.kanji || item.vocabulary,
  getFurigana: item => item.hiragana || item.katakana,
  getSpelling: item => item.spelling,
};
const ModelMappers = {
  [constants.specialCharacterType.KANJI]: {
    ...defaultModelMapper,
    getChar: item => item.kanji,
    getDescription: item => Utils.apiTranslation(item, 'meaning'),
  },
  [constants.specialCharacterType.NUMBER]: {
    ...defaultModelMapper,
    getDescription: item => Utils.apiTranslation(item, 'meaning'),
  },
  default: defaultModelMapper,
};

function getModelMapper(specialType) {
  if (specialType && ModelMappers[specialType]) {
    return ModelMappers[specialType];
  }
  return ModelMappers.default;
}

// Ported from the old app's CharacterScreen.js. `IndicatorViewPager`/
// `PagerDotIndicator` (old `rn-viewpager` fork) replaced with
// `react-native-pager-view` + a small inline dot row (no built-in dot
// indicator ships with the new library, and this is the only screen that
// needs one, so not worth a shared component for a single usage).
export default function CharacterScreen({route}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Vocabulary.isLoading);
  const characterList = useSelector(state => state.Vocabulary.vocabularyListById);
  const errorMessage = useSelector(state => state.Vocabulary.errorMessage);
  const [selected, setSelected] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const kanjiViewRef = useRef(null);

  const lessonId = route.params?.lessonId;
  const specialType = route.params?.specialType;
  const mapper = getModelMapper(specialType);

  useEffect(() => {
    dispatch(loadCharactersByLesson(lessonId, specialType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, specialType]);

  useEffect(() => {
    if (characterList && characterList.length > 0 && !selected) {
      setSelected(mapper.getChar(characterList[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterList]);

  function getSelectedData() {
    if (characterList) {
      for (let i = 0; i < characterList.length; i += 1) {
        if (mapper.getChar(characterList[i]) === selected) {
          return characterList[i];
        }
      }
    }
    return null;
  }

  function renderMainView() {
    if (!selected) {
      return <View style={styles.mainView} />;
    }
    const isNumber = specialType === constants.specialCharacterType.NUMBER;
    const isConnectionWord = specialType === constants.specialCharacterType.CONNECTION_WORK;
    const data = getSelectedData();
    if (!data) {
      return <View style={styles.mainView} />;
    }
    const audio = mapper.getAudio(data);
    let fontSize;
    if ((isNumber || isConnectionWord) && mapper.getFurigana(data)) {
      fontSize = 76 - mapper.getFurigana(data).length * 4;
    } else {
      fontSize = 76;
    }

    let kanji = data.kanji;
    if (Utils.isEmptyOrNil(kanji)) {
      switch (data.type) {
        case constants.vocabularyType.ALPHABET:
        case constants.vocabularyType.HIRAGANA:
          kanji = data.hiragana ? data.hiragana : data.vocabulary;
          break;
        case constants.vocabularyType.KATAKANA:
          kanji = data.katakana ? data.katakana : data.vocabulary;
          break;
        default:
          kanji = data.vocabulary;
          break;
      }
    }

    return (
      <View style={styles.mainView}>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>
            {audio && <AudioButton icon={images.sound} audioUri={audio} style={styles.button} />}
            <SoundButton icon={images.refresh} onPress={() => kanjiViewRef.current?.refreshWebView()} style={styles.button} />
          </View>
          <View>
            {data.kanji ? <Text style={styles.furigana}>{mapper.getFurigana(data)}</Text> : null}
            <Text style={{textAlign: 'center', marginVertical: 1}}>{mapper.getDescription(data)}</Text>
          </View>
        </View>
        {!kanji ? (
          <View style={styles.mainTextContainer}>
            <Text style={[styles.mainText, {fontSize}]}>{mapper.getFurigana(data)}</Text>
          </View>
        ) : (
          <AnimatedKanjiView ref={kanjiViewRef} style={styles.writingOrder} kanji={kanji} />
        )}
      </View>
    );
  }

  const characters = characterList ? characterList.map(item => mapper.getChar(item)) : [];
  const pageCount = Math.max(1, Math.ceil(characters.length / maxInPage));

  return (
    <Background>
      {renderMainView()}
      <View style={styles.list}>
        {characters.length > 0 && (
          <>
            <PagerView style={styles.pager} onPageSelected={e => setPageIndex(e.nativeEvent.position)}>
              {Array.from({length: pageCount}, (_, i) => i * maxInPage).map(startIndex => (
                <View key={`pageFrom${startIndex}`} style={styles.page}>
                  <CharacterPage
                    characters={characters}
                    columnNumber={columnNumber}
                    rowNumber={rowNumber}
                    startIndex={startIndex}
                    characterClicked={setSelected}
                    selected={selected}
                  />
                </View>
              ))}
            </PagerView>
            {pageCount > 1 && (
              <View style={styles.dotsContainer}>
                {Array.from({length: pageCount}).map((_, i) => (
                  <View key={i} style={[styles.dot, i === pageIndex && commonStyles.pagerDotIndicator]} />
                ))}
              </View>
            )}
          </>
        )}
      </View>
      <LoadMessageOverlay errorMessage={errorMessage} loading={isLoading} disableBackground={true} />
    </Background>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 2,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writingOrder: {
    flex: 1,
  },
  mainTextContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  mainText: {
    ...commonStyles.defaultText,
    color: colors.primary,
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  list: {
    flex: 3,
  },
  pager: {
    flex: 1,
  },
  page: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 6,
    width: 60,
    aspectRatio: 1,
  },
  furigana: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 1,
  },
  infoContainer: {
    flex: 0.7,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
});
