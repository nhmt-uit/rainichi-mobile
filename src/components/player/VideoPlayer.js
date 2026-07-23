import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import Video from 'react-native-video';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Utils from '../../utils/utils';
import {images, commonStyles} from '../../assets';
import ImageButton from '../ImageButton';
import {Common} from './Common';

function formatTime(allSeconds) {
  const minutes = Math.floor(allSeconds / 60);
  const seconds = Math.round(allSeconds % 60);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}:` : ''}${remMinutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// The old app's VideoPlayer.js subclassed `react-native-video-controls`
// (unmaintained since ~2019, built against a much older react-native-video
// API). That library never got a New Architecture-compatible release and
// its internals assume APIs `react-native-video` v6 no longer exposes the
// same way, so instead of porting the subclass, this is a small
// custom player with its own play/pause + seek bar overlay -- the only
// controls ConversationScreen actually needs (it renders with
// disableVolume/disableBack/disableFullscreen all true). Keeps the same
// imperative pause()/seekTo() ref API the old VideoPlayer exposed.
const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const {source, style} = props;
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
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
    if (props.subTitlesTimes !== prevSubTitlesTimes.current) {
      prevSubTitlesTimes.current = props.subTitlesTimes;
      playerCommon.registerSubtitlesTimes(props);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.subTitlesTimes]);

  useImperativeHandle(ref, () => ({
    pause() {
      setPaused(true);
    },
    seekTo(time) {
      if (player.current) {
        seeking.current = true;
        player.current.seek(time);
      }
      playerCommon.registerSubtitlesTimes(props, time);
    },
  }));

  function togglePlayPause() {
    setPaused(prev => !prev);
    setShowControls(true);
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
    }, 200);
  }

  function onSeek({seekTime}) {
    setCurrentTime(seekTime);
    seeking.current = false;
  }

  function onUserSeeking(value) {
    setCurrentTime(value);
  }

  function onUserEndSeek(value) {
    player.current?.seek(value);
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowControls(prev => !prev)}>
      <View style={Utils.mergeStyles(styles.container, style)}>
        <Video
          style={styles.video}
          source={source}
          paused={paused}
          resizeMode="contain"
          ignoreSilentSwitch="ignore"
          ref={player}
          onLoad={onLoad}
          onProgress={onProgress}
          onSeek={onSeek}
          onEnd={onEnd}
          repeat={false}
        />
        {showControls ? (
          <View style={styles.controlsOverlay}>
            <ImageButton
              icon={paused ? images.playVideo : images.pauseVideo}
              iconStyle={styles.playIcon}
              iconTint="white"
              onPress={togglePlayPause}
            />
            <View style={styles.seekRow}>
              <Text style={styles.time}>{formatTime(currentTime)}</Text>
              <Slider
                style={styles.seekBar}
                maximumValue={duration}
                value={currentTime}
                onValueChange={onUserSeeking}
                onSlidingStart={() => (seeking.current = true)}
                onSlidingComplete={onUserEndSeek}
              />
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    paddingBottom: 4,
  },
  playIcon: {
    width: 36,
    height: 36,
  },
  seekRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  seekBar: {
    flex: 1,
  },
  time: {
    ...commonStyles.defaultText,
    color: 'white',
    fontSize: 11,
  },
});
