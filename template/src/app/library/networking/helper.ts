/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef } from 'react';

import { API_CONFIG } from '@common/constant';
import { logout } from '@common/method';
import { AxiosError, AxiosResponse, Method } from 'axios';

const responseDefault: ResponseBase<Record<string, unknown>> = {
  code: -500,
  msg: 'error:have_error',
  status: false,
};

export const onPushLogout = async () => {
  logout();
  /**
   * do something when logout
   */
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

export const controller = createRef<AbortController>();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// init controller
controller.current = new AbortController();

export const cancelAllRequest = () => {
  controller.current?.abort();

  // reset controller, if not. all request cannot execute
  // because old controller was aborted
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  controller.current = new AbortController();
};

export const handleResponseAxios = <T = Record<string, unknown>>(
  res: AxiosResponse<T>,
): ResponseBase<T> => {
  if (res.data) {
    return { code: API_CONFIG.CODE_SUCCESS, data: res.data, status: true };
  }

  return responseDefault as ResponseBase<T>;
};

const handleErrorApi = (status: number) => {
  const result = { code: status, msg: '', status: false };

  if (status > 505) {
    result.msg = 'error:server_error';

    return result;
  }

  if (status < 500 && status >= 418) {
    result.msg = 'error:error_on_request';

    return result;
  }

  result.msg = ('error:' + status) as I18nKeys;

  return result;
};

export const handleErrorAxios = <T = Record<string, unknown>>(
  error: AxiosError,
): ResponseBase<T> => {
  if (error.code === API_CONFIG.STATUS_TIME_OUT) {
    // timeout
    return handleErrorApi(
      API_CONFIG.CODE_TIME_OUT,
    ) as unknown as ResponseBase<T>;
  }

  if (error.response) {
    if (error.response.status === API_CONFIG.RESULT_CODE_PUSH_OUT) {
      return handleErrorApi(
        API_CONFIG.RESULT_CODE_PUSH_OUT,
      ) as unknown as ResponseBase<T>;
    } else {
      return handleErrorApi(
        error.response.status,
      ) as unknown as ResponseBase<T>;
    }
  }

  return handleErrorApi(
    API_CONFIG.ERROR_NETWORK_CODE,
  ) as unknown as ResponseBase<T>;
};

export const handlePath = (url: string, path: ParamsNetwork['path']) => {
  if (!path || Object.keys(path).length <= 0) {
    return url;
  }

  let resUrl = url;
  Object.keys(path).forEach(k => {
    resUrl = resUrl.replaceAll(`{${k}}`, String(path[k]));

    resUrl = resUrl.replaceAll(`:${k}`, String(path[k]));
  });

  return resUrl;
};

export const handleParameter = <T extends ParamsNetwork>(
  props: T,
  method: Method,
): ParamsNetwork => {
  const { url, body, path, params } = props;

  return {
    ...props,
    data: body,
    method,
    params,
    url: handlePath(url, path),
  };
};
