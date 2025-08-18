/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { queryUserList } from '@/api/account';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { ProColumns } from '@ant-design/pro-table';

const Menu = () => {
  const columns: ProColumns[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色CODE',
      dataIndex: 'account',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
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
  ];
  return <CustomTable columns={columns} request={queryUserList} />;
};

export default Menu;
