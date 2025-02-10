/* eslint-disable @typescript-eslint/no-namespace */
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum APP_SCREEN {
  UN_AUTHORIZE = 'UN_AUTHORIZE',
  LOGIN = 'LOGIN',

  AUTHORIZE = 'AUTHORIZE',
  HOME = 'HOME',
}

export type RootStackParamList = {
  [APP_SCREEN.LOGIN]: undefined;
  [APP_SCREEN.UN_AUTHORIZE]: undefined;
  [APP_SCREEN.AUTHORIZE]: undefined;
  [APP_SCREEN.HOME]: undefined;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
