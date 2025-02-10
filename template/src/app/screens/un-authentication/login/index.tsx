import React, { useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, ViewProps } from 'react-native';

import {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';

import { OutlineButton } from '@components/button/outline-button';
import { PrimaryButton } from '@components/button/primary-button';
import { Checkbox } from '@components/checkbox';
import { Divider } from '@components/divider';
import { RadioButton } from '@components/radio-button';
import { Screen } from '@components/screen';
import { Tabs } from '@components/tabs';
import { AnimatedView, Text, View } from '@rn-core';
import {
  Canvas,
  Circle,
  Image,
  ImageShader,
  makeImageFromView,
  SkImage,
} from '@shopify/react-native-skia';
import { StatusBarStyle } from 'expo-status-bar';

const wait = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

export const Login = () => {
  // state

  const { height } = useWindowDimensions();

  const r = useSharedValue(0);

  const opacity = useSharedValue(0);

  const image1 = useSharedValue<SkImage | null>(null);

  const image2 = useSharedValue<SkImage | null>(null);

  const rootRef = useRef<View>(null);

  const { styles, theme } = useStyles(styleSheet);

  const [barStyle, setBarStyle] = useState<StatusBarStyle>('dark');

  // func
  const updateStatusBar = (prevType: string) => {
    setBarStyle(prevType !== 'dark' ? 'light' : 'dark');
  };

  const handleChangeTheme = async () => {
    await wait(300);

    opacity.value = 1;

    const overlay1 = await makeImageFromView(rootRef);

    image1.value = overlay1;

    await wait(100);

    UnistylesRuntime.setTheme(
      UnistylesRuntime.themeName !== 'dark' ? 'dark' : 'light',
    );

    await wait(200);

    const overlay2 = await makeImageFromView(rootRef);

    image2.value = overlay2;

    await wait(200);

    r.value = withTiming(height * 1.5, { duration: 1000 }, f => {
      if (f) {
        runOnJS(updateStatusBar)(theme.type);

        opacity.value = 0;

        r.value = 0;

        image2.value = null;

        image1.value = null;
      }
    });
  };

  // props
  const canvasProps = useAnimatedProps<ViewProps>(() => ({
    pointerEvents: opacity.value === 1 ? 'auto' : 'none',
  }));

  const canvasStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const size = useSharedValue({ height: 0, width: 0 });

  const widthCanvas = useDerivedValue(() => size.value.width);

  const heightCanvas = useDerivedValue(() => size.value.height);

  const circleC = useDerivedValue(() => ({
    x: widthCanvas.value / 2,
    y: heightCanvas.value,
  }));

  // render
  return (
    <>
      <View collapsable={false} ref={rootRef} style={styles.root}>
        <Screen
          bottomInsetColor="transparent"
          scroll
          excludeEdges={['bottom']}
          statusBarStyle={barStyle}
          style={{ paddingHorizontal: 10, paddingVertical: 0 }}
          backgroundColor={'transparent'}>
          <View style={styles.rowItem}>
            <Text style={styles.text}>Divider</Text>
            <Divider />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.text}>Radio Button</Text>
            <RadioButton initialValue={true} disabled />
            <RadioButton />
          </View>
          <View style={styles.colItem}>
            <Text style={styles.text}>Tabs</Text>
            <Tabs
              tabs={[
                { key: '1', title: 'tabs:tab1' },
                { key: '2', title: 'tabs:tab2' },
                { key: '3', title: 'tabs:tab3' },
                { key: '4', title: 'tabs:tab4' },
              ]}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.text}>Checkbox</Text>
            <Checkbox initialValue={true} disabled />
            <Checkbox />
          </View>
          <View style={styles.colItem}>
            <Text style={styles.text}>Primary Button</Text>
            <PrimaryButton
              onPress={handleChangeTheme}
              text="Button change theme"
            />
            <PrimaryButton disabled text="Button" />
            <PrimaryButton leftIcon="chevron_left" text="Button" />
            <PrimaryButton disabled leftIcon="chevron_left" text="Button" />
            <PrimaryButton rightIcon="chevron_left" text="Button" />
            <PrimaryButton disabled rightIcon="chevron_left" text="Button" />
          </View>
          <View style={styles.colItem}>
            <Text style={styles.text}>Outline Button</Text>
            <OutlineButton text="Button" />
            <OutlineButton disabled text="Button" />
            <OutlineButton leftIcon="chevron_left" text="Button" />
            <OutlineButton disabled leftIcon="chevron_left" text="Button" />
            <OutlineButton rightIcon="chevron_left" text="Button" />
            <OutlineButton disabled rightIcon="chevron_left" text="Button" />
          </View>
        </Screen>
      </View>
      <AnimatedView
        style={[StyleSheet.absoluteFillObject, canvasStyle]}
        animatedProps={canvasProps}>
        <Canvas onSize={size} style={[StyleSheet.absoluteFillObject]}>
          <Image
            x={0}
            y={0}
            fit={'cover'}
            width={widthCanvas}
            height={heightCanvas}
            image={image1}
          />

          <Circle c={circleC} r={r}>
            <ImageShader
              width={widthCanvas}
              height={heightCanvas}
              image={image2}
              fit={'cover'}
            />
          </Circle>
        </Canvas>
      </AnimatedView>
    </>
  );
};

const styleSheet = createStyleSheet(({ color, textPresets }) => ({
  colItem: {
    alignItems: 'flex-start',
    paddingVertical: 15,
    rowGap: 8,
  },
  root: {
    backgroundColor: color.background,
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  rowItem: {
    alignItems: 'center',
    columnGap: 8,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  text: {
    ...textPresets.label,
    color: color.neutral500,
  },
}));
