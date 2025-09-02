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
  { path: '*', layout: false, component: './404' },
];
