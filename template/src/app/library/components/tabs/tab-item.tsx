import React from 'react';

import { useTranslation } from 'react-i18next';
import { useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { DefaultButton } from '@components/button/default-button';
import { AnimatedText, AnimatedView, View } from '@rn-core';

import { TabItemProps } from './type';

export const TabItem = ({ tab, index, selectedIndex }: TabItemProps) => {
  // state
  const { styles, theme } = useStyles(styleSheet);

  const [t] = useTranslation();

  // func
  const handlePress = () => {
    if (selectedIndex.value === index) {
      return;
    }

    selectedIndex.value = index;
  };

  // style
  const underlineStyle = useAnimatedStyle(() => ({
    opacity: selectedIndex.value === index ? 1 : 0,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color:
      selectedIndex.value === index
        ? theme.color.neutral500
        : theme.color.neutral300,
  }));

  // render
  return (
    <View style={styles.container}>
      <DefaultButton onPress={handlePress}>
        <View style={styles.button}>
          <AnimatedText style={[theme.textPresets.CTAs, textStyle]}>
            {t(tab.title)}
          </AnimatedText>
        </View>
      </DefaultButton>
      <AnimatedView pointerEvents="none" style={styles.underlineOverlay} />
      <AnimatedView
        pointerEvents="none"
        style={[styles.underline, underlineStyle]}
      />
    </View>
  );
};

const styleSheet = createStyleSheet(theme => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  container: {
    flex: 1,
  },
  underline: {
    backgroundColor: theme.color.primary500,
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 99,
  },
  underlineOverlay: {
    backgroundColor: theme.color.primary50,
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 9,
  },
}));
