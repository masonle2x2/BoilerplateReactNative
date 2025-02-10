/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Text, TextInput } from 'react-native';

import { registerRootComponent } from 'expo';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'intl-pluralrules';
import 'react-native-gesture-handler';

import { MyApp } from './src/app';

import 'expo-dev-client';
import './declare';

// @ts-ignore
Text.defaultProps = Text.defaultProps || {
  allowFontScaling: false,
};

// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {
  allowFontScaling: false,
  autoCorrect: false,
  spellCheck: false,
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(MyApp);
