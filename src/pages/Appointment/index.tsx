/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import { queryAdminUserList } from '@/api/account';
import { queryAppointmentPage, updateIsVisit } from '@/api/appointment';
import { queryHospitalPage } from '@/api/hospital';
import { CustomColumnProps } from '@/components/compontent';
import CustomTable from '@/components/CustomTable';
import { USER_INFO_KEY } from '@/constants';
import { transformValueEnum } from '@/utils';
import Local from '@/utils/store';
import { Button, message, Popconfirm, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Appointment = () => {
  const tableRef: any = useRef();
  const userInfo = Local.get(USER_INFO_KEY);
  const isAdmin = userInfo.roleCode === 'SUPER_ADMIN';
  const isAuditor = userInfo.roleCode === 'AUDITOR';
  const [messageApi, contextHolder] = message.useMessage();
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
      dataIndex: 'hospitalId',
      width: 200,
      ellipsis: true,
      valueType: 'select',
      hideInSearch: isAuditor,
      hideInTable: true,
    },
    {
      title: '医院名称',
      dataIndex: 'hospitalName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      hideInTable: isAuditor,
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
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      hideInSearch: true,
      buttons: (record) => (
        <>
          {[0, 1].includes(record.isVisit) ? (
            <Typography.Text
              type={record.isVisit === 0 ? 'secondary' : 'danger'}
              style={{ padding: '0 16px' }}
            >
              {record.isVisit === 0 ? '未到诊' : '已到诊'}
            </Typography.Text>
          ) : (
            <>
              <Popconfirm
                title="确定当前患者【已到诊】？"
                onConfirm={() => handleVisit(record.id, 1)}
              >
                <Button type="text" danger>
                  已到诊
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定当前患者【未到诊】？"
                onConfirm={() => handleVisit(record.id, 0)}
              >
                <Button type="text" style={{ color: 'rgba(0,0,0,0.45)' }}>
                  未到诊
                </Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ]);

  const handleVisit = async (id: string, isVisit: number) => {
    await updateIsVisit(id, isVisit);
    messageApi.success(isVisit ? '已到诊' : '未到诊');
    tableRef.current.reload();
  };

  const getHospitalData = (accountId?: string) => {
    queryHospitalPage({ pageSizeZero: true, pageSize: 0, accountId }).then(({ list }: any) => {
      setColumns(transformValueEnum(columns, list, 'hospitalId'));
    });
  };

  useEffect(() => {
    if (isAdmin) {
      queryAdminUserList().then((data: any) => {
        setColumns(transformValueEnum(columns, data, 'accountId'));
      });
    }
    getHospitalData();
  }, []);

  return (
    <>
      {contextHolder}
      <CustomTable
        ref={tableRef}
        isUpdateState={false}
        isDelete={false}
        defaultQueryParams={{ hospitalId: isAuditor ? userInfo.hospitalId : undefined }}
        columns={columns}
        request={queryAppointmentPage}
      />
    </>
  );
};

export default Appointment;
