/*
 * @Author: 郭郭
 * @Date: 2025/9/29
 * @Description:
 */

import request from '@/utils/request';

/**
 * 查询预约科室列表
 * @param params
 */
export const queryDepartmentPage = (params: object) =>
  request.get('appointment/department/page', { params });

/**
 * 保存预约科室
 * @param data
 */
export const saveDepartment = (data: object) => request.post('appointment/department', data);

/**
 * 更新预约科室
 * @param data
 */
export const updateDepartment = (data: object) => request.put('appointment/department', data);

/**
 * 根据id查询预约科室
 * @param id
 */
export const getDetailById = (id: string) => request.get(`appointment/department/${id}`);

/**
 * 根据id删除预约科室
 * @param id
 */
export const deleteDepartmentById = (id: string) => request.delete(`appointment/department/${id}`);
