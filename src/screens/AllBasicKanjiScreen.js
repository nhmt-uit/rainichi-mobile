import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {Background, LoadingIndicator, CharacterPage, AnimatedKanjiView, MeaningRow, SoundButton} from '../components';
import {images, colors} from '../assets';
import {i18n} from '../../locales';
import * as Utils from '../utils/utils';
import {loadKanjiByCourseId} from '../redux/actions';

export default function AllBasicKanjiScreen({route}) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.Vocabulary.isKanjiFetching);
  const kanjiList = useSelector(state => state.Vocabulary.kanjiList);
  const [activeSections, setActiveSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const kanjiViewRef = useRef(null);

  const courseId = route.params?.courseId;

  useEffect(() => {
    if (!kanjiList) {
      dispatch(loadKanjiByCourseId(courseId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (kanjiList && kanjiList.length > 0 && !selected) {
      setSelected(kanjiList[0].kanjis[0].kanji);
      setActiveSections([0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanjiList]);

  function getSelectedData() {
    if (kanjiList) {
      for (let i = 0; i < kanjiList.length; i += 1) {
        const subKanjiList = kanjiList[i].kanjis;
        for (let index = 0; index < subKanjiList.length; index += 1) {
          if (subKanjiList[index].kanji === selected) {
            return subKanjiList[index];
          }
        }
      }
    }
    return null;
  }

  function renderHeader(section, _, isActive) {
    return (
      <Animatable.View duration={300} style={[styles.header, isActive ? styles.active : styles.inactive]} transition="backgroundColor">
        <Text style={[styles.headerText, isActive ? styles.active : styles.inactive]}>
          {Utils.apiTranslation(section.metadata.group_chapter, 'name').toUpperCase()}
        </Text>
        <View style={[styles.separate, isActive ? {backgroundColor: colors.primary} : {backgroundColor: 'grey'}]} />
      </Animatable.View>
    );
  }

  function renderContent(section) {
    const characters = section ? section.kanjis.map(item => item.kanji) : [];
    const columnNumber = 5;
    const rowNumber = Math.ceil(characters.length / columnNumber);
    return (
      <Animatable.View duration={300} style={styles.content} transition="backgroundColor">
        <Animatable.View style={styles.page}>
          <CharacterPage characters={characters} columnNumber={columnNumber} rowNumber={rowNumber} characterClicked={setSelected} selected={selected} />
        </Animatable.View>
      </Animatable.View>
    );
  }

  function renderKanjiView() {
    if (!selected) {
      return null;
    }
    const data = getSelectedData();
    if (!data) {
      return null;
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.kanjiContainer}>
          <AnimatedKanjiView ref={kanjiViewRef} style={styles.writingOrder} kanji={data.kanji} />
          <SoundButton icon={images.refresh} onPress={() => kanjiViewRef.current?.refreshWebView()} style={styles.button} />
        </View>
        <View style={styles.meaningParentContainer}>
          <View style={styles.meaningContainer}>
            <MeaningRow meaningKey={i18n.t('vocabulary.chinese_vietnamese_word')} meaningValue={Utils.apiTranslation(data, 'chinese_vietnamese_word')} />
            <MeaningRow meaningKey={i18n.t('vocabulary.meaning')} meaningValue={Utils.apiTranslation(data, 'meaning')} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        <View style={{flex: 2}}>{renderKanjiView()}</View>
        <View style={{flex: 3}}>
          <ScrollView>
            {kanjiList ? (
              <Accordion
                activeSections={activeSections}
                sections={kanjiList}
                touchableComponent={TouchableOpacity}
                expandMultiple={true}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={300}
                onChange={sections => setActiveSections(sections.includes(undefined) ? [] : sections)}
              />
            ) : null}
          </ScrollView>
        </View>
        <LoadingIndicator isShow={isLoading} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  header: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 4,
  },
  active: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  inactive: {
    fontWeight: '400',
  },
  writingOrder: {
    flex: 1,
  },
  meaningContainer: {
    paddingVertical: 8,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  separate: {
    backgroundColor: colors.primary,
    marginTop: 4,
    height: 1,
    width: 120,
  },
  kanjiContainer: {
    flex: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningParentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 6,
    width: 60,
    aspectRatio: 1,
  },
});
