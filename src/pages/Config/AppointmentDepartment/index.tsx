/*
 * @Author: 郭郭
 * @Date: 2025/9/12
 * @Description:
 */

import {
  deleteHospital,
  getHospitalDetailById,
  queryHospitalPage,
  saveHospital,
  updateHospital,
  updateHospitalState,
} from '@/api/hospital';
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
      title: 'banner图',
      dataIndex: 'bannerImg',
      required: true,
      hideInTable: true,
      hideInSearch: true,
      type: 'upload',
    },
    {
      title: '疾病类型',
      dataIndex: 'diseaseType',
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
            <Button type="link" onClick={() => addHospital(record)} danger={record.isShow === 1}>
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const formList = {
    diseaseType: [
      {
        title: '疾病名称',
        dataIndex: 'name',
        required: true,
      },
      {
        title: 'icon',
        dataIndex: 'icon',
        type: 'upload',
        required: true,
        fieldBind: {
          maxCount: 1,
        },
      },
    ],
  };

  const addHospital = async (record: any = null) => {
    setColumns((s: CustomColumnProps[]) => {
      const column: CustomColumnProps | undefined = s.find((item) => item.dataIndex === 'code');
      if (column && column.fieldBind) {
        column.fieldBind = {
          disabled: !!record,
        };
      }
      return s;
    });
    modalRef.current.open({ isActive: 1, type: 1, isShow: 1, ...(record || []) });
  };

  return (
    <>
      <CustomTable
        ref={tableRef}
        columns={columns}
        request={queryHospitalPage}
        deleteRequest={deleteHospital}
        updateStateRequest={updateHospitalState}
        toolBarRender={[
          <Button type="primary" onClick={() => addHospital()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="科室"
        saveRequest={saveHospital}
        updateRequest={updateHospital}
        detail={getHospitalDetailById}
        columns={columns}
        formList={formList}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default AppointmentDepartment;
