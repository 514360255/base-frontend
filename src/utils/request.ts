/*
 * @Author: 郭郭
 * @Date: 2025/8/8
 * @Description:
 */
import { USER_INFO_KEY } from '@/constants';
import Local from '@/utils/store';
import { history } from '@umijs/max';
import { message } from 'antd';
import axios from 'axios';

const request = axios.create({
  baseURL: '/api/admin',
  timeout: 30 * 60 * 60,
});

request.interceptors.request.use(
  (config: any) => {
    const userInfo: any = Local.get(USER_INFO_KEY);
    if (userInfo && userInfo.token) {
      config.headers.Authorization = userInfo.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200 || (res?.data?.code && res?.data?.code !== 200)) {
      if (res.code === 400) {
        history.push('/account/login');
        Local.remove(USER_INFO_KEY);
      }
      message.error(res.message);
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res.data;
  },
  (error) => {
    const data = error.response.data;
    return Promise.reject(error.response.data);
  },
);

export default request;
