/*
 * @Author: 郭郭
 * @Date: 2025/10/16
 * @Description:
 */
import request from '@/utils/request';

/**
 * 查询医生预约列表
 * @param params
 */
export const queryAppointmentExpertPage = (params: any) =>
  request.get('/appointment/expert', { params });

/**
 * 保存医生预约详情
 * @param data
 */
export const saveAppointmentExpert = (data: any) => request.post('appointment/expert', data);

/**
 * 修改医生预约详情
 * @param data
 */
export const updateAppointmentExpert = (data: any) => request.put('appointment/expert', data);

/**
 * 修改医生预约详情
 * @param id
 */
export const deleteAppointmentExpert = (id: string) => request.delete(`appointment/expert/${id}`);
