/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { getUserInfoById, queryUserList } from '@/api/account';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { useState } from 'react';

const Role = () => {
  const columns: CustomColumnProps[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '角色CODE',
      dataIndex: 'roleCode',
      hideInSearch: true,
      required: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
      type: 'radio',
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
    },
  ];
  const [modalProps, setModalProps] = useState({
    title: '新增角色',
  });

  return (
    <>
      <CustomTable
        columns={columns}
        modalProps={modalProps}
        request={queryUserList}
        detailRequest={getUserInfoById}
      />
    </>
  );
};

export default Role;
