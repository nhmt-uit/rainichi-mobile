import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {commonStyles, colors, images} from '../assets';
import {i18n} from '../../locales';
import SoundButton from './SoundButton';
import AudioButton from './AudioButton';
import ImageButton from './ImageButton';
import {apiTranslation, strictApiTranslation} from '../utils/utils';
import KanjiTouchableText from './KanjiTouchableText';
import Example from './Example';
import constants from '../utils/constants';
import {MeaningRow} from './MeaningRow';

function isNotAvailableHiragana(vocabulary) {
  return vocabulary.type === constants.vocabularyType.HIRAGANA || vocabulary.type === constants.vocabularyType.KATAKANA;
}

export default function VocabularyPage({vocabulary, pageNumber, pageCount, onSpeakerClicked, onMicClicked, onKanjiClicked, onArrowLeftClick, onArrowRightClick}) {
  const [isEnableAudioButton, setEnableAudioButton] = useState(true);

  function renderArrow(icon, onPress) {
    if (icon) {
      return <ImageButton icon={icon} iconStyle={styles.navigateButton} onPress={onPress} />;
    }
    return <View style={styles.navigateButton} />;
  }

  function renderArrowLeft() {
    if (pageNumber !== 0) {
      return renderArrow(images.arrowLeft, onArrowLeftClick);
    }
    return renderArrow(null, null);
  }

  function renderArrowRight() {
    if (pageNumber < pageCount - 1) {
      return renderArrow(images.arrowRight, onArrowRightClick);
    }
    return renderArrow(null, null);
  }

  function renderMeaning() {
    return (
      <View style={styles.meaningContainer}>
        {apiTranslation(vocabulary, 'chinese_vietnamese_word') ? (
          <MeaningRow meaningKey={i18n.t('vocabulary.chinese_vietnamese_word')} meaningValue={apiTranslation(vocabulary, 'chinese_vietnamese_word')} />
        ) : null}
        <MeaningRow meaningKey={i18n.t('vocabulary.meaning')} meaningValue={apiTranslation(vocabulary, 'meaning')} />
      </View>
    );
  }

  function renderAudioButtons() {
    return (
      <View style={styles.buttonContainer}>
        <AudioButton
          icon={images.sound}
          onPress={() => onSpeakerClicked && onSpeakerClicked(vocabulary)}
          style={styles.button}
          audioUri={vocabulary.audio}
          setEnableAudio={setEnableAudioButton}
        />
        <SoundButton icon={images.mic} onPress={() => onMicClicked && onMicClicked(vocabulary)} style={styles.button} />
      </View>
    );
  }

  function createExampleElement(example, number, audioUri) {
    const title = `${i18n.t('vocabulary.example')} ${number}:`;
    return <Example key={title} title={title} example={example} style={styles.example} audioUri={audioUri} setEnableAudio={setEnableAudioButton} />;
  }

  function renderExamples() {
    const example1 = strictApiTranslation(vocabulary, 'example1');
    const example2 = strictApiTranslation(vocabulary, 'example2');
    const audioEx1 = strictApiTranslation(vocabulary, 'audio_example_1');
    const audioEx2 = strictApiTranslation(vocabulary, 'audio_example_2');
    const elements = [];
    if (example1) {
      elements.push(createExampleElement(example1, elements.length + 1, audioEx1));
    }
    if (example2) {
      elements.push(createExampleElement(example2, elements.length + 1, audioEx2));
    }
    return elements;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container} pointerEvents={!isEnableAudioButton ? 'none' : 'auto'}>
        <View style={styles.main}>
          <View style={styles.kanjiContainer}>
            {renderArrowLeft()}
            <View style={{width: '70%'}}>
              <KanjiTouchableText style={styles.kanji} touchableProps={{underlayColor: '#FA9999', activeOpacity: 0.6}} onKanjiClicked={onKanjiClicked}>
                {vocabulary.vocabulary.trim()}
              </KanjiTouchableText>
              {isNotAvailableHiragana(vocabulary) ? null : <Text style={styles.furigana}>({vocabulary.hiragana})</Text>}
            </View>
            {renderArrowRight()}
          </View>
          {renderMeaning()}
          {renderAudioButtons()}
        </View>
        <View style={styles.exampleContainer}>{renderExamples()}</View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  main: {
    flexDirection: 'column',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 8,
  },
  button: {
    padding: 6,
    width: 60,
    aspectRatio: 1,
  },
  meaningContainer: {
    marginTop: 32,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  kanjiContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kanji: {
    color: colors.primary,
    fontSize: 80,
    alignSelf: 'center',
  },
  furigana: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  exampleContainer: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  example: {
    marginTop: 8,
  },
  navigateButton: {
    width: 48,
    height: 48,
  },
});
