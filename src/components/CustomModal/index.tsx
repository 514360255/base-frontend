/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { CustomColumnProps, CustomModalProps } from '@/components/compontent';
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  TreeSelect,
} from 'antd';
import { FormRef } from 'rc-field-form';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './index.less';

const CustomModal = forwardRef<any, CustomModalProps>(
  (props: Omit<CustomModalProps, 'ref'>, ref) => {
    const {
      type,
      onSubmit,
      columns,
      saveRequest,
      updateRequest,
      detail,
      handleData,
      title,
      ...other
    } = props;
    const formRef: React.LegacyRef<FormRef<any>> | undefined = useRef<any>();
    const [values, setValues] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, messageHolder] = message.useMessage();
    const [newColumns, setNewColumns] = useState<CustomColumnProps[]>(
      (columns || []).filter((item: CustomColumnProps) => !item.hideInForm),
    );
    const modalType: any = {
      modal: Modal,
      drawer: Drawer,
      detail: <></>,
    };
    const comField: any = {
      input: Input,
      radio: Radio.Group,
      select: Select,
      inputNumber: InputNumber,
      treeSelect: TreeSelect,
    };
    const Component = modalType[type || 'drawer'];

    useImperativeHandle(ref, () => ({
      async open(values: { [key: string]: any }) {
        setOpen(true);
        if (values && values.id && detail) {
          const data = await detail(values.id);
          // columns?.forEach((item: any) => {
          //   if (item.type === 'treeSelect') {
          //     console.log(item);
          //     if (Array.isArray(data[item.type])) {
          //       data[item.type] = data[item.type].map((t) => ({ label: '111', value: t }));
          //       console.log(data[item.type]);
          //     }
          //   }
          // });
          formRef?.current?.setFieldsValue(data || {});
          setValues(data || {});
          return;
        }
        setTimeout(() => {
          formRef?.current?.setFieldsValue(values || {});
          setValues(values || {});
        });
      },
    }));

    const handleValueEnum = (data: { [key: string]: any } = {}) => {
      const result = [];
      for (let key in data) {
        const isNumber = /^\d+$/.test(key);
        result.push({ label: data[key]?.text || '-', value: isNumber ? Number(key) : key });
      }
      return result;
    };

    const submitEvent = async () => {
      setLoading(true);
      try {
        const formData = await formRef.current?.validateFields();
        let data = { ...formData };
        if (handleData) {
          data = handleData(data);
        }
        if (values.id) {
          updateRequest && (await updateRequest({ ...values, ...data }));
        } else {
          saveRequest && (await saveRequest(data));
        }
        setOpen(false);
        formRef.current?.resetFields();
        onSubmit && onSubmit(true);
        messageApi.success('提交成功');
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    const close = () => {
      setOpen(false);
      formRef.current?.resetFields();
      onSubmit && onSubmit();
    };

    const footer = [
      <Button key="cancel" size="large" onClick={close}>
        取消
      </Button>,
      <Button key="submit" type="primary" size="large" loading={loading} onClick={submitEvent}>
        提交
      </Button>,
    ];

    useEffect(() => {
      setNewColumns((columns || []).filter((item: CustomColumnProps) => !item.hideInForm));
    }, [columns]);

    return (
      <>
        {messageHolder}
        <Component
          width={other.width || 600}
          footer={footer}
          title={`${!!values.id ? '编辑' : '新增'}${title}`}
          {...other}
          open={open}
          onClose={close}
          className={styles.formContainer}
        >
          <Form size="large" layout="vertical" ref={formRef}>
            {(newColumns || []).map((item) => {
              const FieldComponent = comField[item.type || 'input'];
              const defaultPlaceholder = `请${
                ['input'].includes(item.type || 'input') ? '输入' : '选择'
              }${item.title}`;
              return (
                <Form.Item
                  key={item.dataIndex}
                  label={`${item.title}`}
                  name={item.dataIndex}
                  rules={[
                    {
                      required: item.required,
                      message: defaultPlaceholder,
                    },
                    ...(item.rules || []),
                  ]}
                >
                  <FieldComponent
                    style={{ width: '100%' }}
                    {...(['radio', 'select'].includes(item.type as string)
                      ? { options: handleValueEnum(item.valueEnum) }
                      : {})}
                    placeholder={defaultPlaceholder}
                    {...(item.fieldBind || {})}
                  />
                </Form.Item>
              );
            })}
          </Form>
        </Component>
      </>
    );
  },
);

export default CustomModal;
