export default [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    layout: false,
    name: '登录',
    component: './Login',
  },
  {
    path: '/home',
    name: '主页',
    icon: 'HomeOutlined',
    component: './Home',
  },
  {
    path: '/account',
    name: '账号管理',
    icon: 'UserOutlined',
    component: './Account',
  },
  {
    path: '/permissionManage',
    name: '权限管理',
    icon: 'LockOutlined',
    routes: [
      {
        path: 'role',
        name: '角色管理',
        component: './PermissionManage/Role',
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: './PermissionManage/Menu',
      },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
