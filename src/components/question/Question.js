import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, ScrollView, Dimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Answer from './Answer';
import constants from '../../utils/constants';
import * as Utils from '../../utils/utils';
import {selectAnswer} from '../../redux/actions';

function toName(index) {
  return String.fromCharCode(index + 65);
}
function fromName(name) {
  return name.charCodeAt(0) - 65;
}

// Small stand-in for the old app's `react-native-auto-height-image` (its
// last release only supports React 17 and can't resolve against this
// project's React version) -- same behavior, just an Image.getSize() call
// scaling to a fixed width instead of a whole dependency.
function AutoHeightImage({source, width, style, resizeMode}) {
  const [height, setHeight] = useState(width);
  useEffect(() => {
    let cancelled = false;
    if (source?.uri) {
      Image.getSize(
        source.uri,
        (naturalWidth, naturalHeight) => {
          if (!cancelled && naturalWidth > 0) {
            setHeight((naturalHeight / naturalWidth) * width);
          }
        },
        () => {},
      );
    }
    return () => {
      cancelled = true;
    };
  }, [source?.uri, width]);
  return <Image source={source} resizeMode={resizeMode} style={[style, {width, height}]} />;
}

// Ported from the old app's Question.js. `PureQuestion` (the un-connected
// class, used directly by BaseQuestion/ListeningQuestion/ReadingQuestion
// with explicit props) is the one actually used in Giai đoạn 2 bước 7;
// the default connected export mirrors the old app's Practice-screen usage
// for when bước 8 (Practice/Score) is ported.
export function PureQuestion({questions, index, style, enableCheckAnser, practiceResult, selectAnswer: onSelectAnswer, onLoadEnd}) {
  const question = questions[index];
  const checkEnabled = question.type === constants.questionType.MULTI_CHOICE;

  function isAnswerSelected(answerName) {
    const answerIndex = fromName(answerName);
    const selectedMap = practiceResult[index];
    if (selectedMap) {
      return selectedMap[answerIndex] === true;
    }
    return false;
  }

  function onAnswerClick(answerName) {
    onSelectAnswer(practiceResult, {
      question,
      questionIndex: index,
      answerIndex: fromName(answerName),
    });
  }

  return (
    <ScrollView>
      <View style={[styles.container, style]}>
        <View style={styles.questionCard}>
          <AutoHeightWebView
            source={{html: Utils.createHtmlWithCustomPadding(question.question, 12)}}
            startInLoadingState
            style={{width: Dimensions.get('window').width - 16}}
            customStyle="p {font-size: 16px;}"
            onLoadEnd={() => onLoadEnd?.()}
          />
          {question.image ? (
            <AutoHeightImage style={styles.image} width={Utils.getDimension().width * 0.8} source={{uri: question.image}} resizeMode="contain" />
          ) : null}
        </View>
        {(question.answer || []).map((answer, i) => {
          const answerName = toName(i);
          return (
            <Answer
              answer={answer.answer}
              name={answerName}
              selected={isAnswerSelected(answerName)}
              checkEnabled={checkEnabled}
              onClick={onAnswerClick}
              style={styles.answer}
              key={i}
              textStyle={styles.baseFontStyle}
              isCorrect={answer.is_correct}
              enableCheckAnser={enableCheckAnser}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

export default function Question(props) {
  const dispatch = useDispatch();
  const questions = useSelector(state => state.Practice.practice);
  const practiceResult = useSelector(state => state.Practice.practiceResult);
  return (
    <PureQuestion
      {...props}
      questions={questions}
      practiceResult={practiceResult}
      selectAnswer={(currentResult, payload) => dispatch(selectAnswer(currentResult, payload))}
    />
  );
}

const styles = StyleSheet.create({
  baseFontStyle: {
    fontSize: 16,
  },
  container: {},
  answer: {
    marginStart: 8,
    marginBottom: 8,
    marginEnd: 8,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginStart: 8,
    marginEnd: 8,
    marginBottom: 16,
    marginTop: 16,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '80%',
    alignSelf: 'center',
  },
});
