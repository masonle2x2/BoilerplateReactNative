import { UnistylesRegistry, UnistylesThemes } from 'react-native-unistyles';

import { darkColors } from './colors/dark';
import { lightColors } from './colors/light';
import { textPresets } from './text-presets';

export type Colors = keyof UnistylesThemes['dark']['color'];
const darkTheme = {
  color: darkColors,
  textPresets: textPresets,
  type: 'dark',
};

const lightTheme = {
  color: lightColors,
  textPresets: textPresets,
  type: 'light',
};

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

UnistylesRegistry.addThemes({
  dark: darkTheme,
  light: lightTheme,
}).addConfig({
  adaptiveThemes: true,
  // initialTheme: 'light',
});

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface UnistylesThemes extends AppThemes {}
}
