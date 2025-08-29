/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import {
  delMenu,
  getDetailById,
  queryMenuPage,
  saveMenu,
  updateMenu,
  updateMenuState,
} from '@/api/permission/menu';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum, MENU_TYPE_ENUM } from '@/constants/enum';
import { handleTree } from '@/utils';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Menu = () => {
  const modalRef: any = useRef();
  const tableRef: any = useRef();
  const defaultRoot = { title: '根路由', value: 0 };
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '上级菜单名称',
      dataIndex: 'parentId',
      required: true,
      hideInTable: true,
      hideInSearch: true,
      type: 'treeSelect',
      fieldBind: {
        treeData: [defaultRoot],
      },
    },
    {
      title: '菜单名称',
      dataIndex: 'name',
      required: true,
      hideInSearch: true,
    },
    {
      title: '菜单路径',
      dataIndex: 'pathname',
      hideInSearch: true,
      required: true,
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      hideInSearch: true,
      required: true,
      type: 'radio',
      valueEnum: MENU_TYPE_ENUM,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: ENABLE_DISABLE_Enum,
      hideInSearch: true,
      type: 'radio',
      required: true,
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      hideInSearch: true,
      type: 'inputNumber',
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
            <Button type="link" onClick={() => addMenu({ parentId: record.id })}>
              新增下级
            </Button>
          </>
        );
      },
    },
  ]);

  const getData = async () => {
    const { list }: any = await queryMenuPage({ pageSizeZero: true, pagSize: 0 });
    setColumns((s: CustomColumnProps[]) => {
      const column: CustomColumnProps | undefined = s.find((item) => item.dataIndex === 'parentId');
      if (column && column.fieldBind) {
        column.fieldBind.treeData = [defaultRoot, ...handleTree(list)];
      }
      return s;
    });
  };

  const addMenu = async (record: any = {}) => {
    await getData();
    modalRef.current.open({ isActive: 1, type: 1, ...record });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <CustomTable
        search={false}
        isIndex={false}
        ref={tableRef}
        columns={columns}
        defaultQueryParams={{ pageSizeZero: true, pagSize: 0 }}
        request={queryMenuPage}
        deleteRequest={delMenu}
        updateStateRequest={updateMenuState}
        toolBarRender={[
          <Button type="primary" onClick={() => addMenu()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="菜单"
        saveRequest={saveMenu}
        updateRequest={updateMenu}
        detail={getDetailById}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Menu;
