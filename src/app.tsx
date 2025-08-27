import { getUserInfoById } from '@/api/account';
import { USER_INFO_KEY } from '@/constants';
import Local from '@/utils/store';
import { ProBreadcrumb } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown } from './components/RightContent/AvatarDropdown';
import { requestConfig } from './requestConfig';

const loginPath = '/login';

export async function getInitialState(): Promise<InitialState> {
  const initialState: InitialState = {
    currentUser: undefined,
  };
  // 如果不是登录页面，执行
  const { location } = history;
  const storeUserInfo = Local.get(USER_INFO_KEY);
  if (location.pathname !== loginPath) {
    try {
      if (!storeUserInfo) {
        history.push('/login');
      } else {
        initialState.currentUser = await getUserInfoById(storeUserInfo.id);
      }
    } catch (error: any) {
      // 如果未登录
      history.push('/login');
    }
  } else {
    if (storeUserInfo && location.pathname === '/login') {
      initialState.currentUser = storeUserInfo;
      history.push('/home');
    }
  }
  return initialState;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      render: () => {
        return <AvatarDropdown />;
      },
    },
    menuHeaderRender: undefined,
    headerContentRender: () => <ProBreadcrumb />,
    breadcrumbRender: (routers = []) => [...routers],
    ...defaultSettings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
