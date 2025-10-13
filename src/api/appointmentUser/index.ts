/*
 * @Author: 郭郭
 * @Date: 2025/10/13
 * @Description:
 */

import request from '@/utils/request';

/**
 * 获取预约用户列表
 * @param params
 */
export const queryAppointmentUser = (params: any) => request.get('appointment/user', { params });
