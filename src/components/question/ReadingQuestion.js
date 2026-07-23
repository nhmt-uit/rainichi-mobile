import React, {useState, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import Background from '../Background';
import Button from '../Button';
import Paragraph from '../Paragraph';
import PageIndicator from './PageIndicator';
import {PureQuestion} from './Question';
import {calculateAnswer} from '../../utils/questionUtils';
import * as Utils from '../../utils/utils';
import {i18n} from '../../../locales';

// Ported from the old app's ReadingQuestion.js (extended BaseQuestion) as a
// function component -- same ViewPager -> react-native-pager-view swap as
// ListeningQuestion.js.
export default function ReadingQuestion({question, enableCheckAnser, shouldShowMeaningButton}) {
  const [practiceResult, setPracticeResult] = useState([]);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const pagerRef = useRef(null);

  const paragraphContent = showMeaning ? Utils.apiTranslation(question, 'description') : question.paragraph;

  function goToPage(index) {
    pagerRef.current?.setPage(index);
  }

  function selectAnswer(currentResult, payload) {
    setPracticeResult(calculateAnswer(currentResult, payload));
  }

  function toggleHint() {
    if (showMeaning) {
      return;
    }
    setShowHint(!showHint);
  }

  return (
    <Background style={styles.container}>
      <View style={{flex: 1}}>
        <Paragraph content={paragraphContent} showHint={showHint} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title={i18n.t(showHint ? 'reading.hide_hint' : 'reading.show_hint')} onPress={toggleHint} style={styles.hintButton} disable={showMeaning} />
        <PageIndicator
          total={question.child_questions?.length}
          currentPosition={currentPosition}
          onPrevious={() => goToPage(currentPosition - 1)}
          onNext={() => goToPage(currentPosition + 1)}
        />
        {shouldShowMeaningButton ? (
          <Button
            title={i18n.t(showMeaning ? 'reading.hide_meaning' : 'reading.show_meaning')}
            onPress={() => setShowMeaning(!showMeaning)}
            style={styles.hintButton}
          />
        ) : (
          <View />
        )}
      </View>
      <View style={{flex: 1}}>
        <PagerView style={styles.pager} ref={pagerRef} onPageSelected={e => setCurrentPosition(e.nativeEvent.position)}>
          {(question.child_questions || []).map((_, i) => (
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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  pager: {
    flex: 1,
    marginTop: 8,
  },
  hintButton: {
    alignSelf: 'center',
    marginTop: 4,
    height: 28,
    paddingStart: 12,
    paddingEnd: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: 40,
    marginEnd: 40,
  },
});
