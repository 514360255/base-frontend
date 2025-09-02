/*
 * @Author: 郭郭
 * @Date: 2025/8/29
 * @Description:
 */

import request from '@/utils/request';

/**
 * 获取菜单列表
 * @param params
 */
export const queryMenuPage = (params: object) => request.get('/menu/page', { params });

/**
 * 保存菜单
 * @param data
 */
export const saveMenu = (data: object) => request.post('/menu', data);

/**
 * 修改菜单
 * @param data
 */
export const updateMenu = (data: object) => request.put('/menu', data);

/**
 * 删除菜单
 * @param id
 */
export const delMenu = (id: number) => request.delete(`/menu/${id}`);

/**
 * 获取菜单详情
 * @param id
 */
export const getDetailById = (id: number) => request.get(`/menu/${id}`);

/**
 * 修改菜单状态
 * @param data
 */
export const updateMenuState = (data: object) => request.post('/menu/update/state', data);

/**
 * 修改菜单显示隐藏
 * @param data
 */
export const updateMenuShow = (data: object) => request.post('/menu/update/show', data);

/**
 * 菜单查询
 */
export const queryMenuList = () => request.get('/menu/list');
