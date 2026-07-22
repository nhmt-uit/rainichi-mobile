import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {i18n} from '../../locales';
import {colors} from '../assets';
import * as Utils from '../utils/utils';
import HorizontalProgressBar from './HorizontalProgressBar';
import Button from './Button';
import constants from '../utils/constants';

// Ported from the old app's LearningResultItem.js -- react-native-cardview
// replaced with a plain View + shadow/elevation style, same as SellItem.js.
export default function LearningResultItem({item, onDetailPress, hideDetailButton, onContinuePress}) {
  const status = item.status === 'DONE' ? i18n.t('your_course.complete') : i18n.t('your_course.incomplete');
  let result = '';
  switch (item.result) {
    case constants.courseResult.NEW:
      result = i18n.t('your_course.new');
      break;
    case constants.courseResult.IN_PROGRESS:
      result = i18n.t('your_course.in_progress');
      break;
    default:
      result = i18n.t('your_course.done');
      break;
  }

  return (
    <TouchableHighlight underlayColor={colors.primary} activeOpacity={0.6} style={styles.touchableItem}>
      <View style={styles.cardView}>
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.titleText}>{Utils.apiTranslation(item, 'name') ? Utils.apiTranslation(item, 'name') : item.course}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.normalText}>{i18n.t('your_course.progress')}</Text>
              <Text style={styles.highLightText}>: {Math.round(item.progress)} %</Text>
            </View>
            <View style={{marginVertical: 4, marginEnd: 24}}>
              <HorizontalProgressBar percentage={item.progress} activeColor={colors.primary} thumbColor={colors.textHint} thumbHeight={4} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.normalText}>{i18n.t('your_course.status')}</Text>
              <Text style={styles.highLightText}>: {status}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.normalText}>{i18n.t('your_course.learning_result')}</Text>
              <Text style={styles.highLightText}>: {result}</Text>
            </View>
            {item.score != null ? (
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>{i18n.t('your_course.practice_score')}</Text>
                <Text style={styles.highLightText}>: {item.score}/100</Text>
              </View>
            ) : null}
            {item.duration != null ? (
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>{i18n.t('your_course.expiration_date')}</Text>
                {item.duration !== 999999 ? (
                  <Text style={styles.highLightText}>
                    : {item.duration}
                    {i18n.t('your_course.date')}
                  </Text>
                ) : (
                  <Text style={styles.highLightText}>:{i18n.t('your_course.forever')}</Text>
                )}
              </View>
            ) : null}
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonChildCotainer}>
              <Button title={i18n.t('your_course.learning_continue')} onPress={() => onContinuePress(item)} style={styles.detailButton} />
              {hideDetailButton ? null : (
                <Button
                  title={i18n.t('your_course.detail')}
                  onPress={() => onDetailPress(item)}
                  style={[styles.detailButton, {backgroundColor: 'black'}]}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchableItem: {
    borderRadius: 6,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 4,
  },
  cardView: {
    backgroundColor: 'white',
    margin: 4,
    padding: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  detailButton: {
    alignSelf: 'center',
    height: 40,
    paddingStart: 16,
    paddingEnd: 16,
    marginVertical: 4,
  },
  highLightText: {
    color: colors.primary,
    fontWeight: '500',
  },
  normalText: {
    color: colors.designBlack,
    width: 110,
    marginVertical: 2,
  },
  titleText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  contentContainer: {flex: 65},
  buttonContainer: {
    flex: 35,
    alignItems: 'center',
  },
  buttonChildCotainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
