import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import images from '../assets/images';
import * as utils from '../utils/utils';

export default function SimpleStarRating(props) {
  const maxStar = props.maxStar || 5;

  function getStarNumber() {
    let measure = props.starNumber;
    if (!measure || measure <= 0) {
      return 0;
    } else if (measure > maxStar) {
      return maxStar;
    }
    measure = Math.round(measure * 2);
    return measure / 2;
  }

  function renderStar(type, index) {
    let image = images.star;
    if (type === 'empty') {
      image = images.starEmpty;
    } else if (type === 'half') {
      image = images.starHalf;
    }
    return <Image source={image} style={styles.image} resizeMode="contain" key={index} />;
  }

  function renderStars() {
    const measure = getStarNumber();
    let index = 1;
    const elements = [];
    for (; index <= measure; index += 1) {
      elements.push(renderStar('full', index));
    }
    if (index === measure + 0.5) {
      elements.push(renderStar('half', index));
      index += 1;
    }
    for (; index <= maxStar; index += 1) {
      elements.push(renderStar('empty', index));
    }
    return elements;
  }

  return <View {...utils.mergeStyleToProps(styles.container, props)}>{renderStars()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
});
