/*
 * @Author: 郭郭
 * @Date: 2025/9/12
 * @Description:
 */

import {
  deleteDepartmentById,
  queryDepartmentPage,
  saveDepartment,
  updateDepartment,
} from '@/api/appointmentDepartment';
import { uploadImg } from '@/api/file';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { Button } from 'antd';
import { useRef, useState } from 'react';

const AppointmentDepartment = () => {
  const modalRef: any = useRef();
  const tableRef: any = useRef();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '科室名',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '显示名',
      dataIndex: 'title',
      required: true,
    },
    {
      title: 'banner图',
      dataIndex: 'bannerUrl',
      hideInTable: true,
      hideInSearch: true,
      type: 'upload',
      fieldBind: {
        request: uploadImg,
      },
    },
    {
      title: '问题（","分隔开）',
      dataIndex: 'problems',
      type: 'textArea',
      hideInTable: true,
      hideInSearch: true,
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '疾病类型（","分隔开）',
      dataIndex: 'diseaseType',
      type: 'textArea',
      hideInTable: true,
      hideInSearch: true,
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '诊疗项目',
      dataIndex: 'diagnosisItems',
      required: true,
      hideInTable: true,
      hideInSearch: true,
      type: 'list',
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
      width: 100,
      buttons: (record: any) => {
        return (
          <>
            <Button type="link" onClick={() => addDept(record)}>
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const formList: { [key: string]: CustomColumnProps[] } = {
    diagnosisItems: [
      {
        title: '诊疗名称',
        dataIndex: 'name',
        required: true,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        type: 'upload',
        required: true,
        fieldBind: {
          maxCount: 1,
          request: uploadImg,
        },
      },
    ],
  };

  const submit = async (data: any) => {
    const { bannerUrl, diagnosisItems, ...other } = data;
    const params = {
      ...other,
      bannerUrl: bannerUrl ? JSON.stringify(bannerUrl) : [],
      diagnosisItems: diagnosisItems ? JSON.stringify(diagnosisItems) : [],
    };
    if (data.id) {
      await updateDepartment(params);
    } else {
      await saveDepartment(params);
    }
  };

  const addDept = async (record: any = null) => {
    if (record) {
      setColumns((s) => [
        ...s.map((item) =>
          item.dataIndex === 'name' ? { ...item, fieldBind: { disabled: true } } : item,
        ),
      ]);
    }
    modalRef.current.open({
      ...(record || {}),
      bannerUrl: record?.bannerUrl ? JSON.parse(record.bannerUrl) : [],
      diagnosisItems: record?.diagnosisItems ? JSON.parse(record.diagnosisItems) : [],
    });
  };

  return (
    <>
      <CustomTable
        ref={tableRef}
        columns={columns}
        request={queryDepartmentPage}
        deleteRequest={deleteDepartmentById}
        isUpdateState={false}
        toolBarRender={[
          <Button type="primary" onClick={() => addDept()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="科室"
        saveRequest={submit}
        updateRequest={submit}
        columns={columns}
        formList={formList}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default AppointmentDepartment;
