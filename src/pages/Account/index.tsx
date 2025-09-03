/*
 * @Author: 郭郭
 * @Date: 2025/8/8
 * @Description:
 */

import {
  deleteAccount,
  getAccountInfoById,
  queryUserList,
  saveAccount,
  updateAccount,
  updateAccountState,
} from '@/api/account';
import { queryHospitalPage } from '@/api/hospital';
import { queryRoleDataList } from '@/api/permission/role';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Account = () => {
  const tableRef: any = useRef();
  const modalRef: any = useRef();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '姓名',
      dataIndex: 'name',
      formKey: 'name_form_key',
      required: true,
      width: 140,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalName',
      formKey: 'hospitalId_form_key',
      hideInSearch: true,
      hideInForm: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalId',
      hideInSearch: true,
      hideInTable: true,
      type: 'select',
      fieldBind: {
        options: [],
      },
    },
    {
      title: '上级姓名',
      dataIndex: 'parentName',
      hideInSearch: true,
      hideInForm: true,
      width: 140,
    },
    {
      title: '账号',
      dataIndex: 'account',
      hideInSearch: true,
      required: true,
      width: 100,
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInSearch: true,
      hideInTable: true,
      fieldBind: {
        type: 'password',
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: true,
      required: true,
      // @ts-ignore
      rules: [{ pattern: /^1[34578]\d{9}$/, message: '请输入正确手机号' }],
      fieldBind: {
        maxLength: 11,
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
      required: true,
      // @ts-ignore
      rules: [{ patter: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确邮箱' }],
    },
    {
      title: '角色',
      dataIndex: 'roleCode',
      formKey: 'roleCode_form_key',
      type: 'select',
      valueEnum: {},
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
      type: 'radio',
      required: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      hideInForm: true,
      width: 190,
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
            <Button
              type="link"
              onClick={() => {
                openModal(record);
              }}
            >
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const openModal = (record: any = null) => {
    const result = columns.find((item) => item.dataIndex === 'account');
    if (result) {
      result.fieldBind = {
        disabled: !!record,
      };
    }
    setColumns([...columns]);
    modalRef.current.open(record || {});
  };

  useEffect(() => {
    queryRoleDataList({ pageSizeZero: true, pagSize: 0 }).then(({ list }: any) => {
      const column: CustomColumnProps | undefined = columns.find(
        (item) => item.dataIndex === 'roleCode',
      );
      if (column) {
        const valueEnum: any = {};
        list.forEach((item: any) => {
          valueEnum[item.code] = {
            text: item.name,
          };
        });
        column.valueEnum = valueEnum;
      }

      setColumns([...columns]);
    });
    queryHospitalPage({ pageSizeZero: true, pagSize: 0 }).then(({ list }: any) => {
      const column: CustomColumnProps | undefined = columns.find(
        (item) => item.dataIndex === 'hospitalId',
      );
      if (column && column.fieldBind) {
        column.fieldBind.options = list.map((item: any) => ({ label: item.name, value: item.id }));
      }
    });
  }, []);

  return (
    <>
      <CustomTable
        ref={tableRef}
        columns={columns}
        request={queryUserList}
        deleteRequest={deleteAccount}
        updateStateRequest={updateAccountState}
        toolBarRender={[
          <Button type="primary" onClick={() => openModal()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="账号"
        saveRequest={saveAccount}
        updateRequest={updateAccount}
        detail={getAccountInfoById}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Account;
