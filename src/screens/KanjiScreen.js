import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Background, Example, LoadingIndicator, SoundButton, AnimatedKanjiView} from '../components';
import * as Utils from '../utils/utils';
import {i18n} from '../../locales';
import constants from '../utils/constants';
import {colors, commonStyles, images} from '../assets';

export default function KanjiScreen({route}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kanjiData, setKanjiData] = useState(null);
  const kanjiViewRef = useRef(null);

  const character = route.params?.character;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await Utils.fetchApi(`${constants.api.kanji}${character}`);
        setKanjiData(response && response.data);
        setLoading(false);
        setError(null);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    load();
  }, [character]);

  function createExampleElement(example, number) {
    const title = `${i18n.t('vocabulary.example')} ${number}:`;
    return <Example key={title} title={title} example={example} style={styles.card} />;
  }

  function renderExamples() {
    const example1 = Utils.apiTranslation(kanjiData, 'example1');
    const example2 = Utils.apiTranslation(kanjiData, 'example2');
    const elements = [];
    if (example1) {
      elements.push(createExampleElement(example1, elements.length + 1));
    }
    if (example2) {
      elements.push(createExampleElement(example2, elements.length + 1));
    }
    return elements;
  }

  function renderContent() {
    if (!kanjiData) {
      return null;
    }
    return (
      <>
        <View style={styles.kanjiContainer} key="kanjiContainer">
          <AnimatedKanjiView ref={kanjiViewRef} style={styles.kanjiView} kanji={kanjiData.kanji} />
          <SoundButton icon={images.refresh} onPress={() => kanjiViewRef.current?.refreshWebView()} style={styles.button} />
        </View>
        <ScrollView style={styles.extensionContainer} key="extensionContainer">
          <View>
            <View style={styles.card}>
              <View style={styles.meaningRow}>
                <Text style={styles.meaningKey}>{i18n.t('vocabulary.word')}</Text>
                <Text style={styles.meaningValue}>: {kanjiData.kanji}</Text>
              </View>
              <View style={styles.meaningRow}>
                <Text style={styles.meaningKey}>{i18n.t('vocabulary.chinese_vietnamese_word')}</Text>
                <Text style={styles.meaningValue}>: {Utils.apiTranslation(kanjiData, 'chinese_vietnamese_word')}</Text>
              </View>
              <View style={styles.meaningRow}>
                <Text style={styles.meaningKey}>{i18n.t('vocabulary.meaning')}</Text>
                <Text style={styles.meaningValue}>: {Utils.apiTranslation(kanjiData, 'meaning')}</Text>
              </View>
            </View>
            {renderExamples()}
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        {renderContent()}
        {!Utils.isEmptyOrNil(error) && (
          <View style={styles.overlay}>
            <Text style={styles.error}>{error.message}</Text>
          </View>
        )}
        {loading && (
          <View style={styles.overlay}>
            <LoadingIndicator isShow={true} />
          </View>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: colors.error,
  },
  container: {
    flex: 1,
  },
  kanjiContainer: {
    flex: 1,
  },
  kanjiView: {
    width: '100%',
    height: '100%',
  },
  extensionContainer: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 4,
    backgroundColor: 'white',
    padding: 8,
    marginTop: 8,
    marginBottom: 2,
    marginStart: 2,
    marginEnd: 2,
  },
  meaningRow: {
    flexDirection: 'row',
  },
  meaningKey: {
    ...commonStyles.defaultText,
    color: 'black',
    flex: 5,
  },
  meaningValue: {
    ...commonStyles.defaultText,
    color: 'black',
    flex: 9,
  },
  button: {
    padding: 6,
    width: 60,
    aspectRatio: 1,
  },
});
