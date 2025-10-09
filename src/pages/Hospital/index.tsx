/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import { queryDepartmentPage } from '@/api/appointmentDepartment';
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
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Hospital = () => {
  const modalRef: any = useRef();
  const tableRef: any = useRef();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '医院名称',
      dataIndex: 'name',
      required: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: '医院CODE',
      dataIndex: 'code',
      hideInSearch: true,
      required: true,
    },
    {
      title: '医院特色',
      dataIndex: 'feature',
      hideInSearch: true,
      required: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentNames',
      formKey: 'departmentIds',
      required: true,
      hideInSearch: true,
      valueType: 'select',
      type: 'select',
      valueEnum: {},
      fieldBind: {
        mode: 'multiple',
      },
    },
    {
      title: 'appid',
      dataIndex: 'appid',
      hideInSearch: true,
      hideInTable: true,
      required: true,
    },
    {
      title: 'secret',
      dataIndex: 'secret',
      hideInSearch: true,
      hideInTable: true,
      required: true,
    },
    {
      title: '医院地址',
      dataIndex: 'address',
      hideInSearch: true,
      hideInTable: true,
      required: true,
      type: 'textArea',
    },
    {
      title: '医院简介',
      dataIndex: 'description',
      hideInSearch: true,
      hideInTable: true,
      required: true,
      type: 'textArea',
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
      type: 'radio',
      required: true,
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
            <Button type="link" onClick={() => addHospital(record)}>
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const addHospital = async (record: any = null) => {
    setColumns((s: CustomColumnProps[]) => {
      const column: CustomColumnProps | undefined = s.find((item) => item.dataIndex === 'code');
      if (column) {
        column.fieldBind = {
          disabled: !!record,
        };
      }
      return record ? s.filter((item) => !['appid', 'secret'].includes(item.dataIndex)) : s;
    });
    modalRef.current.open({ isActive: 1, ...(record || {}) });
  };

  useEffect(() => {
    queryDepartmentPage({ pageSizeZero: true, pagSize: 0 }).then(({ list }: any) => {
      const valueEnum: any = {};
      list.forEach((item: any) => {
        valueEnum[item.id] = { text: item.name };
      });
      setColumns((s: CustomColumnProps[]) => {
        const column: CustomColumnProps | undefined = s.find(
          (item) => item.dataIndex === 'departmentNames',
        );
        if (column) {
          column.hideInSearch = false;
          column.valueEnum = valueEnum;
        }
        return s;
      });
    });
  }, []);

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
        title="医院"
        handleData={(data: any) => {
          const names: string[] = [];
          const column: any = columns.find((item) => item.dataIndex === 'departmentNames');
          data.departmentIds.forEach((id: string) => {
            if (column && column?.valueEnum) {
              const { text } = column?.valueEnum[id];
              names.push(text);
            }
          });
          data.departmentIds = data.departmentIds.join(',');
          data.departmentNames = names.join(',');
          return data;
        }}
        saveRequest={saveHospital}
        updateRequest={updateHospital}
        detail={async (params: any) => {
          const data: any = await getHospitalDetailById(params);
          data.departmentIds_form_key = data.departmentIds.split(',');
          return data;
        }}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Hospital;
