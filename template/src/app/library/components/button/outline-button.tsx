import React from 'react';
import { ImageProps, TouchableWithoutFeedback } from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

import { AnimatedIcon } from '@components/icon';
import { AnimatedText, View } from '@rn-core';

import { useThrottle } from './hook';
import { buttonStyleSheet } from './styles';
import { ButtonProps } from './type';

export const OutlineButton = ({
  t18n,
  text,
  throttleMs,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  leftIcon,
  rightIcon,
  size = 'normal',
  disabled = false,
  ...rest
}: ButtonProps) => {
  // state
  const {
    styles,
    theme: { color },
  } = useStyles(buttonStyleSheet);

  const [t] = useTranslation();

  const [
    ,
    handlePress,
    handleLongPress,
    handlePressIn,
    handlePressOut,
    pressed,
  ] = useThrottle({
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    throttleMs,
  });

  const tintColor = useDerivedValue(() => {
    if (disabled) {
      return color.neutral100;
    }

    if (pressed.value) {
      return color.primary;
    }

    return color.primary500;
  });

  // style
  const textStyle = useAnimatedStyle(() => {
    return {
      color: tintColor.value,
    };
  });

  // props
  const iconProps = useAnimatedProps<ImageProps>(() => {
    return {
      tintColor: tintColor.value,
    };
  });

  // render
  return (
    <TouchableWithoutFeedback
      {...rest}
      disabled={disabled}
      onLongPress={handleLongPress}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={[styles[size], styles.buttonColor(disabled), styles.outline]}>
        {leftIcon ? (
          <AnimatedIcon animatedProps={iconProps} icon={leftIcon} />
        ) : null}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <AnimatedText style={[styles[`text_${size}`], textStyle]}>
          {t18n ? t(t18n) : text}
        </AnimatedText>
        {rightIcon ? (
          <AnimatedIcon animatedProps={iconProps} icon={rightIcon} />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};
