import Animated, {
  Easing,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const useSharedTransition = (
  state: boolean,
  config: Animated.WithTimingConfig = {
    duration: 500,
    easing: Easing.bezier(0.33, 0.01, 0, 1),
  },
): Animated.SharedValue<number> => {
  'worklet';
  return useDerivedValue(() =>
    state ? withTiming(1, config) : withTiming(0, config),
  );
};

export const useSharedSpringTransition = (
  state: boolean,
  config?: Animated.WithSpringConfig,
): Animated.SharedValue<number> => {
  'worklet';
  return useDerivedValue(() =>
    state ? withSpring(1, config) : withSpring(0, config),
  );
};
