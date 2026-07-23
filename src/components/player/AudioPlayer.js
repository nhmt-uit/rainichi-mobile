import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import Video from 'react-native-video';
import {View, StyleSheet, Text} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Utils from '../../utils/utils';
import {images, commonStyles, dimensions, colors} from '../../assets';
import ImageButton from '../ImageButton';
import {Common} from './Common';

function formatTime(allSeconds) {
  const minutes = Math.floor(allSeconds / 60);
  const seconds = Math.round(allSeconds % 60);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}:` : ''}${remMinutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Ported from the old app's AudioPlayer.js (class component) as a function
// component + forwardRef, keeping the same imperative pause()/seekTo() API
// that ConversationScreen/ListeningQuestion call via ref.
const AudioPlayer = forwardRef(function AudioPlayer(props, ref) {
  const {source, isRunningAudio, onRunningAudio, style} = props;
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const player = useRef(null);
  const playerCommon = useRef(new Common()).current;
  const seeking = useRef(false);
  const currentPlayingTime = useRef(0);

  useEffect(() => {
    playerCommon.registerSubtitlesTimes(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevSubTitlesTimes = useRef(props.subTitlesTimes);
  useEffect(() => {
    if (props.subTitlesTimes !== prevSubTitlesTimes.current && !seeking.current) {
      prevSubTitlesTimes.current = props.subTitlesTimes;
      playerCommon.registerSubtitlesTimes(props, currentTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.subTitlesTimes]);

  useEffect(() => {
    if (isRunningAudio != null && !isRunningAudio) {
      setPaused(true);
    }
  }, [isRunningAudio]);

  useImperativeHandle(ref, () => ({
    pause() {
      setPaused(true);
    },
    seekTo(time) {
      if (player.current) {
        seeking.current = true;
        player.current.seek(time);
      }
    },
  }));

  function onPlayPauseClicked() {
    setPaused(prev => !prev);
    if (!isRunningAudio && onRunningAudio) {
      onRunningAudio();
    }
  }

  function onLoad(payload) {
    setDuration(payload.duration);
  }

  function onProgress(payload) {
    const {currentTime: time} = payload;
    if (currentPlayingTime.current !== time) {
      if (!seeking.current) {
        setCurrentTime(time);
      }
      currentPlayingTime.current = time;
      playerCommon.checkSubtitle(props, time);
    }
  }

  function onEnd() {
    setPaused(true);
    setTimeout(() => {
      player.current?.seek(0);
    }, 500);
  }

  function onSeek({seekTime}) {
    setCurrentTime(seekTime);
    playerCommon.registerSubtitlesTimes(props, seekTime);
    seeking.current = false;
  }

  function onUserStartSeek() {
    if (player.current) {
      seeking.current = true;
    }
  }

  function onUserSeeking(value) {
    setCurrentTime(value);
  }

  function onUserEndSeek(value) {
    player.current?.seek(value);
  }

  return (
    <View style={Utils.mergeStyles(styles.container, style)}>
      <View style={styles.controlContainer}>
        <Video
          style={styles.hiddenVideo}
          source={source}
          paused={paused}
          ignoreSilentSwitch="ignore"
          ref={player}
          onLoad={onLoad}
          onProgress={onProgress}
          onSeek={onSeek}
          onEnd={onEnd}
          repeat={false}
        />
        <ImageButton icon={paused ? images.playVideo : images.pauseVideo} onPress={onPlayPauseClicked} />
        <Slider
          style={styles.seekBar}
          maximumValue={duration}
          value={currentTime}
          onValueChange={onUserSeeking}
          onSlidingStart={onUserStartSeek}
          onSlidingComplete={onUserEndSeek}
        />
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeStart}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeEnd}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
});

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    height: 64,
  },
  // Old app rendered this Video with the (since-removed) `audioOnly` prop,
  // which played sound without laying out a visible view at all.
  // react-native-video v6 has no headless-audio mode -- a view with no
  // width/height doesn't reliably get mounted/played under Fabric, so give
  // it a real (if visually negligible) size instead.
  hiddenVideo: {
    width: 1,
    height: 1,
  },
  controlContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  seekBar: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeStart: {
    ...commonStyles.defaultText,
    color: colors.designBlack,
    marginStart: dimensions.buttonHeight,
  },
  timeEnd: {
    ...commonStyles.defaultText,
    color: colors.designBlack,
  },
});
