/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  Platform,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetInfoTuple = [boolean, boolean];
function useNetWorkStatus(): NetInfoTuple {
  const [status, setStatus] = useState<boolean>(false);

  const [canAccess, setCanAccess] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus(state.isConnected ?? false);

      setCanAccess(state.isInternetReachable ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [status, canAccess];
}

function useInterval(callback: Function, delay: number) {
  const tick = useCallback(() => {
    callback?.();
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay, tick]);
}

function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function useUnMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(() => () => callback(), []);
}

function useDidMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, []);
}

function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

  React.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);

    const handleKeyboardHide = () => setIsKeyboardShown(false);

    let keyboardWillShow: EmitterSubscription;
    let keyboardWillHide: EmitterSubscription;
    let keyboardDidShow: EmitterSubscription;
    let keyboardDidHide: EmitterSubscription;
    if (Platform.OS === 'ios') {
      keyboardWillShow = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardShow,
      );

      keyboardWillHide = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardHide,
      );
    } else {
      keyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow,
      );

      keyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide,
      );
    }

    return () => {
      if (Platform.OS === 'ios') {
        keyboardWillShow.remove();

        keyboardWillHide.remove();
      } else {
        keyboardDidShow.remove();

        keyboardDidHide.remove();
      }
    };
  }, []);

  return isKeyboardShown;
}

function useDisableBackHandler(disabled: boolean, callback?: () => void) {
  // function
  const onBackPress = useCallback(() => {
    if (isTypeof(callback, 'function')) {
      callback();
    }

    return true;
  }, [callback]);

  useEffect(() => {
    if (disabled) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [disabled, onBackPress]);
}

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}

function useMounted(callback: () => void, deps: any[] = []) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

function useErrorMessageTranslation(msg?: string) {
  const [t] = useTranslation();

  const parsed = useMemo<ValidateMessageObject | undefined>(() => {
    if (!msg) {
      return undefined;
    }

    try {
      return JSON.parse(msg);
    } catch {
      return undefined;
    }
  }, [msg]);

  return useMemo<string | undefined>(() => {
    if (!parsed && typeof msg === 'string') {
      return t(msg as any);
    }

    if (!parsed) {
      return undefined;
    }

    const optionsTx: Record<string, string> = {};

    if (parsed.optionsTx) {
      Object.keys(parsed.optionsTx).forEach(key => {
        optionsTx[key] = t(
          String(
            (parsed.optionsTx as Record<string, string | number>)[key],
          ) as any,
        );
      });
    }

    return t(parsed.keyT, { ...(parsed.options ?? {}), ...optionsTx });
  }, [parsed, t, msg]);
}

/**
 * @description Like 'useCallback' but with empty deps array.
 * Don't use this hooks when you want to render something on React Tree.
 * It will return previous value like usePrevious. first render will return undefined.
 * @example
 * This will render the previous value. don't use this:
 * ```tsx
 * const total = useEventCallback(() => state1 + state2)
 * <Text>{total()}</Text>
 * ```
 *
 * Use this:
 * ```tsx
 * const [msg,setMsg] = useState('');
 * const sendMsg = useEventCallback(() => sendMsgToApi(msg));
 * ```
 */
const useEventCallback = <Fn extends (...args: any[]) => ReturnType<Fn>>(
  func: Fn,
) => {
  const callbackRef = useRef<(...args: Parameters<Fn>) => ReturnType<Fn>>();

  const callbackMemoized = useCallback((...args: Parameters<Fn>) => {
    return callbackRef.current?.(...args);
  }, []);

  useLayoutEffect(() => {
    callbackRef.current = (...args) => func(...args);
  });

  return callbackMemoized;
};

export {
  useDidMount,
  useDisableBackHandler,
  useDismissKeyboard,
  useErrorMessageTranslation,
  useEventCallback,
  useInterval,
  useIsKeyboardShown,
  useMounted,
  useNetWorkStatus,
  usePrevious,
  useUnMount,
};
