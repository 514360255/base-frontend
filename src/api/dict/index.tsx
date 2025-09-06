/*
 * @Author: 郭郭
 * @Date: 2025/9/4
 * @Description:
 */
import request from '@/utils/request';

/**
 * 获取字典列表
 * @param params
 */
export const queryDictPage = (params: object) => request.get('/dict/page', { params });

/**
 * 获取字典列表
 */
export const queryDictList = () => request.get('/dict/list');

/**
 * 保存字典
 * @param data
 */
export const saveDict = (data: object) => request.post('/dict', data);

/**
 * 修改字典
 * @param data
 */
export const updateDict = (data: object) => request.put('/dict', data);

/**
 * 修改字典字典状态
 * @param data
 */
export const updateDictState = (data: object) => request.post('/dict/update/state', data);

/**
 * 删除字典
 * @param id
 */
export const deleteDict = (id: string) => request.delete(`/dict/${id}`);

/**
 * 获取字典详情
 * @param id
 */
export const getDictDetailById = (id: string) => request.get(`/dict/${id}`);
