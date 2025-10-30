/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import { queryAdminUserList } from '@/api/account';
import { queryAppointmentPage } from '@/api/appointment';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';
import { USER_INFO_KEY } from '@/constants';
import { transformValueEnum } from '@/utils';
import Local from '@/utils/store';
import { useEffect, useState } from 'react';

const Appointment = () => {
  const userInfo = Local.get(USER_INFO_KEY);
  const isAdmin = userInfo.roleCode === 'SUPER_ADMIN';
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '所属人',
      dataIndex: 'accountId',
      hideInSearch: !isAdmin,
      valueType: 'select',
      hideInTable: true,
    },
    {
      title: '所属人',
      dataIndex: 'accountName',
      hideInSearch: true,
      hideInTable: !isAdmin,
    },
    {
      title: '医院名称',
      dataIndex: 'hospitalName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      hideInSearch: true,
    },
    {
      title: '医生',
      dataIndex: 'expert',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      hideInSearch: true,
      width: 170,
    },
    {
      title: '疾病类型',
      dataIndex: 'disease',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
    },
  ]);

  useEffect(() => {
    if (isAdmin) {
      queryAdminUserList().then((data: any) => {
        setColumns(transformValueEnum(columns, data, 'accountId'));
      });
    }
  }, []);

  return <CustomTable columns={columns} request={queryAppointmentPage} />;
};

export default Appointment;
