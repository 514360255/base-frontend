import { getUserInfoById } from '@/api/account';
import { queryMenuList } from '@/api/permission/menu';
import DynamicIcon from '@/components/DynamicIcon';
import { USER_INFO_KEY } from '@/constants';
import { capitalizeFirstLetters } from '@/utils';
import Local from '@/utils/store';
import { ProBreadcrumb } from '@ant-design/pro-layout';
import { history } from '@umijs/max';
import { Spin } from 'antd';
import React from 'react';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown } from './components/RightContent/AvatarDropdown';

const loginPath = '/login';
let extraRoutes: any = [];

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

export function patchClientRoutes({ routes }: any) {
  const rootRoute = routes.find((route: any) => route.id === 'ant-design-pro-layout');
  rootRoute.children.push(...extraRoutes);
}

const getRouteData = (routes: any, parentId = 'ant-design-pro-layout') => {
  const ParentComponent = React.lazy(() => import('@/components/ParentComponent'));
  return routes.map((item: any) => {
    let Component = null;
    if (!Array.isArray(item.children)) {
      const pathname = capitalizeFirstLetters(item.pathname.split('/'));
      Component = React.lazy(
        () =>
          new Promise((resolve, reject) => {
            import(`@/pages${pathname.join('/')}`)
              .then((module) => resolve(module))
              .catch(() => import(`@/pages/404`).then((module: any) => resolve(module)));
          }),
      );
    }
    return {
      path: item.pathname,
      name: item.name,
      id: item.id,
      parentId: parentId,
      icon: <DynamicIcon iconName={item.icon} />,
      hideInMenu: item.isShow === 0,
      ...(Component ? { element: Component && <Component /> } : {}),
      ...(Array.isArray(item.children)
        ? {
            element: (
              <React.Suspense fallback={<Spin fullscreen />}>
                <ParentComponent />
              </React.Suspense>
            ),
            children: getRouteData(item.children, item.id),
          }
        : {}),
    };
  });
};

export function render(oldRender: any) {
  const userInfo = Local.get(USER_INFO_KEY);
  if (userInfo && userInfo.token) {
    queryMenuList()
      .then((data) => {
        extraRoutes = getRouteData(data);
        oldRender();
      })
      .catch((e) => console.log(e));
  }
  if (!userInfo) {
    oldRender();
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export function layout({ initialState }) {
  return {
    token: {
      sider: {
        colorMenuBackground: '#001529', // menu 的背景颜色
        colorMenuItemDivider: 'rgba(255, 255, 255, 0.15)', // menuItem 分割线的颜色
        colorTextMenu: '#a6aaae', // menuItem 的字体颜色
        colorTextMenuSecondary: '#a6aaae', // menu 的二级字体颜色，比如 footer 和 action 的 icon
        colorTextMenuSelected: '#ffffff', // menuItem 的选中字体颜色
        colorTextMenuActive: '#ffffff', // menuItem hover 的选中字体颜色
        colorTextMenuItemHover: '#ffffff', // menuItem 的 hover 字体颜色
        colorBgMenuItemActive: 'rgba(0, 0, 0, 0.15)', // menuItem 的点击时背景颜色
        colorBgMenuItemHover: 'rgba(90, 75, 75, 0.03)', // menuItem 的 hover 背景颜色
        colorBgMenuItemSelected: '#409EFF', // menuItem 的选中背景颜色
      },
    },
    avatarProps: {
      render: () => {
        return <AvatarDropdown />;
      },
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    headerContentRender: () => <ProBreadcrumb />,
    breadcrumbRender: (routers = []) => [...routers],
    ...defaultSettings,
  };
}
