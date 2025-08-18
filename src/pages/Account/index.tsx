/*
 * @Author: 郭郭
 * @Date: 2025/8/8
 * @Description:
 */

import { queryUserList } from '@/api/account';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';

const Account = () => {
  const columns: CustomColumnProps[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '账号',
      dataIndex: 'account',
      hideInSearch: true,
      required: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
      required: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
      required: true,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      valueType: 'select',
      type: 'select',
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
  return <CustomTable columns={columns} request={queryUserList} />;
};

export default Account;
