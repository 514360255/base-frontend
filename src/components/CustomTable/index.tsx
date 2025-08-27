/*
 * @Author: 郭郭
 * @Date: 2025/8/11
 * @Description:
 */

import { CustomColumnProps, CustomTableProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import { ProFormInstance } from '@ant-design/pro-form';
import { ProTable } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const CustomTable = forwardRef<any, CustomTableProps>(
  // @ts-ignore
  (
    {
      isDelete = true,
      isEdit = true,
      isDetail = true,
      columns,
      rowKey,
      request,
      defaultQueryParams = {},
      toolBarRender = [],
      saveText = '新增',
      isSave = true,
      dataSource = null,
      deleteRequest,
      modalProps = {
        title: '此处是标题',
      },
      ...tableProps
    }: CustomTableProps,
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState<any>({});
    const formRef = useRef<ProFormInstance>();
    const [messageApi, messageHolder] = message.useMessage();

    const onSubmitEvent = (data?: boolean | { [key: string]: any }) => {
      setVisible(false);
      if (data && typeof data === 'boolean') {
        formRef.current?.submit();
      }
    };

    const formEvent = async (type: 'add' | 'edit', id = undefined) => {
      try {
        setVisible(true);
        setValues(type === 'add' ? {} : {});
      } catch (e) {
        console.log(e);
      }
    };

    useImperativeHandle(ref, () => ({
      setValues: (data: any) => setValues(data),
      edit(data: any) {
        setVisible(true);
        setValues(data);
      },
    }));

    const delEvent = async (id: string) => {
      try {
        if (deleteRequest) {
          await deleteRequest(id);
          messageApi.success('删除成功');
          formRef.current?.submit();
        }
      } catch (e) {
        console.log(e);
      }
    };

    useEffect(() => {
      const operation: CustomColumnProps | undefined = columns.find(
        (item) => item.dataIndex === 'operation',
      );
      columns.unshift({
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 70,
      });
      if (operation) {
        if (!operation.width) {
          operation.width = 100;
        }
        operation.render = (_, record) => {
          return (
            <Space>
              {isDelete && (
                <Popconfirm title="确定删除当前数据？" onConfirm={() => delEvent(record.id)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              )}
              {isEdit && (
                <Button type="link" onClick={() => formEvent('edit', record.id)}>
                  编辑
                </Button>
              )}
              {isDetail && (
                <Button color="default" variant="link">
                  详情
                </Button>
              )}
              {operation.buttons && operation.buttons(record)}
            </Space>
          );
        };
      }
    }, [columns]);

    return (
      <>
        {messageHolder}
        <ProTable
          bordered
          formRef={formRef}
          columns={columns}
          request={async (params, sort, filter) => {
            if (request && !dataSource) {
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
            }
            return {
              data: [],
              total: 0,
            };
          }}
          rowKey={rowKey || 'id'}
          dateFormatter="string"
          {...(Array.isArray(dataSource) && dataSource.length > 0 ? { dataSource } : {})}
          {...tableProps}
          toolBarRender={() => [
            isSave && (
              <Button type="primary" key="show" onClick={() => formEvent('add')}>
                {saveText}
              </Button>
            ),
            ...(toolBarRender || []),
          ]}
        />
        <CustomModal
          values={values || {}}
          columns={columns.filter((item) => !item.hideInForm)}
          visible={visible}
          onSubmit={onSubmitEvent}
          {...modalProps}
        />
      </>
    );
  },
);

export default CustomTable;
