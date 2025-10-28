import { getUserInfoById } from '@/api/account';
import { queryMenuList } from '@/api/permission/menu';
import DynamicIcon from '@/components/DynamicIcon';
import { USER_INFO_KEY } from '@/constants';
import { capitalizeFirstLetters } from '@/utils';
import Local from '@/utils/store';
import { ProBreadcrumb } from '@ant-design/pro-layout';
import { history, useModel } from '@umijs/max';
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
      ...(Component
        ? {
            element: Component && (
              <React.Suspense>
                <Component />
              </React.Suspense>
            ),
          }
        : {}),
      ...(Array.isArray(item.children)
        ? {
            element: (
              <React.Suspense>
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
      .catch((e) => oldRender());
  }
  if (!userInfo) {
    oldRender();
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export function layout({ initialState }) {
  const { collapsed, setCollapsed } = useModel('useCollapsedModel') ?? {};
  return {
    collapsed,
    onCollapse: (val: boolean) => {
      setCollapsed(val);
    },
    className: collapsed ? 'layout-page-container' : '',
    token: {
      sider: {
        colorMenuBackground: '#001529',
        colorTextMenuTitle: '#FFFFFF',
        colorMenuItemDivider: '#383838',

        colorTextMenu: '#FFFFFF',
        colorTextMenuSelected: '#FFFFFF',
        colorTextMenuItemHover: '#FFFFFF',

        colorBgMenuItemActive: '#409EFF',
        colorBgMenuItemHover: '#409EFF',
        colorBgMenuItemSelected: '#409EFF',
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
    breadcrumb: true,
    breadcrumbProps: {
      minLength: 1, // 至少一级也显示
    },
    headerContentRender: () => <ProBreadcrumb />,
    ...defaultSettings,
  };
}
