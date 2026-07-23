import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {commonStyles, colors, images} from '../../assets';
import ImageButton from '../ImageButton';

// Ported from the old app's BaseQuestion.js `renderPageIndicator`/`renderArrow`
// (shared by ListeningQuestion and ReadingQuestion) as a standalone component.
export default function PageIndicator({total, currentPosition, onPrevious, onNext}) {
  const pagePosition = (currentPosition || 0) + 1;
  if (!total || total <= 1) {
    return null;
  }
  const arrowLeft = pagePosition === 1 ? null : images.arrowLeft;
  const arrowRight = pagePosition === total ? null : images.arrowRight;

  return (
    <View style={styles.row}>
      {arrowLeft ? <ImageButton icon={arrowLeft} iconStyle={styles.navigateButton} onPress={onPrevious} /> : <View style={styles.navigateButton} />}
      <View>
        <Text style={styles.textIndicator}>{`${pagePosition}/${total}`}</Text>
        <View style={styles.textIndicatorUnderLine} />
      </View>
      {arrowRight ? <ImageButton icon={arrowRight} iconStyle={styles.navigateButton} onPress={onNext} /> : <View style={styles.navigateButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    alignSelf: 'center',
  },
  textIndicator: {
    ...commonStyles.defaultText,
    color: colors.primary,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 8,
  },
  textIndicatorUnderLine: {
    backgroundColor: colors.primary,
    width: 30,
    marginTop: 6,
    alignSelf: 'center',
    height: 1.5,
  },
  navigateButton: {
    width: 30,
    height: 30,
  },
});
