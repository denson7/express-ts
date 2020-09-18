import axios from 'axios';
import QS from 'qs';
import config from '../config';

const axiosRequest = axios.create({
  // 请求的公共地址
  baseURL: config.request.baseURL,
  // 请求超时时间
  timeout: 60000,
  // withCredentials: true,
  // Header
  headers: {
    'X-DreamFactory-API-Key': config.request.Key,
    'Content-Type': 'application/json',
  },
});

// request 拦截器
axiosRequest.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    console.log('request before');
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// response 拦截器
axiosRequest.interceptors.response.use(
  (response) => {
    // Do something with response data
    console.log('request after');
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

/**
 * GET
 * @param url
 * @param params
 */
export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axiosRequest
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
};

/**
 * POST
 * @param url
 * @param params
 */
export const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axiosRequest
      .post(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
};

export default axiosRequest;
