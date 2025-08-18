/*
 * @Author: 郭郭
 * @Date: 2025/8/11
 * @Description:
 */

import { CustomColumnProps, CustomTableProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

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
      modalProps = {
        title: '此处是标题',
      },
      ...tableProps
    }: CustomTableProps,
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState<any>({});

    const onSubmitEvent = () => {
      setVisible(false);
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

    useEffect(() => {
      const operation: CustomColumnProps | undefined = columns.find(
        (item) => item.dataIndex === 'operation',
      );
      if (operation) {
        if (!operation.width) {
          operation.width = 100;
        }
        operation.render = (_, record) => {
          return (
            <Space>
              <Button type="link" danger>
                删除
              </Button>
              <Button type="link" onClick={() => formEvent('edit', record.id)}>
                编辑
              </Button>
              <Button color="default" variant="link">
                详情
              </Button>
              {operation.buttons && operation.buttons(record)}
            </Space>
          );
        };
      }
    }, [columns]);

    return (
      <>
        <ProTable
          columns={columns}
          request={async (params) => {
            if (request && !dataSource) {
              const { list, ...data } = await request({ ...params, ...defaultQueryParams });
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
