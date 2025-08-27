/*
 * @Author: 郭郭
 * @Date: 2025/8/19
 * @Description:
 */

import request from '@/utils/request';

/**
 * 角色列表
 * @param params
 */
export const queryRoleDataList = (params: object) => request.get('/role/list', { params });

/**
 * 保存角色
 * @param data
 */
export const saveRole = (data: object) => request.post('/role/save', data);

/**
 * 删除角色
 * @param id
 */
export const deleteRole = (id: string) => request.delete(`/role/${id}`);
