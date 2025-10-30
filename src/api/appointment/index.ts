/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import request from '@/utils/request';

/**
 * 获取预约列表
 * @param params
 */
export const queryAppointmentPage = (params: any) => request.get('/appointment', { params });

/**
 * 修改是否已看诊
 * @param id
 * @param isVisit
 */
export const updateIsVisit = (id: string, isVisit: number) =>
  request.put(`/appointment/${id}/${isVisit}`);
