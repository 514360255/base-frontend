/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import { queryAppointmentPage } from '@/api/appointment';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';

const Appointment = () => {
  const columns: CustomColumnProps[] = [
    {
      title: '医院名称',
      dataIndex: 'hospitalName',
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
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      hideInSearch: true,
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
    },
    {
      title: '所属人',
      dataIndex: 'accountName',
    },
  ];

  return <CustomTable columns={columns} request={queryAppointmentPage} />;
};

export default Appointment;
