import { logout, updatePassword } from '@/api/account';
import { USER_INFO_KEY } from '@/constants';
import Local from '@/utils/store';
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Form, Input, message, Modal, Space } from 'antd';
import { FormRef } from 'rc-field-form';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const formRef: React.LegacyRef<FormRef<any>> | undefined = useRef<any>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, messageHolder] = message.useMessage();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/login' && !redirect) {
      logout().then(() => {
        Local.remove(USER_INFO_KEY);
        location.href = '/login';
      });
    }
  };

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      if (key === 'password') {
        setOpen(true);
        formRef.current?.resetFields();
      } else {
        history.push(`/account/${key}`);
      }
    },
    [setInitialState],
  );

  const { currentUser } = initialState || {};

  const menuItems = [
    // {
    //   key: 'info',
    //   icon: <SettingOutlined />,
    //   label: '个人中心',
    // },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const updatePasswordEvent = async () => {
    setLoading(true);
    try {
      const formData = await formRef.current?.validateFields();
      await updatePassword(formData);
      messageApi.success('修改成功');
      setTimeout(() => {
        loginOut();
      });
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      {messageHolder}
      <Modal
        open={open}
        title="修改密码"
        onCancel={() => setOpen(false)}
        onOk={updatePasswordEvent}
        confirmLoading={loading}
      >
        <Form size="large" layout="vertical" ref={formRef}>
          <Form.Item
            label="旧密码"
            name="password"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('新密码确认密码不匹配'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入确认密码" />
          </Form.Item>
        </Form>
      </Modal>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        <Space>
          {currentUser?.userAvatar ? (
            <Avatar size="small" src={currentUser?.userAvatar} />
          ) : (
            <Avatar size="small" icon={<UserOutlined />} />
          )}
          <span className="anticon">{currentUser?.name ?? '无名'}</span>
        </Space>
      </HeaderDropdown>
    </>
  );
};
