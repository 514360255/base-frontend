/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { CustomModalProps } from '@/components/compontent';
import { Button, Drawer, Form, Input, Modal, Radio, Select } from 'antd';
import { FormRef } from 'rc-field-form';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const CustomModal = ({
  type,
  onSubmit,
  visible,
  columns,
  values = {},
  ...other
}: CustomModalProps) => {
  const formRef: React.LegacyRef<FormRef<any>> | undefined = useRef<any>();
  const [open, setOpen] = useState(false);
  const modalType: any = {
    modal: Modal,
    drawer: Drawer,
    detail: <></>,
  };
  const comField: any = {
    input: Input,
    radio: Radio.Group,
    select: Select,
  };
  const Component = modalType[type || 'drawer'];

  const handleValueEnum = (data: { [key: string]: any } = {}) => {
    const result = [];
    for (let key in data) {
      result.push({ label: data[key]?.text || '-', value: key });
    }
    return result;
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
    <Button key="submit" type="primary" size="large">
      提交
    </Button>,
  ];

  useEffect(() => {
    setTimeout(() => {
      if (visible) {
        formRef?.current?.setFieldsValue(values || {});
      }
    });
  }, [values]);

  useEffect(() => {
    setOpen(visible as boolean);
  }, [visible]);

  return (
    <Component
      width={other.width || 600}
      footer={footer}
      {...other}
      open={open}
      onClose={close}
      className={styles.formContainer}
    >
      <Form size="large" layout="vertical" ref={formRef}>
        {(columns || []).map((item) => {
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
  );
};

export default React.memo(CustomModal);
