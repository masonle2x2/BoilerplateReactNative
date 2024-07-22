/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, ColorValue, Linking } from 'react-native';

import { processColor } from 'react-native-reanimated';

import { appActions } from '@redux-slice';
import { remove } from '@storage';
import { I18nKeys } from '@utils/i18n/locales';
import { translate } from '@utils/i18n/translate';

import { MMKV_KEY } from '../constant';
import { dispatch } from '../redux';

export const onShowErrorBase = (msg: string) => {
  Alert.alert(msg);
};

export const checkKeyInObject = (T: Record<string, unknown>, key: string) => {
  return Object.keys(T).includes(key);
};

/**
 * return true when success and false when error
 */
export const validResponse = (
  response: ResponseBase<any>,
): response is ResponseBase<any, true> => {
  if (!response.status) {
    /**
     * handler error
     */
    return false;
  }

  return true;
};

export const logout = () => {
  dispatch(appActions.logout());

  remove(MMKV_KEY.APP_TOKEN);
};

export const handleErrorApi = (status: number) => {
  const result = { status: false, code: status, msg: '' };

  if (status > 505) {
    result.msg = translate('error:server_error');

    return result;
  }

  if (status < 500 && status >= 418) {
    result.msg = translate('error:error_on_request');

    return result;
  }

  result.msg = translate(('error:' + status) as I18nKeys);

  return result;
};

export const openLinking = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    }
  });
};

export const setAlpha = (color: ColorValue, alpha = 1) => {
  'worklet';
  let num = typeof color === 'number' ? color : processColor(color);

  if (typeof num !== 'number') {
    return color;
  }

  num >>>= 0;

  const b = num & 0xff,
    g = (num & 0xff00) >>> 8,
    r = (num & 0xff0000) >>> 16;

  return 'rgba(' + [r, g, b, alpha].join(',') + ')';
};

export const timeAgo = (
  date: Date,
): { title: I18nKeys; options?: { count: number } } => {
  const diff = (new Date().getTime() - date.getTime()) / 1000;

  const day_diff = Math.floor(diff / 86400);

  const conditions: Array<{
    check: boolean;
    result: { title: I18nKeys; options?: any };
  }> = [
    {
      check: isNaN(day_diff) || day_diff < 0 || day_diff >= 31,
      result: { title: 'date:just_now' },
    },
    { check: day_diff === 0 && diff < 60, result: { title: 'date:just_now' } },
    {
      check: day_diff === 0 && diff < 120,
      result: { title: 'date:minute_ago', options: { count: 1 } },
    },
    {
      check: day_diff === 0 && diff < 3600,
      result: {
        title: 'date:minutes_ago',
        options: { count: Math.floor(diff / 60) },
      },
    },
    {
      check: day_diff === 0 && diff < 7200,
      result: { title: 'date:hour_ago', options: { count: 1 } },
    },
    {
      check: day_diff === 0 && diff < 86400,
      result: {
        title: 'date:hours_ago',
        options: { count: Math.floor(diff / 3600) },
      },
    },
    { check: day_diff === 1, result: { title: 'date:yesterday' } },
    { check: day_diff < 7, result: { title: 'date:last_week' } },
    { check: day_diff < 31, result: { title: 'date:last_month' } },
    {
      check: day_diff < 365,
      result: {
        title: 'date:months_ago',
        options: { count: Math.ceil(day_diff / 30) },
      },
    },
    { check: day_diff === 365, result: { title: 'date:last_year' } },
    {
      check: true,
      result: {
        title: 'date:years_ago',
        options: { count: Math.floor(day_diff / 365) },
      },
    },
  ];

  for (const condition of conditions) {
    if (condition.check) {
      return condition.result;
    }
  }

  return {
    title: 'date:years_ago',
    options: { count: Math.floor(day_diff / 365) },
  };
};
