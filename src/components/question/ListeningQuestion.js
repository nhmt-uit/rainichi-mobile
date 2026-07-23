import React, {useState, useRef} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import PagerView from 'react-native-pager-view';
import AutoHeightWebView from 'react-native-autoheight-webview';
import * as Animatable from 'react-native-animatable';
import AudioPlayer from '../player/AudioPlayer';
import Background from '../Background';
import Button from '../Button';
import PageIndicator from './PageIndicator';
import {PureQuestion} from './Question';
import {commonStyles, colors} from '../../assets';
import {i18n} from '../../../locales';
import {calculateAnswer} from '../../utils/questionUtils';

// Ported from the old app's ListeningQuestion.js (extended BaseQuestion) as
// a function component. `rn-viewpager`/`@react-native-community/viewpager`
// replaced with `react-native-pager-view` (same swap made throughout Giai
// đoạn 2), `react-native-cardview` replaced with View+shadow.
export default function ListeningQuestion({question, enableCheckAnser, isRunningAudio, onRunningAudio}) {
  const [showHint, setShowHint] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [practiceResult, setPracticeResult] = useState([]);
  const pagerRef = useRef(null);

  if (!question?.media || !question.child_questions || question.child_questions.length === 0) {
    return (
      <Background style={styles.errorContainer}>
        <Text>{i18n.t('error.listening_unavailable')}</Text>
      </Background>
    );
  }

  function goToPage(index) {
    pagerRef.current?.setPage(index);
  }

  function selectAnswer(currentResult, payload) {
    setPracticeResult(calculateAnswer(currentResult, payload));
  }

  return (
    <Background style={styles.container}>
      <View style={styles.audioPlayerContainer}>
        <AudioPlayer isRunningAudio={isRunningAudio} style={commonStyles.audioPlayer} source={{uri: question.media}} onRunningAudio={onRunningAudio || (() => {})} />
      </View>
      <View style={styles.scrollView}>
        {showHint ? (
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.hintContainer}>
            <ScrollView style={{maxHeight: 180}}>
              <AutoHeightWebView source={{html: question.media_description == null ? '' : question.media_description}} style={styles.hint} />
            </ScrollView>
          </Animatable.View>
        ) : null}
        {enableCheckAnser ? (
          <Button title={i18n.t(showHint ? 'listening.hide_hint' : 'listening.show_hint')} onPress={() => setShowHint(!showHint)} style={styles.hintButton} />
        ) : null}
        <PageIndicator
          total={question.child_questions.length}
          currentPosition={currentPosition}
          onPrevious={() => goToPage(currentPosition - 1)}
          onNext={() => goToPage(currentPosition + 1)}
        />
        <PagerView style={styles.pager} ref={pagerRef} onPageSelected={e => setCurrentPosition(e.nativeEvent.position)}>
          {question.child_questions.map((_, i) => (
            <View key={i}>
              <PureQuestion
                index={i}
                questions={question.child_questions}
                practiceResult={practiceResult}
                selectAnswer={selectAnswer}
                enableCheckAnser={enableCheckAnser}
              />
            </View>
          ))}
        </PagerView>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  hintButton: {
    alignSelf: 'center',
    marginTop: 4,
  },
  audioPlayerContainer: {
    width: '100%',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  hint: {
    padding: 8,
    margin: 4,
  },
  hintContainer: {
    borderRadius: 4,
    margin: 8,
    backgroundColor: colors.highLight,
  },
  pager: {
    flex: 1,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
