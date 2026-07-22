import React, {useState, useRef, useEffect} from 'react';
import Sound from 'react-native-sound';
import {Alert} from 'react-native';
import {i18n} from '../../locales';
import SoundButton from './SoundButton';

export default function AudioButton(props) {
  const {audioUri, setEnableAudio, onActive, onDone} = props;
  const [toggleLocked, setToggleLocked] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  function playSoundUnsafe() {
    if (onActive) {
      onActive();
    }
    setToggleLocked(true);
    if (setEnableAudio) {
      setEnableAudio(false);
    }
    if (audioUri) {
      soundRef.current = new Sound(audioUri, null, error => {
        if (error) {
          setToggleLocked(false);
          if (setEnableAudio) {
            setEnableAudio(true);
          }
          if (onDone) {
            onDone();
          }
          Alert.alert(i18n.t('error.title'), error.message);
        } else {
          soundRef.current.play(() => {
            setToggleLocked(false);
            if (setEnableAudio) {
              setEnableAudio(true);
            }
            if (onDone) {
              onDone();
            }
            soundRef.current.release();
          });
        }
      });
    }
  }

  function onAudioPress() {
    if (soundRef.current && soundRef.current.isPlaying()) {
      soundRef.current.stop(() => playSoundUnsafe());
    } else {
      playSoundUnsafe();
    }
  }

  if (audioUri == null) {
    return null;
  }

  return <SoundButton {...props} onPress={onAudioPress} toggleLocked={toggleLocked} />;
}
