/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import {
  deleteRole,
  detailById,
  queryRoleDataList,
  saveRole,
  updateRole,
  updateRoleState,
} from '@/api/permission/role';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { Button, message } from 'antd';
import { useRef } from 'react';

const Role = () => {
  const tableRef: any = useRef();
  const modalRef: any = useRef();
  const [messageApi, messageHolder] = message.useMessage();
  const columns: CustomColumnProps[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '角色CODE',
      dataIndex: 'code',
      hideInSearch: true,
      required: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
      type: 'radio',
      required: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      hideInSearch: true,
      hideInForm: true,
      buttons: (record: any) => {
        return (
          <>
            <Button type="link" onClick={() => modalRef.current.open(record)}>
              编辑
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      {messageHolder}
      <CustomTable
        ref={tableRef}
        modalTitle="角色"
        columns={columns}
        request={queryRoleDataList}
        deleteRequest={deleteRole}
        updateStateRequest={updateRoleState}
        toolBarRender={[
          <Button type="primary" onClick={() => modalRef.current.open()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="角色"
        saveRequest={saveRole}
        updateRequest={updateRole}
        detail={detailById}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Role;
