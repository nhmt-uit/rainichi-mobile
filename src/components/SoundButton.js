import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Animated} from 'react-native';
import ImageButton from './ImageButton';
import {colors} from '../assets';

export default function SoundButton(props) {
  const {onPressStart, onPressStop, onPress, toggleLocked} = props;
  const [pressing, setPressing] = useState(false);
  const animated = useRef(new Animated.Value(0)).current;
  const opacityA = useRef(new Animated.Value(1)).current;
  const timeHandler = useRef(0);

  function runAnimation() {
    Animated.loop(
      Animated.parallel([Animated.timing(animated, {toValue: 1, duration: 1000}), Animated.timing(opacityA, {toValue: 0, duration: 1000})]),
    ).start();
  }

  function stopAnimation() {
    Animated.loop(Animated.parallel([Animated.timing(animated), Animated.timing(opacityA)])).stop();
  }

  function clearAutoRelease() {
    if (timeHandler.current) {
      clearTimeout(timeHandler.current);
      timeHandler.current = 0;
    }
  }

  function autoRelease() {
    timeHandler.current = setTimeout(() => {
      if (pressing) {
        if (onPressStop) {
          onPressStop();
          stopAnimation();
          setPressing(false);
        }
      }
      timeHandler.current = 0;
    }, 15000);
  }

  useEffect(() => clearAutoRelease, []);

  function handlePress() {
    if (onPress) {
      onPress();
    }
    if (pressing) {
      if (onPressStop) {
        onPressStop();
        stopAnimation();
        setPressing(false);
        clearAutoRelease();
      }
    } else if (onPressStart) {
      onPressStart();
      runAnimation();
      setPressing(true);
      autoRelease();
    }
  }

  const iconTint = pressing || toggleLocked ? colors.primary : null;
  const animatedStyle = pressing ? [{...styles.container, opacity: opacityA, transform: [{scale: animated}]}] : styles.container;

  return (
    <Animated.View style={animatedStyle}>
      <ImageButton {...props} onPress={handlePress} iconTint={iconTint} iconStyle={styles.icon} underlayColor="transparent" activeOpacity={1} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: null,
    height: null,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
