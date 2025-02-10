import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

import { Icon } from '@components/icon';
import { AnimatedView, Text } from '@rn-core';
import { Colors } from '@theme/index';

import { useThrottle } from './hook';
import { buttonStyleSheet } from './styles';
import { ButtonProps } from './type';

export const PrimaryButton = ({
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

  // func
  const iconColor: Colors = disabled ? 'neutral200' : 'neutral50';

  // style
  const containerStyle = useAnimatedStyle(() => {
    let backgroundColor: string = color.primary500;
    if (disabled) {
      backgroundColor = color.neutral100;
    } else if (pressed.value) {
      backgroundColor = color.primary;
    }

    return {
      backgroundColor,
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
      <AnimatedView
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={[styles[size], containerStyle]}>
        {leftIcon ? <Icon colorTheme={iconColor} icon={leftIcon} /> : null}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Text style={[styles[`text_${size}`], styles.textColor(disabled)]}>
          {t18n ? t(t18n) : text}
        </Text>
        {rightIcon ? <Icon colorTheme={iconColor} icon={rightIcon} /> : null}
      </AnimatedView>
    </TouchableWithoutFeedback>
  );
};
