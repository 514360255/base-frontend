/*
 * @Author: 郭郭
 * @Date: 2025/10/15
 * @Description:
 */

import { queryAdminUserList } from '@/api/account';
import {
  deleteAppointmentExpert,
  queryAppointmentExpertPage,
  saveAppointmentExpert,
  updateAppointmentExpert,
} from '@/api/appointmentExpert';
import { uploadImg } from '@/api/file';
import { queryHospitalPage } from '@/api/hospital';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { USER_INFO_KEY } from '@/constants';
import { transformValueEnum } from '@/utils';
import Local from '@/utils/store';
import { Button, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Expert = () => {
  const userInfo = Local.get(USER_INFO_KEY);
  const tableRef: any = useRef();
  const modalRef: any = useRef();
  const isAdmin = userInfo.roleCode === 'SUPER_ADMIN';
  const [messageApi, messageHolder] = message.useMessage();
  const [columns, setColumns] = useState<CustomColumnProps[]>([]);
  const [formColumns, setFormColumns] = useState<CustomColumnProps[]>([]);
  const [defaultColumns] = useState<CustomColumnProps[]>([
    {
      title: '所属人',
      dataIndex: 'accountId',
      type: 'select',
      valueType: 'select',
      required: true,
      hideInTable: true,
      hideInSearch: !isAdmin,
      hideInForm: !isAdmin,
    },
    {
      title: '所属人',
      dataIndex: 'accountName',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: !isAdmin,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalId',
      type: 'select',
      valueType: 'select',
      required: true,
      hideInTable: true,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      hideInForm: true,
    },
    {
      title: '职称',
      dataIndex: 'title',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '预约时间',
      dataIndex: 'consultationHours',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '介绍',
      dataIndex: 'intro',
      hideInSearch: true,
      hideInForm: true,
      ellipsis: true,
      width: 160,
    },
    {
      title: '医生',
      dataIndex: 'expertList',
      type: 'list',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      hideInForm: true,
      width: 160,
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
      fixed: 'right',
      buttons: (record: any) => {
        return (
          <>
            <Button type="link" onClick={() => updateExpert(record)}>
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const formList: any = {
    expertList: [
      {
        title: '头像',
        dataIndex: 'avatar',
        type: 'upload',
        required: true,
        fieldBind: {
          maxCount: 1,
          request: uploadImg,
        },
      },
      {
        title: '姓名',
        dataIndex: 'name',
        hideInSearch: true,
        required: true,
      },
      {
        title: '职称',
        dataIndex: 'title',
        hideInSearch: true,
        required: true,
      },
      {
        title: '预约时间',
        dataIndex: 'consultationHours',
        hideInSearch: true,
      },
      {
        title: '介绍',
        dataIndex: 'intro',
        hideInSearch: true,
        required: true,
        type: 'textArea',
        fieldBind: {
          rows: 5,
        },
      },
      {
        title: '排序',
        dataIndex: 'sortOrder',
        hideInSearch: true,
        required: true,
        type: 'inputNumber',
      },
    ],
  };

  const updateExpert = ({ avatar, ...data }: any) => {
    setFormColumns(formList.expertList);
    modalRef.current.open({ ...data, avatar: JSON.parse(avatar || '[]') });
  };

  const addExpert = (data: any = {}) => {
    setFormColumns(defaultColumns);
    modalRef.current.open(data);
  };

  const submit = async (data: any) => {
    data.consultationHours = data.consultationHours || '8:00 ~ 17:30';
    if (data.id) {
      await updateAppointmentExpert({
        ...data,
        avatar: JSON.stringify(data.avatar || '[]'),
      });
    } else {
      if (!data.expertList || data.expertList.length === 0) {
        messageApi.error('请添加医生');
        return Promise.reject();
      }
      if (!isAdmin) {
        data.accountId = userInfo.id;
      }
      await saveAppointmentExpert({
        ...data,
        expertList: data.expertList.map(({ avatar, ...item }: any) => ({
          ...item,
          avatar: JSON.stringify(avatar || '[]'),
        })),
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      queryAdminUserList().then((data: any) => {
        setColumns(transformValueEnum(defaultColumns, data, 'accountId'));
      });
    }
    queryHospitalPage({ pageSizeZero: true, pageSize: 0 }).then(({ list }: any) => {
      setColumns(transformValueEnum(defaultColumns, list, 'hospitalId'));
    });
  }, []);

  return (
    <>
      {messageHolder}
      <CustomTable
        isUpdateState={false}
        ref={tableRef}
        columns={columns}
        request={queryAppointmentExpertPage}
        deleteRequest={deleteAppointmentExpert}
        toolBarRender={[
          <Button type="primary" onClick={() => addExpert()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        formList={formList}
        ref={modalRef}
        title="医生"
        saveRequest={submit}
        updateRequest={submit}
        columns={formColumns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Expert;
