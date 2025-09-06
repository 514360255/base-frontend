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
import cloneDeep from 'lodash/cloneDeep';
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
    const formKey = '_form_key';
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
      textArea: Input.TextArea,
    };
    const Component = modalType[type || 'drawer'];

    const handleColumns = () => {
      const newColumns: CustomColumnProps[] = (columns || []).filter(
        (item: CustomColumnProps) => !item.hideInForm,
      );
      return cloneDeep(newColumns).map((item) => {
        if (item.formKey) {
          item.dataIndex = item.formKey;
        }
        return item;
      });
    };
    const [newColumns, setNewColumns] = useState<CustomColumnProps[]>(handleColumns());

    useImperativeHandle(ref, () => ({
      async open(values: { [key: string]: any }) {
        setOpen(true);
        if (values && values.id && detail) {
          const data = await detail(values.id);
          columns?.forEach((item: CustomColumnProps) => {
            if (item.formKey) {
              data[`${item.dataIndex}${formKey}`] = data[item.dataIndex];
            }
          });
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
        const data = { ...values, ...formData };
        let result: any = {};
        for (const key in data) {
          if (new RegExp(formKey).test(key)) {
            result[key.replace(new RegExp(formKey), '')] = data[key];
          } else {
            result[key] = data[key];
          }
        }
        if (handleData) {
          result = handleData(result);
        }
        if (values.id) {
          updateRequest && (await updateRequest(result));
        } else {
          saveRequest && (await saveRequest(result));
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
      setNewColumns(handleColumns());
    }, [JSON.stringify(columns)]);

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
                    {...(['radio', 'checkbox', 'inputNumber'].includes(item.type as string)
                      ? {}
                      : { allowClear: true })}
                    {...(['select'].includes(item.type as string)
                      ? { showSearch: true, optionFilterProp: 'label' }
                      : {})}
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
