/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */

import { queryAdminUserList } from '@/api/account';
import { queryDepartmentPage } from '@/api/appointmentDepartment';
import { uploadImg } from '@/api/file';
import {
  deleteHospital,
  getHospitalDetailById,
  queryHospitalPage,
  saveHospital,
  updateHospital,
  updateHospitalSecret,
  updateHospitalState,
} from '@/api/hospital';
import { CustomColumnProps } from '@/components/compontent';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { USER_INFO_KEY } from '@/constants';
import { ENABLE_DISABLE_Enum, YES_NO } from '@/constants/enum';
import { transformValueEnum } from '@/utils';
import Local from '@/utils/store';
import { Button, Form, Input, message, Modal } from 'antd';
import { FormRef } from 'rc-field-form';
import { LegacyRef, useEffect, useRef, useState } from 'react';

const Hospital = () => {
  const userInfo = Local.get(USER_INFO_KEY);
  const isAdmin = userInfo.roleCode === 'SUPER_ADMIN';
  const modalRef: any = useRef();
  const tableRef: any = useRef();
  const formRef: LegacyRef<FormRef> | undefined = useRef<any>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, messageHolder] = message.useMessage();
  const [columns, setColumns] = useState<CustomColumnProps[]>([
    {
      title: '所属人',
      dataIndex: 'accountName',
      formKey: 'accountId',
      required: true,
      hideInSearch: !isAdmin,
      hideInForm: !isAdmin,
      hideInTable: !isAdmin,
      type: 'select',
    },
    {
      title: '医院名称',
      dataIndex: 'name',
      required: true,
      ellipsis: true,
    },
    {
      title: '医院CODE',
      dataIndex: 'code',
      hideInSearch: true,
      hideInForm: true,
      ellipsis: true,
    },
    {
      title: '医院介绍主图',
      dataIndex: 'introPic',
      hideInTable: true,
      hideInSearch: true,
      type: 'upload',
      fieldBind: {
        maxCount: 1,
        request: uploadImg,
        isCrop: true,
        imgCrop: {
          aspect: 217 / 217,
        },
      },
    },
    {
      title: '医院环境',
      dataIndex: 'envPic',
      hideInTable: true,
      hideInSearch: true,
      type: 'upload',
      fieldBind: {
        request: uploadImg,
        isCrop: true,
        imgCrop: {
          aspect: 18 / 12,
        },
      },
    },
    {
      title: '医院特色',
      dataIndex: 'feature',
      hideInSearch: true,
      required: true,
    },
    {
      title: '收件人',
      dataIndex: 'recipient',
      tooltip: '多个邮箱用";"分隔开',
      hideInSearch: true,
      type: 'textArea',
      ellipsis: true,
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
      title: '授权次数',
      dataIndex: 'authNumber',
      hideInSearch: true,
      hideInForm: true,
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
      title: '接诊时间',
      dataIndex: 'consultationHours',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '医院地址',
      dataIndex: 'address',
      hideInSearch: true,
      hideInTable: true,
      required: true,
    },
    {
      title: '医院简介',
      dataIndex: 'description',
      hideInSearch: true,
      hideInTable: true,
      required: true,
      type: 'textArea',
      ellipsis: true,
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '额外参数',
      dataIndex: 'ext',
      hideInSearch: true,
      hideInTable: true,
      type: 'textArea',
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '疾病类型',
      dataIndex: 'diseaseType',
      hideInSearch: true,
      hideInTable: true,
      type: 'textArea',
      fieldBind: {
        rows: 5,
      },
    },
    {
      title: '是否展示医生栏目',
      dataIndex: 'isShowDoctorColumn',
      valueType: 'select',
      valueEnum: YES_NO,
      type: 'radio',
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
      width: isAdmin ? 280 : 200,
      buttons: (record: any) => {
        return (
          <>
            <Button type="link" onClick={() => addHospital(record)}>
              编辑
            </Button>
            {isAdmin && (
              <Button
                type="link"
                onClick={() => {
                  setOpen(true);
                  formRef.current?.setFieldValue('id', record.id);
                }}
              >
                修改密钥
              </Button>
            )}
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

  const submit = async (data: any) => {
    const { envPic, introPic, ...other } = data;
    const params = {
      ...other,
      envPic: JSON.stringify(envPic || []),
      introPic: JSON.stringify(introPic || []),
    };
    if (data.id) {
      await updateHospital(params);
    } else {
      await saveHospital(params);
    }
  };

  const updateSecretEvent = async () => {
    setLoading(true);
    try {
      const { id, key } = await formRef.current?.validateFields();
      await updateHospitalSecret(id, key);
      messageApi.success('修改成功');
      formRef.current?.resetFields();
      setOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      queryAdminUserList().then((data: any) => {
        setColumns(transformValueEnum(columns, data, 'accountName'));
      });
    }
    queryDepartmentPage({ pageSizeZero: true, pageSize: 0 }).then(({ list }: any) => {
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
      {messageHolder}
      <Modal
        open={open}
        title="修改密钥"
        onCancel={() => setOpen(false)}
        onOk={updateSecretEvent}
        confirmLoading={loading}
      >
        <Form size="large" layout="vertical" ref={formRef}>
          <Form.Item noStyle name="id">
            <Input hidden />
          </Form.Item>
          <Form.Item label="密钥" name="key" rules={[{ required: true, message: '请输入密钥' }]}>
            <Input placeholder="请输入密钥" />
          </Form.Item>
        </Form>
      </Modal>
      <CustomTable
        ref={tableRef}
        columns={columns}
        request={async (params: any) => {
          params.departmentId = params.departmentNames;
          params.accountId = params.accountName;
          delete params.accountName;
          delete params.departmentNames;
          return await queryHospitalPage(params);
        }}
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
        saveRequest={submit}
        updateRequest={submit}
        detail={async (params: any) => {
          const data: any = await getHospitalDetailById(params);
          data.departmentIds_form_key = data.departmentIds.split(',');
          data.accountId_form_key = data.accountId;
          data.envPic = JSON.parse(data.envPic || '[]');
          data.introPic = JSON.parse(data.introPic || '[]');
          return data;
        }}
        columns={columns}
        onSubmit={() => tableRef.current.reload()}
      />
    </>
  );
};

export default Hospital;
