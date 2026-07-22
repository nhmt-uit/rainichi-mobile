import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import React from 'react';
import * as Utils from '../utils/utils';

function isKanji(string, index) {
  const charCode = string.charCodeAt(index);
  if (charCode >= 0x4e00 && charCode <= 0x9faf) {
    return true;
  }
  return charCode >= 0x3400 && charCode <= 0x4dbf;
}

function createElements(string, createKanjiElement, createNormalElement) {
  const res = [];
  let latestTokenIndex = 0;
  for (let i = 0; i < string.length; i += 1) {
    if (isKanji(string, i)) {
      if (i > latestTokenIndex) {
        res.push(createNormalElement(string.substring(latestTokenIndex, i), res.length));
      }
      res.push(createKanjiElement(string[i], res.length));
      latestTokenIndex = i + 1;
    }
  }
  if (latestTokenIndex < string.length) {
    res.push(createNormalElement(string.substring(latestTokenIndex, string.length), res.length));
  }
  return res;
}

// Ported from the old app's KanjiTouchableText.js. Fixed a real bug: the
// original had `possibleKanjiWidth = ...`, `possibleFontSize = ...`,
// `adjustFontSize = ...` with no `const`/`let`/`var`, leaking three
// implicit globals every render.
export default function KanjiTouchableText(props) {
  const {style, touchableProps, onKanjiClicked, children} = props;
  let passingStyle;

  if (style) {
    const {color, fontSize, fontStyle, fontWeight, lineHeight, fontFamily, textShadowRadius, letterSpacing, textDecorationColor, textDecorationStyle} = style;
    const maxFontSize = 60;
    const deviceWidth = Utils.getDimension().width;
    const possibleKanjiWidth = deviceWidth * 0.7;
    const possibleFontSize = possibleKanjiWidth / children.length;
    let adjustFontSize = Math.floor(possibleFontSize * 0.85);
    if (adjustFontSize > maxFontSize) {
      adjustFontSize = maxFontSize;
    }
    passingStyle = {
      color,
      fontSize: adjustFontSize,
      fontStyle,
      fontWeight,
      lineHeight,
      fontFamily,
      textShadowRadius,
      letterSpacing,
      textDecorationColor,
      textDecorationStyle,
    };
  }

  let text = children;
  text = text.split('(').join('');
  text = text.split(')').join('');

  function renderKanji(kanji, index) {
    return (
      <TouchableHighlight
        {...touchableProps}
        onPress={() => {
          if (touchableProps?.onPress) {
            touchableProps.onPress();
          }
          if (onKanjiClicked) {
            onKanjiClicked(kanji);
          }
        }}
        key={`kanji${index}`}>
        <Text style={[passingStyle]}>{kanji}</Text>
      </TouchableHighlight>
    );
  }

  function renderNonKanji(nonKanjiText, index) {
    return (
      <View key={`text${index}`}>
        <Text style={[passingStyle]}>{nonKanjiText}</Text>
      </View>
    );
  }

  return (
    <View {...props} style={[styles.container, style]}>
      {createElements(text, renderKanji, renderNonKanji)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
