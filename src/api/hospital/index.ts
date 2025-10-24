/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */
import request from '@/utils/request';

/**
 * 查询医院列表
 * @param params
 */
export const queryHospitalPage = (params: object) => request.get('/hospital/page', { params });

/**
 * 查询医院列表
 * @param data
 */
export const saveHospital = (data: object) => request.post('/hospital', data);

/**
 * 获取医院详情
 * @param id
 */
export const getHospitalDetailById = (id: string) => request.get(`/hospital/${id}`);

/**
 * 删除医院
 * @param id
 */
export const deleteHospital = (id: string) => request.delete(`/hospital/${id}`);

/**
 * 修改状态
 * @param data
 */
export const updateHospitalState = (data: object) => request.post(`/hospital/state`, data);

/**
 * 修改
 * @param data
 */
export const updateHospital = (data: object) => request.put(`/hospital`, data);

/**
 * 修改密钥
 * @param id
 * @param key
 */
export const updateHospitalSecret = (id: string, key: string) =>
  request.put(`/hospital/${id}/${key}`);
