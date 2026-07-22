import React, {useState, useRef} from 'react';
import {Image, View, StyleSheet, Text, TouchableHighlight, Alert} from 'react-native';
import {commonStyles, images, colors} from '../assets';
import * as utils from '../utils/utils';
import SimpleStarRating from './SimpleStarRating';
import {i18n} from '../../locales';

const NEW = 'NEW';
const HOT = 'HOT';
const TOP = 'TOP';

// Ported from the old app's SellItem.js. The old app used
// react-native-cardview for the elevated card look; replaced with a plain
// View + platform shadow/elevation styling (styles.outerContainer) to avoid
// pulling in another old native module for a purely visual effect.
export default function SellItem(props) {
  const {image, tags, title, marked, itemId, style, sellItemClicked, starNumber, locked, trial, onBuyNow, onCompleteNeeded, followingId} = props;
  const [measureImgHeight, setMeasureImgHeight] = useState(null);
  const imageLayout = useRef(null);
  const containerLayout = useRef(null);

  function onPress() {
    if (sellItemClicked) {
      sellItemClicked(itemId);
    }
  }

  function onContainerLayout({nativeEvent}) {
    containerLayout.current = nativeEvent.layout;
  }

  function onImageLayout({nativeEvent}) {
    imageLayout.current = nativeEvent.layout;
  }

  // Attached to the OUTERMOST View's onLayout (fires when the card's own
  // size settles), not the Image's -- doing the overflow measurement +
  // setState in response to the Image's own onLayout would make the height
  // change re-trigger onImageLayout, which recomputes overflow again,
  // oscillating forever (this was a real bug introduced during the port:
  // setState ended up wired to onImageLayout instead of the outer
  // container's onLayout like the original class-component version).
  function onOuterLayout({nativeEvent}) {
    if (!imageLayout.current || !containerLayout.current) {
      return;
    }
    const overFlow = containerLayout.current.height - nativeEvent.layout.height;
    if (overFlow > 0) {
      setMeasureImgHeight(imageLayout.current.height - overFlow);
    }
  }

  function getMarkImage() {
    switch (marked) {
      case HOT:
        return images.markHot;
      case TOP:
        return images.markTop;
      case NEW:
        return images.markNew;
      default:
        return null;
    }
  }

  function renderMarked() {
    const markImage = getMarkImage();
    if (markImage) {
      return <Image style={styles.mark} source={markImage} />;
    }
    return null;
  }

  function renderTags() {
    let tagList = tags;
    if (!tagList) {
      return null;
    }
    if (!utils.isArray(tagList)) {
      tagList = [tagList];
    }
    return (
      <View style={styles.tagsContainer}>
        {tagList.map(tag => (
          <Text style={styles.tag} key={tag}>
            {tag}
          </Text>
        ))}
      </View>
    );
  }

  function renderStar() {
    if (utils.isNullOrUndefined(starNumber)) {
      return null;
    }
    return <SimpleStarRating starNumber={starNumber} style={styles.star} />;
  }

  function renderLock() {
    if (!locked) {
      return null;
    }
    if (trial) {
      return (
        <TouchableHighlight
          style={styles.lockedOverlayContainer}
          onPress={() =>
            Alert.alert(
              i18n.t('label.title'),
              i18n.t('label.buy_course'),
              [
                {text: i18n.t('label.cancel'), style: 'cancel'},
                {text: i18n.t('label.accept'), onPress: () => onBuyNow()},
              ],
              {cancelable: true},
            )
          }>
          <View style={styles.lockedOverlay}>
            <Image source={images.lock} style={styles.locked} />
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight style={styles.lockedOverlayContainer} onPress={() => onCompleteNeeded(followingId)}>
        <View style={styles.lockedOverlay} />
      </TouchableHighlight>
    );
  }

  const imageStyle = {...styles.image};
  if (measureImgHeight !== null) {
    Reflect.deleteProperty(imageStyle, 'width');
    imageStyle.height = measureImgHeight;
  }

  return (
    <View style={{...styles.outerContainer, ...style}} onLayout={onOuterLayout}>
      <TouchableHighlight activeOpacity={0.6} underlayColor="#f2efbe" onPress={onPress}>
        <View style={styles.container} onLayout={onContainerLayout}>
          <View style={styles.imageContainer}>
            <Image
              source={image}
              style={imageStyle}
              resizeMode="cover"
              onLayout={onImageLayout}
              resizeMethod="resize"
            />
            {renderMarked()}
            {renderTags()}
          </View>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title && title.toUpperCase()}
          </Text>
          {renderStar()}
        </View>
      </TouchableHighlight>
      {renderLock()}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    marginBottom: 14,
    width: '50%',
  },
  outerContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    margin: 3,
    alignSelf: 'stretch',
  },
  image: {
    borderRadius: 7,
    width: '100%',
    height: null,
    aspectRatio: 114 / 90,
  },
  title: {
    ...commonStyles.defaultText,
    color: colors.designBlack,
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: 14,
    marginBottom: 14,
    marginStart: 3,
    marginEnd: 3,
  },
  mark: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignSelf: 'flex-start',
  },
  tagsContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    margin: 2,
  },
  tag: {
    ...commonStyles.defaultText,
    fontSize: 11,
    paddingStart: 4,
    paddingEnd: 4,
    paddingTop: 2,
    paddingBottom: 2,
    margin: 2,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  lockedOverlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
  },
  lockedOverlay: {
    position: 'absolute',
    opacity: 0.89,
    backgroundColor: '#797979',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locked: {
    width: 32,
    height: 32,
  },
});
