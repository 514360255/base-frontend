import { login } from '@/api/account';
import { USER_INFO_KEY } from '@/constants';
import Local from '@/utils/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { notification, Tabs } from 'antd';
import React, { useState } from 'react';
import Settings from '../../../config/defaultSettings';
import styles from './index.less';

const Login: React.FC = (props: any) => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [notificationApi, contextHolder] = notification.useNotification();

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const data: any = await login(values);
      // 保存已登录用户信息
      setInitialState({ ...initialState, currentUser: data });
      history.push('/home');
      notificationApi.success({
        message: '登录成功',
        description: `欢迎回来，${data.name}！`,
      });
      Local.set(USER_INFO_KEY, data);
      return;
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={styles.containerClassName}>
      {contextHolder}
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div style={{ flex: '1', padding: '32px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          title={Settings.title}
          initialValues={{ autoLogin: true }}
          onFinish={handleSubmit}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            size="large"
            items={[{ key: 'account', label: '账户密码登录' }]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                placeholder={'请输入账号'}
                rules={[{ required: true, message: '账号是必填项！' }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                placeholder={'请输入密码'}
                rules={[{ required: true, message: '密码是必填项！' }]}
              />
            </>
          )}
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
