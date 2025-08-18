/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { ProColumns } from '@ant-design/pro-table';
import { Rules } from '@rc-component/async-validator';
import { ReactNode } from 'react';

interface CustomColumnProps extends ProColumns {
  /**
   * 字段类型
   */
  type?: 'input' | 'radio' | 'select';

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
    [key: string]: any;
  };

  /**
   * 操作按钮
   */
  buttons?: (data: { [key: string]: any }) => ReactNode;
}

interface CustomTableProps {
  /**
   * 是否有删除按钮
   */
  isDelete?: boolean;
  /**
   * 是否有编辑按钮
   */
  isEdit?: boolean;
  /**
   * 是否有详情按钮
   */
  isDetail?: boolean;
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
   * 详情api
   * @param data
   */
  detailRequest?: (data?: any) => any;

  /**
   * 删除api
   * @param data
   */
  deleteRequest?: (data?: any) => any;

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
   * 新增按钮文字
   */
  saveText?: string;

  /**
   * 是否有新增按钮
   */
  isSave?: boolean;

  /**
   * 弹窗参数
   */
  modalProps?: CustomModalProps;

  /**
   * 其它参数
   */
  [key: string]: any;
}

interface CustomModalProps {
  /**
   * 标题
   */
  title?: string;

  /**
   * 弹窗类型
   */
  type?: 'modal' | 'drawer' | 'detail';

  /**
   * 提交成功后事件
   * @param data
   */
  onSubmit?: (data?: { [key: string]: any }) => void;

  /**
   * 关闭弹窗事件
   */
  visible?: boolean;

  /**
   * 宽度
   */
  width?: number | string;

  /**
   * 表单字段
   */
  columns?: CustomColumnProps[];

  /**
   * 表单默认值
   */
  values?: { [key: string]: any };

  /**
   * 其它参数
   */
  [key: string]: any;
}
