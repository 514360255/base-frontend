/*
 * @Author: 郭郭
 * @Date: 2025/10/11
 * @Description:
 */

import { queryAppointmentUser } from '@/api/appointmentUser';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';
import { USER_INFO_KEY } from '@/constants';
import Local from '@/utils/store';

const AppointmentUser = () => {
  const userInfo = Local.get(USER_INFO_KEY);
  const columns: CustomColumnProps[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
    },
  ];

  return (
    <CustomTable
      defaultQueryParams={{
        accountId: userInfo.roleCode !== 'SUPER_ADMIN' ? userInfo.id : undefined,
      }}
      columns={columns}
      request={queryAppointmentUser}
    />
  );
};

export default AppointmentUser;
