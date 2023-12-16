import {
  MochiRequest,
  MochiRequestClient,
  MochiRequestMethod,
  MochiRequestOptions,
  MochiResponse,
  MochiResponseFormat,
} from '@mochiapp/js';
import axios, {
  AxiosHeaderValue,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const globalObject = global as unknown as { request: MochiRequestClient };

const mapAxiosToMochiOptions = (
  ops?: MochiRequestOptions
): AxiosRequestConfig<string> => {
  if (ops) {
    let body: string | undefined;
    if (ops.body) {
      if (typeof ops.body !== 'string') {
        body = JSON.stringify(ops.body);
      } else {
        body = ops.body;
      }
    }
    return {
      headers: ops.headers,
      timeout: ops.timeout,
      data: body,
    };
  } else {
    return {};
  }
};

const mapAxiosToMochiResponse = (
  req: MochiRequest,
  res: AxiosResponse<string>
): MochiResponse => {
  const format: MochiResponseFormat = {
    data: function (): ArrayBuffer {
      let value;
      if (typeof res.data === 'string') {
        value = res.data;
      } else {
        value = JSON.stringify(res.data);
      }
      const buf = new ArrayBuffer(value.length * 2); // 2 bytes for each char
      const bufView = new Uint16Array(buf);
      for (let i = 0, strLen = value.length; i < strLen; i++) {
        bufView[i] = value.charCodeAt(i);
      }
      return buf;
    },
    json: function <T = unknown>(): T {
      if (typeof res.data === 'string') {
        return JSON.parse(res.data);
      } else {
        return res.data;
      }
    },
    text: function (): string {
      if (typeof res.data === 'string') {
        return res.data;
      } else {
        return JSON.stringify(res.data);
      }
    },
  };

  const headers: Record<string, string> = {};
  for (const key of Object.keys(res.headers)) {
    const value: AxiosHeaderValue | undefined = res.headers[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'string') {
        headers[key] = value;
      } else if (typeof value === 'number') {
        headers[key] = value.toString();
      } else if (typeof value === 'boolean') {
        headers[key] = String(value);
      } else if (Array.isArray(value)) {
        headers[key] = value.join(', ');
      } else {
        console.log('header is an axiosheader type');
      }
    }
  }

  return {
    status: res.status,
    statusText: res.statusText,
    headers: headers,
    request: req,
    ...format,
  };
};

const createRequest = () =>
  <MochiRequestClient>{
    async get(url, options): Promise<MochiResponse> {
      const req: MochiRequest = {
        url: url,
        method: MochiRequestMethod.get,
        options: options,
      };

      return axios
        .get(url, mapAxiosToMochiOptions(options))
        .then((r) => mapAxiosToMochiResponse(req, r));
    },
    async post(url, options): Promise<MochiResponse> {
      const req: MochiRequest = {
        url: url,
        method: MochiRequestMethod.post,
        options: options,
      };

      return axios
        .post(url, mapAxiosToMochiOptions(options))
        .then((r) => mapAxiosToMochiResponse(req, r));
    },
    async put(url, options): Promise<MochiResponse> {
      const req: MochiRequest = {
        url: url,
        method: MochiRequestMethod.put,
        options: options,
      };

      return axios
        .put(url, mapAxiosToMochiOptions(options))
        .then((r) => mapAxiosToMochiResponse(req, r));
    },
    async patch(url, options): Promise<MochiResponse> {
      const req: MochiRequest = {
        url: url,
        method: MochiRequestMethod.patch,
        options: options,
      };

      return axios
        .patch(url, mapAxiosToMochiOptions(options))
        .then((r) => mapAxiosToMochiResponse(req, r));
    },
  };

globalObject.request = createRequest();
