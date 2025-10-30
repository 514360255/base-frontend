/*
 * @Author: 郭郭
 * @Date: 2025/8/8
 * @Description:
 */

import { USER_INFO_KEY } from '@/constants';
import { useQuery } from '@/hooks/useQuery';
import Local from '@/utils/store';
import { notification } from 'antd';
import { useEffect } from 'react';

const Home = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const query = useQuery();

  useEffect(() => {
    if (query.get('type') === 'success') {
      history.replaceState(null, '', '/home');
      const userInfo = Local.get(USER_INFO_KEY);
      notificationApi.success({
        message: '登录成功',
        description: `欢迎回来，【${userInfo.name}】！`,
        duration: 3,
      });
    }
  }, []);
  return <div>{contextHolder}首页</div>;
};

export default Home;
