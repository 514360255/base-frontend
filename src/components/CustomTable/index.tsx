/*
 * @Author: 郭郭
 * @Date: 2025/8/11
 * @Description:
 */

import { CustomColumnProps, CustomTableProps } from '@/components/compontent';
import { ProFormInstance } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import { ActionType } from '@ant-design/pro-table/es/typing';
import { Button, message, Popconfirm } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const CustomTable = forwardRef<any, CustomTableProps>(
  (props: Omit<CustomTableProps, 'ref'>, ref) => {
    const {
      isIndex = true,
      isDelete = true,
      isUpdateState = true,
      columns,
      rowKey,
      request,
      defaultQueryParams = {},
      toolBarRender = [],
      dataSource = null,
      deleteRequest,
      updateStateRequest,
      ...tableProps
    } = props;
    const formRef = useRef<ProFormInstance>();
    const actionRef = useRef<ActionType>();
    const [messageApi, messageHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const delEvent = async (id: string) => {
      setLoading(true);
      try {
        await deleteRequest(id);
        messageApi.success('删除成功');
        setTimeout(() => {
          actionRef.current?.reload();
        });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    const updateState = async ({ id, isActive }: any) => {
      setLoading(true);
      try {
        await updateStateRequest({ id, isActive: isActive === 0 ? 1 : 0 });
        messageApi.success('状态修改成功');
        formRef.current?.submit();
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    useImperativeHandle(ref, () => ({
      reload() {
        actionRef.current?.reload();
      },
    }));

    useEffect(() => {
      const operation: CustomColumnProps | undefined = columns.find(
        (item: CustomColumnProps) => item.dataIndex === 'operation',
      );
      if (isIndex && Array.isArray(columns) && columns[0].dataIndex !== 'index') {
        columns.unshift({
          title: '序号',
          dataIndex: 'index',
          valueType: 'index',
          hideInSearch: true,
          hideInForm: true,
          width: 70,
        });
      }
      if (operation) {
        if (!operation.width) {
          operation.width = 100;
        }
        operation.render = (_, record) => {
          return (
            <div style={{ display: 'flex' }}>
              {isDelete && (
                <Popconfirm title="确定删除当前数据？" onConfirm={() => delEvent(record.id)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              )}
              {isUpdateState && (
                <Button
                  type="link"
                  danger={record.isActive === 1}
                  onClick={() => updateState(record)}
                >
                  {record.isActive === 0 ? '启用' : '禁用'}
                </Button>
              )}
              {operation.buttons && operation.buttons(record)}
            </div>
          );
        };
      }
    }, [columns]);

    return (
      <>
        {messageHolder}
        <ProTable
          loading={loading}
          bordered
          actionRef={actionRef}
          formRef={formRef}
          columns={columns}
          request={async (params, sort, filter) => {
            if (request && !dataSource) {
              setLoading(true);
              try {
                const { list, ...data } = await request({
                  ...params,
                  ...sort,
                  ...filter,
                  ...defaultQueryParams,
                });
                return {
                  data: list,
                  ...data,
                };
              } catch (e) {
                console.log(e);
              } finally {
                setLoading(false);
              }
            }
            return {
              data: [],
              total: 0,
            };
          }}
          rowKey={rowKey || 'id'}
          dateFormatter="string"
          {...(Array.isArray(dataSource) && dataSource.length > 0 ? { dataSource } : {})}
          toolBarRender={() => [...(toolBarRender || [])]}
          {...tableProps}
        />
      </>
    );
  },
);

export default CustomTable;
