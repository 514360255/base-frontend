/*
 * @Author: 郭郭
 * @Date: 2025/9/16
 * @Description:
 */
import request from '@/utils/request';

/**
 * 上传图片
 * @param data
 */
export const uploadImg = (data: any) => request.post('/file/upload', data);
