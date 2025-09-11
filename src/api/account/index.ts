/*
 * @Author: 郭郭
 * @Date: 2025/8/8
 * @Description:
 */

import request from '@/utils/request';

/**
 * 登录
 * @param data
 */
export const login = (data: object) => request.post('/account/login', data);

/**
 * 退出登录
 */
export const logout = () => request.post('/account/logout');

/**
 * 获取用户信息
 * @param id
 */
export const getUserInfoById = (id: string) => request.get(`/account/userInfo`);

/**
 * 查询用户列表
 * @param params
 */
export const queryUserList = (params: object) => request.get('/account/userList', { params });

/**
 * 保存账号
 * @param data
 */
export const saveAccount = (data: object) => request.post('/account', data);

/**
 * 修改账号
 * @param data
 */
export const updateAccount = (data: object) => request.put('/account', data);

/**
 * 修改状态
 * @param data
 */
export const updateAccountState = (data: object) => request.post('/account/update/state', data);

/**
 * 修改密码
 * @param data
 */
export const updatePassword = (data: object) => request.post('/account/update/password', data);

/**
 * 删除账号
 * @param id
 */
export const deleteAccount = (id: string) => request.delete(`/account/${id}`);

/**
 * 获取账号信息
 * @param id
 */
export const getAccountInfoById = (id: string) => request.get(`/account/${id}`);
