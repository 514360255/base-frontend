/*
 * @Author: 郭郭
 * @Date: 2025/9/4
 * @Description:
 */

import {
  deleteDict,
  getDictDetailById,
  queryDictList,
  queryDictPage,
  saveDict,
  updateDict,
  updateDictState,
} from '@/api/dict';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { ENABLE_DISABLE_Enum } from '@/constants/enum';
import { handleTree } from '@/utils';
import { Button } from 'antd';
import { useRef, useState } from 'react';

const Dict = () => {
  const modalRef: any = useRef();
  const tableRef: any = useRef();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '字典名称',
      dataIndex: 'name',
      required: true,
    },
    {
      title: '上级字典名称',
      dataIndex: 'parentId',
      hideInSearch: true,
      hideInTable: true,
      required: true,
      type: 'treeSelect',
      fieldBind: { treeData: [] },
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      type: 'inputNumber',
      required: true,
      hideInSearch: true,
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
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      type: 'textArea',
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
      width: 230,
      buttons: (record: any) => {
        return (
          <>
            <Button type="link" onClick={() => addDict(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => addDict({ parentId: record.id })}>
              新增下级
            </Button>
          </>
        );
      },
    },
  ]);

  const addDict = async (record: any = null) => {
    const dataList: any = await queryDictList();
    setColumns((s: CustomColumnProps[]) => {
      const column: CustomColumnProps | undefined = s.find((item) => item.dataIndex === 'code');
      const parentColumn: CustomColumnProps | undefined = s.find(
        (item) => item.dataIndex === 'parentId',
      );
      if (parentColumn && parentColumn.fieldBind) {
        parentColumn.fieldBind.treeData = [{ value: 0, label: '根节点' }, ...handleTree(dataList)];
      }
      if (column && column.fieldBind) {
        column.fieldBind = {
          disabled: !!record,
        };
      }
      return s;
    });
    modalRef.current.open({ isActive: 1, ...(record || []) });
  };

  return (
    <>
      <CustomTable
        isIndex={false}
        isUpdateState={false}
        ref={tableRef}
        columns={columns}
        request={queryDictPage}
        deleteRequest={deleteDict}
        updateStateRequest={updateDictState}
        toolBarRender={[
          <Button type="primary" onClick={() => addDict()}>
            新增
          </Button>,
        ]}
      />
      <CustomModal
        ref={modalRef}
        title="字典"
        saveRequest={saveDict}
        updateRequest={updateDict}
        detail={getDictDetailById}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Dict;
