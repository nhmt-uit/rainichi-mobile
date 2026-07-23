import React, {useRef, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Subtitles from './Subtitles';

function cueEquals(cue1, cue2) {
  // eslint-disable-next-line eqeqeq
  if (cue1 == cue2) {
    return true;
  }
  if (!cue1 || !cue2) {
    return false;
  }
  return cue1.start === cue2.start && cue1.end === cue2.end && cue1.text === cue2.text;
}

function indexOfCue(cues, cue) {
  for (let i = 0; i < cues.length; i += 1) {
    if (cueEquals(cue, cues[i])) {
      return i;
    }
  }
  return -1;
}

function keyExtractor(item) {
  return `${item.start}-${item.end}`;
}

export default function SubtitlesList({cues, activeCue, renderSubTitle, onItemClicked, onMicClicked, style}) {
  const flatListRef = useRef(null);
  const prevActiveCue = useRef(activeCue);

  useEffect(() => {
    if (flatListRef.current && !cueEquals(prevActiveCue.current, activeCue)) {
      prevActiveCue.current = activeCue;
      const cueIndex = indexOfCue(cues, activeCue);
      if (cueIndex >= 0) {
        try {
          flatListRef.current.scrollToIndex({animated: true, index: cueIndex});
        } catch (e) {
          console.warn('scrollToIndex Error was ignored', e);
        }
      }
    }
  }, [activeCue, cues]);

  function renderItem({item}) {
    const subtitleProps = {
      cue: item,
      isActive: cueEquals(item, activeCue),
      onClicked: onItemClicked,
      onMicClicked,
      style: styles.item,
    };
    if (renderSubTitle) {
      return renderSubTitle(subtitleProps);
    }
    return <Subtitles {...subtitleProps} />;
  }

  return <FlatList ref={flatListRef} renderItem={renderItem} data={cues} style={style} extraData={activeCue} keyExtractor={keyExtractor} />;
}

const styles = StyleSheet.create({
  item: {
    marginTop: 4,
  },
});
