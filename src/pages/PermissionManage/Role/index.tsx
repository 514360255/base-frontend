/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { queryMenuPage } from '@/api/permission/menu';
import {
  deleteRole,
  detailById,
  queryRoleDataList,
  saveRole,
  updateRole,
  updateRoleState,
} from '@/api/permission/role';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { handleTree } from '@/utils';
import { Button, TreeSelect } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Role = () => {
  const tableRef: any = useRef();
  const modalRef: any = useRef();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '角色名称',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '角色CODE',
      dataIndex: 'code',
      hideInSearch: true,
      required: true,
      fieldBind: {
        disabled: false,
      },
    },
    {
      title: '菜单',
      dataIndex: 'menuIds',
      hideInSearch: true,
      required: true,
      hideInTable: true,
      type: 'treeSelect',
      fieldBind: {
        treeData: [],
        treeCheckable: true,
        showCheckedStrategy: TreeSelect.SHOW_ALL,
        treeCheckStrictly: true,
        treeDefaultExpandAll: true,
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
      buttons: (record: any) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setColumns((s: CustomColumnProps[]) => {
                  const column: CustomColumnProps | undefined = s.find(
                    (item) => item.dataIndex === 'code',
                  );
                  if (column) {
                    column.fieldBind = {
                      disabled: true,
                    };
                  }
                  return s;
                });
                modalRef.current.open(record);
              }}
            >
              编辑
            </Button>
          </>
        );
      },
    },
  ]);

  const handleFormData = (data: any) => {
    data.menuIds = data.menuIds?.map((item: any) => item.value);
    return data;
  };

  useEffect(() => {
    queryMenuPage({ pageSizeZero: true, pagSize: 0 }).then(({ list }: any) => {
      setColumns((s: CustomColumnProps[]) => {
        const column: CustomColumnProps | undefined = s.find(
          (item) => item.dataIndex === 'menuIds',
        );
        if (column && column.fieldBind) {
          column.fieldBind.treeData = handleTree(list);
          console.log(handleTree(list));
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
        request={queryRoleDataList}
        deleteRequest={deleteRole}
        updateStateRequest={updateRoleState}
        toolBarRender={[
          <Button type="primary" onClick={() => modalRef.current.open()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        handleData={handleFormData}
        ref={modalRef}
        title="角色"
        saveRequest={saveRole}
        updateRequest={updateRole}
        detail={detailById}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Role;
