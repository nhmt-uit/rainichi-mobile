import React, {useRef} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback, Image, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {colors, images} from '../../assets';
import * as Utils from '../../utils/utils';

const borderRadius = 8;

export default function Answer(props) {
  const {answer, name, selected, style, checkEnabled, textStyle, enableCheckAnser, isCorrect, onClick} = props;
  const view = useRef(null);

  const containerStyle = [styles.card];
  if (selected) {
    if (enableCheckAnser) {
      containerStyle.push(isCorrect ? styles.correct : styles.wrong);
    } else {
      containerStyle.push(styles.highLight);
    }
  }
  const fullWidth = Dimensions.get('window').width;
  const padding = 8 * 2;
  const margin = 8 * 2;
  const answerWidth = fullWidth - styles.checkIcon.height - padding - margin;

  function onPress() {
    if (enableCheckAnser) {
      if (isCorrect) {
        view.current?.flash(1000);
      } else {
        view.current?.jello(1000);
      }
    }
    if (onClick) {
      onClick(name);
    }
  }

  return (
    <Animatable.View ref={view} style={Utils.mergeStyles(containerStyle, style)}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <View style={{width: answerWidth}}>
            <Text style={textStyle}>
              {name}．{answer}
            </Text>
          </View>
          {checkEnabled && selected ? (
            <Image height={styles.checkIcon.height} source={images.check} style={styles.checkIcon} resizeMode="contain" />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 46,
  },
  highLight: {
    backgroundColor: colors.answerHighLight,
  },
  wrong: {
    backgroundColor: 'red',
  },
  correct: {
    backgroundColor: colors.anwserCorrect,
  },
  checkIcon: {
    height: 32,
    width: 32,
  },
});
