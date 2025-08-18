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
 * 获取用户信息
 * @param id
 */
export const getUserInfoById = (id: string) => request.get(`/account/userInfo`);

/**
 * 查询用户列表
 * @param data
 */
export const queryUserList = (data: object) => request.get('/account/userList', data);
