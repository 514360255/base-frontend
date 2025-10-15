/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { ProColumns } from '@ant-design/pro-table';
import { Rules } from '@rc-component/async-validator';
import { ImgCropProps } from 'antd-img-crop';
import { ReactNode } from 'react';

interface CustomColumnProps extends ProColumns {
  /**
   * 字段类型
   */
  type?:
    | 'input'
    | 'radio'
    | 'select'
    | 'inputNumber'
    | 'treeSelect'
    | 'textArea'
    | 'upload'
    | 'list';

  /**
   * 是否必填
   */
  required?: boolean;

  /**
   * 校验
   */
  rules?: Rules[];

  /**
   * 表单字段绑定
   */
  fieldBind?: {
    /**
     * 请求
     * @param data
     */
    request?: (data: any) => any;

    /**
     * 裁切图片参数
     */
    imgCrop?:
      | ImgCropProps
      | {
          aspect?: any;
        };

    /**
     * 是否裁切图片
     */
    isCrop?: boolean;

    [key: string]: any;
  };

  /**
   * 表单字段唯一key
   */
  formKey?: string;

  /**
   * 操作按钮
   */
  buttons?: (data: { [key: string]: any }) => ReactNode;
}

interface CustomTableProps {
  /**
   * 是否有序号
   */
  isIndex?: boolean;
  /**
   * 是否有删除按钮
   */
  isDelete?: boolean;
  /**
   * 是否有编辑状态按钮
   */
  isUpdateState?: boolean;
  /**
   * 字段列表
   */
  columns: ProColumns[];

  /**
   * record key
   */
  rowKey?: string;

  /**
   * 请求api
   * @param data
   */
  request?: (data?: any) => any;

  /**
   * 删除api
   * @param data
   */
  deleteRequest?: (data?: any) => any;

  /**
   * 修改状态api
   * @param data
   */
  updateStateRequest?: (data?: any) => any;

  /**
   * 数据源
   */
  dataSource?: { [key: string]: any }[] | null;

  /**
   *
   */
  defaultQueryParams?: {
    [key: string]: any;
  };

  /**
   * 工具栏渲染
   */
  toolBarRender?: any[];

  /**
   * 其它参数
   */
  [key: string]: any;
}

interface CustomModalProps {
  /**
   * 标题
   */
  title?: string | undefined;

  /**
   * 弹窗类型
   */
  type?: 'modal' | 'drawer' | 'detail';

  /**
   * 提交成功后事件
   * @param data
   */
  onSubmit?: (data?: { [key: string]: any } | boolean) => void;

  /**
   * 宽度
   */
  width?: number | string;

  /**
   * 表单字段
   */
  columns?: CustomColumnProps[];

  /**
   * form列表
   */
  formList?: {
    [key: string]: any;
  };

  /**
   * 表单默认值
   */
  values?: { [key: string]: any };

  /**
   * 处理form数据
   */
  handleData?: (data: any) => any;

  /**
   * 保存
   * @param data
   */
  saveRequest?: (data: any) => any;

  /**
   * 修改
   * @param data
   */
  updateRequest?: (data: any) => any;

  /**
   * 详情
   * @param data
   */
  detail?: (data: any) => any;

  /**
   * 其它参数
   */
  [key: string]: any;
}
