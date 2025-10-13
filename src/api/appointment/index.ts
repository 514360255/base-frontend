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
